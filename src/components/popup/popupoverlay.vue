<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      ref="overlayEl"
      class="po-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Announcement overlay popup"
      @click.self="close"
    >
      <div ref="cardEl" class="po-card">
        <button ref="closeBtnEl" class="po-close" type="button" aria-label="Close" @click="close">
          ✕
        </button>

        <!-- Dark-blue background -->
        <div class="po-bg" aria-hidden="true">
          <div ref="gridEl" class="po-grid"></div>
          <div class="po-glow po-glow-1"></div>
          <div class="po-glow po-glow-2"></div>
          <div class="po-noise"></div>
        </div>

        <div class="po-content">
          <div class="po-media" ref="mediaEl" :style="{ aspectRatio: imgAspect }">
            <img
              v-if="imageSrc"
              ref="imgEl"
              class="po-img"
              :src="imageSrc"
              :alt="imageAlt"
              loading="eager"
              decoding="async"
              @load="onImgLoad"
            />
          </div>

          <div class="po-body" ref="bodyEl">
            <h2 class="po-title">{{ titleText }}</h2>
            <p class="po-desc">{{ descText }}</p>

            <div class="po-actions" ref="actionsEl">
              <button v-if="hasLink" class="po-btn po-primary" type="button" @click="onPrimary">
                {{ primaryText }}
              </button>

              <button class="po-btn po-ghost" type="button" @click="close">
                ປິດ
              </button>
            </div>

            <!-- (optional debug) แสดง timeforshow -->
            <!-- <small style="opacity:.7">timeforshow: {{ current?.timeforshow }} ชั่วโมง</small> -->
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  // Env-only: use VITE_API_BASE_URL + this path
  apiPath: { type: String, default: "/api/announcement" },

  // Fallback content
  fallbackTitle: { type: String, default: "Announcement" },
  fallbackDescription: { type: String, default: "" },
  fallbackImageAlt: { type: String, default: "Announcement image" },

  // Auto popup
  autoShow: { type: Boolean, default: true }
});

const emit = defineEmits(["primary", "closed", "loaded", "error"]);

// -------------------- Env-only API base (Vite) --------------------
function resolveEnvBaseUrl() {
  // IMPORTANT: Use direct access so Vite injects import.meta.env correctly.
  const raw = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  return raw.replace(/\/+$/, "");
}

function normalizeBaseUrl(u) {
  return String(u || "").trim().replace(/\/+$/, "");
}

function joinBaseAndPath(baseUrl, path) {
  const b = normalizeBaseUrl(baseUrl);
  const p = String(path || "");

  if (!b) return p;

  // Prevent double "/api"
  // - If base ends with "/api" and path starts with "/api/..." => drop one
  if (b.endsWith("/api") && /^\/api(\/|$)/i.test(p)) {
    return b + p.replace(/^\/api/i, "");
  }

  if (!p) return b;
  if (p.startsWith("/")) return b + p;
  return b + "/" + p;
}

const API_BASE = normalizeBaseUrl(resolveEnvBaseUrl());
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;

const apiUrl = computed(() => joinBaseAndPath(API_BASE, props.apiPath));

// -------------------- Image URL normalization helpers --------------------
function isLoopbackHost(hostname) {
  const h = String(hostname || "").toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
}

function isLikelyAssetPath(pathname) {
  const p = String(pathname || "");
  return /^\/(uploads|upload|images|files|static)\b/i.test(p) || p.includes("/uploads/") || p.includes("/images/");
}

const ASSET_BASE_URL = (() => {
  try {
    return ASSET_BASE ? new URL(ASSET_BASE) : null;
  } catch {
    return null;
  }
})();

function rewriteBadAbsoluteToEnvBase(absoluteUrl) {
  try {
    const u = new URL(absoluteUrl);
    const fullPath = `${u.pathname || ""}${u.search || ""}`;

    // Rewrite when backend returns localhost (wrong outside local machine)
    if (isLoopbackHost(u.hostname)) {
      return ASSET_BASE ? joinBaseAndPath(ASSET_BASE, fullPath) : absoluteUrl;
    }

    // Rewrite when it looks like an asset path but host does not match our env asset base
    if (ASSET_BASE_URL && isLikelyAssetPath(u.pathname) && u.hostname !== ASSET_BASE_URL.hostname) {
      return joinBaseAndPath(ASSET_BASE, fullPath);
    }

    return absoluteUrl;
  } catch {
    return absoluteUrl;
  }
}

function extractImageString(img) {
  if (!img) return "";
  if (typeof img === "string") return img;

  // Array -> take first valid string
  if (Array.isArray(img)) {
    for (const it of img) {
      const s = extractImageString(it);
      if (s) return s;
    }
    return "";
  }

  // Object -> try common keys
  const candidates = [
    img?.url,
    img?.path,
    img?.src,
    img?.image,
    img?.file,
    img?.filePath,
    img?.filename,
    img?.name,
    img?.download_url
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }

  if (img?.data) return extractImageString(img.data);
  return "";
}

function resolveImage(img) {
  const s = extractImageString(img).trim();
  if (!s) return "";

  // Data URL
  if (/^data:image\//i.test(s)) return s;

  // Absolute URL
  if (/^https?:\/\//i.test(s)) return rewriteBadAbsoluteToEnvBase(s);

  // Absolute path from server (e.g. "/uploads/...") => use ASSET_BASE
  if (s.startsWith("/")) return joinBaseAndPath(ASSET_BASE, s);

  // Relative path => use ASSET_BASE
  return joinBaseAndPath(ASSET_BASE, "/" + s);
}

// refs (DOM)
const overlayEl = ref(null);
const cardEl = ref(null);
const closeBtnEl = ref(null);
const mediaEl = ref(null);
const imgEl = ref(null);
const bodyEl = ref(null);
const actionsEl = ref(null);
const gridEl = ref(null);

// state
const isOpen = ref(false);
const announcements = ref([]); // All rows from API
const queue = ref([]); // Rows that are due to show
const queueIndex = ref(0);
const current = computed(() => queue.value[queueIndex.value] || null);
const imgAspect = ref("16 / 9");

// timer
let nextCheckTimer = null;

// animations
let introTl = null;
let outroTl = null;
let floatTween = null;
let gridTween = null;
let isClosing = false;

// -------------------- Mapping from API table --------------------
const imageSrc = computed(() => {
  const a = current.value;
  return resolveImage(a?.image_url || a?.image || "");
});

const imageAlt = computed(() => props.fallbackImageAlt);

const titleText = computed(() => {
  const a = current.value;
  return (a?.title || "").trim() || props.fallbackTitle;
});

const descText = computed(() => {
  const a = current.value;
  return (a?.description || "").trim() || props.fallbackDescription;
});

const hasLink = computed(() => {
  const link = String(current.value?.linkpath || "").trim();
  return !!link;
});

const primaryText = computed(() => {
  const link = String(current.value?.linkpath || "").trim();
  if (!link) return "";
  try {
    // Validate URL
    new URL(link);
    return "ອ່ານເພີ່ມ";
  } catch {
    return "ປິດ";
  }
});

function onImgLoad(e) {
  const img = e?.target;
  if (img?.naturalWidth && img?.naturalHeight) {
    imgAspect.value = `${img.naturalWidth} / ${img.naturalHeight}`;
  }
}

// -------------------- timeforshow (hours) -> interval ms --------------------
function getIntervalMsFor(row) {
  const raw = row?.timeforshow;
  const n = Number(raw);

  // If missing/invalid -> default 3 hours
  const hours = Number.isFinite(n) && n > 0 ? n : 3;
  return hours * 60 * 60 * 1000;
}

function getStorageKeyFor(row) {
  const id = row?.idannouncement;
  return `announcement_last_shown_${id ?? "unknown"}`;
}

function getLastShownMsFor(row) {
  try {
    const v = Number(localStorage.getItem(getStorageKeyFor(row)));
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

function setLastShownMsFor(row, ms) {
  try {
    localStorage.setItem(getStorageKeyFor(row), String(ms));
  } catch {}
}

function isRowActive(row) {
  return Number(row?.active) === 1;
}

function isDueToShow(row) {
  if (!row) return false;
  if (!isRowActive(row)) return false;

  const interval = getIntervalMsFor(row);
  const last = getLastShownMsFor(row);
  const now = Date.now();

  return !last || now - last >= interval;
}

// Build queue: all announcements that are due -> show sequentially
function buildQueueFromRows(rows) {
  const arr = Array.isArray(rows) ? rows : [];
  // Stable ordering (new -> old)
  arr.sort((a, b) => Number(b?.idannouncement ?? 0) - Number(a?.idannouncement ?? 0));
  return arr.filter(isDueToShow);
}

// Compute next remaining time to schedule a re-check
function computeNextRemainingMs(rows) {
  const now = Date.now();
  let min = Infinity;
  let hasActive = false;

  for (const row of rows || []) {
    if (!isRowActive(row)) continue;
    hasActive = true;

    const interval = getIntervalMsFor(row);
    const last = getLastShownMsFor(row);

    if (!last) return 0; // Never shown -> can show immediately

    const elapsed = now - last;
    const remaining = interval - elapsed;
    if (remaining <= 0) return 0;
    if (remaining < min) min = remaining;
  }

  if (!hasActive) return null;
  return min === Infinity ? null : min;
}

function scheduleNextCheck() {
  if (!props.autoShow) return;
  clearTimeout(nextCheckTimer);

  const remaining = computeNextRemainingMs(announcements.value);
  if (remaining === null) return;

  // Minimum 1s to avoid spamming
  const wait = Math.max(1_000, remaining);

  nextCheckTimer = setTimeout(() => {
    fetchAnnouncements();
  }, wait);
}

// -------------------- Fetch announcements (env-only base) --------------------
async function fetchAnnouncements() {
  try {
    if (!API_BASE) {
      throw new Error("Missing VITE_API_BASE_URL in .env");
    }

    const res = await fetch(apiUrl.value, { method: "GET", headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const json = await res.json();
    const rows = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

    announcements.value = rows;
    emit("loaded", rows);

    await nextTick();
    tryAutoOpenQueue();
  } catch (e) {
    // Keep silent UI; report via events
    console.error("ANNOUNCEMENT FETCH ERROR:", e);
    emit("error", e);
  }
}

// -------------------- Open queue logic --------------------
async function tryAutoOpenQueue() {
  if (!props.autoShow) return;
  if (isOpen.value) return;

  const q = buildQueueFromRows(announcements.value);
  queue.value = q;
  queueIndex.value = 0;

  if (!queue.value.length) {
    scheduleNextCheck();
    return;
  }

  // Mark all rows in this queue as shown "now" to avoid reopening immediately in the same cycle
  const now = Date.now();
  for (const row of queue.value) setLastShownMsFor(row, now);

  open();
}

// -------------------- Animations open/close/next --------------------
function onKeydown(e) {
  if (!isOpen.value) return;
  if (e.key === "Escape") close();
}

async function playIntroFull() {
  await nextTick();

  introTl?.kill();
  outroTl?.kill();
  floatTween?.kill();
  gridTween?.kill();

  gsap.set(overlayEl.value, { opacity: 0 });
  gsap.set(cardEl.value, {
    opacity: 0,
    y: 46,
    scale: 0.985,
    rotateX: 6,
    transformPerspective: 900
  });
  gsap.set([mediaEl.value, bodyEl.value, actionsEl.value], { opacity: 0, y: 14 });

  if (imgEl.value) gsap.set(imgEl.value, { scale: 1.12, transformOrigin: "50% 50%" });

  introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  introTl
    .to(overlayEl.value, { opacity: 1, duration: 0.28 })
    .to(cardEl.value, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.55 }, "-=0.08")
    .to(mediaEl.value, { opacity: 1, y: 0, duration: 0.33 }, "-=0.25")
    .to(bodyEl.value, { opacity: 1, y: 0, duration: 0.33 }, "-=0.28")
    .to(actionsEl.value, { opacity: 1, y: 0, duration: 0.26 }, "-=0.22");

  if (imgEl.value) introTl.to(imgEl.value, { scale: 1, duration: 0.65, ease: "power2.out" }, "-=0.55");

  floatTween = gsap.to(cardEl.value, { y: "+=8", duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gridTween = gsap.to(gridEl.value, { x: "-=40", y: "+=30", duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 });

  closeBtnEl.value?.focus?.();
}

async function playSwapToNext() {
  introTl?.kill();
  floatTween?.kill();
  gridTween?.kill();

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  tl.to([actionsEl.value, bodyEl.value, mediaEl.value], { opacity: 0, y: 10, duration: 0.16, stagger: 0.03 });
  await new Promise((resolve) => tl.eventCallback("onComplete", resolve));

  queueIndex.value += 1;
  imgAspect.value = "16 / 9";
  await nextTick();

  gsap.set([mediaEl.value, bodyEl.value, actionsEl.value], { opacity: 0, y: 14 });
  if (imgEl.value) gsap.set(imgEl.value, { scale: 1.12, transformOrigin: "50% 50%" });

  const tlIn = gsap.timeline({ defaults: { ease: "power3.out" } });
  tlIn
    .to(mediaEl.value, { opacity: 1, y: 0, duration: 0.28 })
    .to(bodyEl.value, { opacity: 1, y: 0, duration: 0.28 }, "-=0.22")
    .to(actionsEl.value, { opacity: 1, y: 0, duration: 0.22 }, "-=0.20");

  if (imgEl.value) tlIn.to(imgEl.value, { scale: 1, duration: 0.55, ease: "power2.out" }, "-=0.45");

  floatTween = gsap.to(cardEl.value, { y: "+=8", duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gridTween = gsap.to(gridEl.value, { x: "-=40", y: "+=30", duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 });

  closeBtnEl.value?.focus?.();
}

function open() {
  if (isOpen.value) return;
  isOpen.value = true;
  window.addEventListener("keydown", onKeydown);
  playIntroFull();
}

function close() {
  if (!isOpen.value || isClosing) return;

  const hasNext = queueIndex.value + 1 < queue.value.length;
  if (hasNext) {
    // Show next item immediately (no extra delay)
    playSwapToNext();
    return;
  }

  isClosing = true;
  introTl?.kill();
  floatTween?.kill();
  gridTween?.kill();

  outroTl?.kill();
  outroTl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: () => {
      isOpen.value = false;
      emit("closed");
      isClosing = false;
      window.removeEventListener("keydown", onKeydown);

      queue.value = [];
      queueIndex.value = 0;

      // After closing all, schedule next check based on timeforshow
      scheduleNextCheck();
    }
  });

  outroTl
    .to([actionsEl.value, bodyEl.value, mediaEl.value], { opacity: 0, y: 10, duration: 0.18, stagger: 0.04 })
    .to(cardEl.value, { opacity: 0, y: 30, scale: 0.985, duration: 0.22 }, "-=0.08")
    .to(overlayEl.value, { opacity: 0, duration: 0.2 }, "-=0.1");
}

function onPrimary() {
  const link = String(current.value?.linkpath || "").trim();
  if (!link) return;

  emit("primary", link);
  window.open(link, "_blank", "noopener,noreferrer");
  close();
}

onMounted(() => {
  fetchAnnouncements();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  clearTimeout(nextCheckTimer);
  introTl?.kill();
  outroTl?.kill();
  floatTween?.kill();
  gridTween?.kill();
});
</script>

<style scoped>
.po-overlay{
  position:fixed; inset:0; z-index:9999;
  display:grid; place-items:center; padding:16px;
  background: rgba(1, 6, 18, 0.86);
  backdrop-filter: blur(14px);
}
.po-card{
  position:relative;
  width:min(1100px, 92vw);
  max-height: 90vh;
  height: auto;
  border-radius:24px;
  overflow:hidden;
  background: linear-gradient(180deg, rgba(8,14,32,0.90), rgba(6,10,24,0.80));
  border:1px solid rgba(96,165,250,0.18);
  box-shadow: 0 40px 120px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.06);
  color: rgba(240,248,255,0.92);
}

.po-bg{position:absolute; inset:0; overflow:hidden;}
.po-grid{
  position:absolute; inset:-30%;
  background-image:
    linear-gradient(rgba(96,165,250,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96,165,250,0.12) 1px, transparent 1px);
  background-size:60px 60px;
  transform: perspective(1000px) rotateX(58deg);
  opacity:0.18;
}
.po-glow{position:absolute; width:820px; height:820px; border-radius:50%; filter: blur(80px); opacity:0.55;}
.po-glow-1{left:-260px; top:-260px; background: radial-gradient(circle at 30% 30%, rgba(37,99,235,0.95), rgba(29,78,216,0) 70%);}
.po-glow-2{right:-260px; bottom:-260px; background: radial-gradient(circle at 40% 40%, rgba(56,189,248,0.85), rgba(37,99,235,0) 74%);}
.po-noise{
  position:absolute; inset:0; opacity:0.12; mix-blend-mode: overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
}

.po-content{
  position:relative; z-index:1;
  display:grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: stretch;
}
.po-media{
  padding:14px;
  width:100%;
  min-height: 260px;
}
.po-img{
  width:100%;
  height:100%;
  border-radius:18px;
  object-fit: cover;
  object-position: center;
  border:1px solid rgba(96,165,250,0.18);
  box-shadow: 0 22px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
  transform: translateZ(0);
}
.po-body{
  padding:28px 26px 24px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  overflow:auto;
  max-height: 90vh;
}
.po-title{
  margin:0 0 12px;
  font-size:clamp(22px, 3vw, 44px);
  line-height:1.05;
  letter-spacing:-0.7px;
}
.po-desc{
  margin:0 0 20px;
  color: rgba(219,234,254,0.78);
  line-height:1.65;
  max-width:48ch;
  font-size:15px;
}
.po-actions{display:flex; gap:12px; flex-wrap:wrap;}
.po-btn{
  border-radius:14px;
  padding:12px 16px;
  font-weight:800;
  border:1px solid rgba(96,165,250,0.20);
  color: rgba(240,248,255,0.94);
  cursor:pointer;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}
.po-primary{
  background: linear-gradient(135deg, rgba(37,99,235,1), rgba(56,189,248,0.95));
  border-color: rgba(255,255,255,0.10);
  box-shadow: 0 16px 46px rgba(37,99,235,0.22);
}
.po-primary:hover{transform: translateY(-1px);}
.po-ghost{background: rgba(37,99,235,0.10);}
.po-ghost:hover{transform: translateY(-1px); background: rgba(37,99,235,0.16); border-color: rgba(96,165,250,0.32);}

.po-close{
  position:absolute; top:14px; right:14px;
  width:46px; height:46px;
  border-radius:14px;
  border:1px solid rgba(96,165,250,0.18);
  background: rgba(0,0,0,0.32);
  color: rgba(240,248,255,0.92);
  cursor:pointer;
  z-index:2;
}

@media (max-width: 880px){
  .po-card{width:92vw; max-height:92vh;}
  .po-content{grid-template-columns:1fr;}
  .po-body{padding:16px; justify-content:flex-start;}
  .po-media{min-height: 220px;}
}
</style>
