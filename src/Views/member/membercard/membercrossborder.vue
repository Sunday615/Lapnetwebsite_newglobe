<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { gsap } from "gsap";

import main_navbar from "../../../components/miannavbar/main_navbar.vue";
import membercard from "../../../components/membercard/membercard.vue";
import footermembercrossborder from "../../../components/footer/logomemberfooter/logofootermembercrossborder.vue";
import secondfooter from "../../../components/footer/mainfooter/secondfooter.vue";

/** ✅ API (env only - Vite)
 * Required in .env:
 *   VITE_API_BASE_URL=http://localhost:3000
 */
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
  if (p.startsWith("/")) return `${b}${p}`;
  return `${b}/${p}`;
}

const API_BASE = normalizeBaseUrl(resolveEnvBaseUrl());

// Asset base for images/files (strip trailing "/api" if env includes it)
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;

// Members endpoint
const MEMBERS_API_URL = joinBaseAndPath(API_BASE, "/api/members");

/** ✅ Footer logos (from API) */
const memberLogos = ref([]);

/** ✅ Members (from API) */
const members = ref([]);

/* =========================
   HELPERS (robust)
   ========================= */
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const pickMemberId = (item) => {
  return (
    toNumber(item?.membersid) ??
    toNumber(item?.memberid) ??
    toNumber(item?.memberId) ??
    toNumber(item?.idmember) ??
    toNumber(item?.idMember) ??
    toNumber(item?.id) ??
    toNumber(item?._id) ??
    null
  );
};

const extractImageString = (img) => {
  if (!img) return "";
  if (typeof img === "string") return img;

  if (Array.isArray(img)) {
    for (const it of img) {
      const s = extractImageString(it);
      if (s) return s;
    }
    return "";
  }

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
};

// -------------------- Image URL normalization helpers --------------------
function isLoopbackHost(hostname) {
  const h = String(hostname || "").toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
}

function isLikelyAssetPath(pathname) {
  const p = String(pathname || "");
  return (
    /^\/(uploads|upload|images|files|static)\b/i.test(p) ||
    p.includes("/uploads/") ||
    p.includes("/images/") ||
    p.includes("/files/")
  );
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

const resolveImage = (img) => {
  const s = extractImageString(img).trim();
  if (!s) return "";

  if (/^data:image\//i.test(s)) return s;

  // Absolute URL
  if (/^https?:\/\//i.test(s)) return rewriteBadAbsoluteToEnvBase(s);

  // Absolute path from server (e.g. "/uploads/..") => use ASSET_BASE
  if (s.startsWith("/")) return joinBaseAndPath(ASSET_BASE, s);

  // Relative path (e.g. "uploads/..") => use ASSET_BASE
  return joinBaseAndPath(ASSET_BASE, "/" + s);
};

const extractLinkString = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  const candidates = [v?.url, v?.href, v?.link, v?.value];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }
  return "";
};

const normalizeUrl = (u) => {
  const raw = extractLinkString(u).trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  return `https://${raw.replace(/^\/+/, "")}`;
};

const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  const parts = String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
};

const pickFirstString = (item, paths) => {
  for (const p of paths) {
    const v = p.includes(".") ? getByPath(item, p) : item?.[p];
    const s = extractLinkString(v).trim();
    if (s) return s;
  }
  return "";
};

/** ✅ Convert DB hex to CSS hex (#RRGGBB) */
const normalizeHex = (c) => {
  if (c == null) return "";
  let s = String(c).trim();
  if (!s) return "";

  if (/^0x[0-9a-f]{6,8}$/i.test(s)) s = s.replace(/^0x/i, "#");

  if (/^#?[0-9a-f]{3,8}$/i.test(s)) {
    if (!s.startsWith("#")) s = `#${s}`;
    const hex = s.slice(1);

    if (hex.length === 3) {
      const r = hex[0],
        g = hex[1],
        b = hex[2];
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }
    if (hex.length === 6) return `#${hex}`.toUpperCase();
    if (hex.length === 8) return `#${hex.slice(2)}`.toUpperCase(); // drop alpha
    return s.toUpperCase();
  }

  return s;
};

const buildLayer1FromColors = (primary, secondary) => {
  const p = normalizeHex(primary);
  const s = normalizeHex(secondary);

  if (!p && !s) {
    return "linear-gradient(#233f73, #1c335f) 50% 50%/calc(100% - 15px) calc(100% - 15px) no-repeat";
  }
  if (p && !s) {
    return `linear-gradient(${p}, ${p}) 50% 50%/calc(100% - 15px) calc(100% - 15px) no-repeat`;
  }
  if (!p && s) {
    return `linear-gradient(${s}, ${s}) 50% 50%/calc(100% - 15px) calc(100% - 15px) no-repeat`;
  }
  return `linear-gradient(${p}, ${s}) 50% 50%/calc(100% - 15px) calc(100% - 15px) no-repeat`;
};

/* =========================
   ✅ CROSS-BORDER FILTERS (from API items)
   ========================= */
const CROSS_FILTER_CODE_ORDER = ["kh-la", "la-kh", "th-la", "la-th", "vn-la", "cn-la"];

const normKey = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[_-]/g, "");

const CROSS_FILTER_ALIASES = {
  "kh-la": ["kh-la", "kh_la", "khla", "cambodialaos", "cambodia-laos", "ກຳປູເຈຍ ສະແກນ ລາວ"],
  "la-kh": ["la-kh", "la_kh", "lakh", "laoscambodia", "laos-cambodia", "ລາວ ສະແກນ ກຳປູເຈຍ"],
  "th-la": ["th-la", "th_la", "thla", "thailaos", "thai-laos", "ໄທ ສະແກນ ລາວ"],
  "la-th": ["la-th", "la_th", "lath", "laosthai", "laos-thai", "ລາວ ສະແກນ ໄທ"],
  "vn-la": ["vn-la", "vn_la", "vnla", "vietnamlaos", "vietnam-laos", "ຫວຽດນາມ ສະແກນ ລາວ"],
  "cn-la": ["cn-la", "cn_la", "cnla", "chinalaos", "china-laos", "ຈີນ ສະແກນ ລາວ"]
};

const isItemEnabled = (obj) => {
  if (!obj || typeof obj !== "object") return true;

  const candidates = [
    obj.enabled,
    obj.enable,
    obj.active,
    obj.isActive,
    obj.status,
    obj.available,
    obj.allow,
    obj.value,
    obj.flag
  ];

  const hasAnyFlag = candidates.some((v) => v !== undefined);
  if (!hasAnyFlag) return true;

  return candidates.some((v) => v === true || v === 1 || v === "1" || v === "true" || v === "Y" || v === "y");
};

const detectCrossFilterCode = (raw) => {
  const nk = normKey(raw);
  if (!nk) return "";

  for (const code of CROSS_FILTER_CODE_ORDER) {
    const aliases = CROSS_FILTER_ALIASES[code] || [];
    const hit = aliases.some((a) => normKey(a) === nk);
    if (hit) return code;
  }
  return "";
};

const readItemsLike = (v) => {
  // supports: array | {items:[]} | JSON string of array | JSON string of {items:[]}
  if (!v) return [];
  if (Array.isArray(v)) return v;

  if (typeof v === "object") {
    if (Array.isArray(v.items)) return v.items;
    return [];
  }

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return [];
    try {
      const j = JSON.parse(s);
      if (Array.isArray(j)) return j;
      if (j && Array.isArray(j.items)) return j.items;
    } catch {
      // ignore
    }
  }

  return [];
};

const buildCrossBorderFiltersFromApi = (item) => {
  // Use only CrossBorder.items (supports common field variants)
  const raw =
    item?.CrossBorder ??
    item?.crossBorder ??
    item?.crossborder ??
    item?.Crossborder ??
    item?.CrossBorderQR ??
    item?.crossBorderQR ??
    item?.crossBorderQr ??
    item?.CrossborderQR ??
    item?.crossborderQR ??
    item?.QRCrossBorder ??
    item?.qrCrossBorder ??
    null;

  const rawItems = readItemsLike(raw);
  const arr = Array.isArray(rawItems) ? rawItems : [];
  const set = new Set();

  for (const it of arr) {
    if (typeof it === "string") {
      const code = detectCrossFilterCode(it);
      if (code) set.add(code);
      continue;
    }

    if (it && typeof it === "object") {
      if (!isItemEnabled(it)) continue;

      const candidate =
        it.code ?? it.key ?? it.serviceCode ?? it.service ?? it.type ?? it.name ?? it.label ?? it.value ?? "";
      const code = detectCrossFilterCode(candidate);
      if (code) set.add(code);
    }
  }

  return CROSS_FILTER_CODE_ORDER.filter((c) => set.has(c));
};

/* =========================
   FETCH
   ========================= */
async function fetchJson(url) {
  if (!API_BASE) {
    throw new Error("Missing VITE_API_BASE_URL in .env");
  }

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" }
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

const mapApiMemberToCard = (item) => {
  const memberId = pickMemberId(item);

  const bankCode = String(
    item?.Bankcode ?? item?.BankCode ?? item?.bankcode ?? item?.bankCode ?? item?.bank_code ?? ""
  ).trim();

  const title = String(
    item?.BanknameLA ?? item?.bankNameLA ?? item?.banknameLA ?? item?.bank_name_la ?? item?.title ?? ""
  ).trim();

  const subtitle = String(
    item?.BanknameEN ??
      item?.bankNameEN ??
      item?.banknameEng ??
      item?.BanknameEng ??
      item?.bank_name_en ??
      item?.subtitle ??
      ""
  ).trim();

  const link1 = normalizeUrl(pickFirstString(item, ["LinkFB", "linkFB", "linkFb", "facebook", "fb", "LinkFacebook"]));
  const link2 = normalizeUrl(
    pickFirstString(item, [
      "LinkWeb",
      "LinkWEB",
      "linkWeb",
      "linkweb",
      "website",
      "Website",
      "web",
      "LinkWebsite",
      "linkWebsite",
      "urlWeb",
      "UrlWeb"
    ])
  );

  const img =
    item?.image_url ??
    item?.Image_url ??
    item?.imageUrl ??
    item?.image ??
    item?.logo ??
    item?.logo_img ??
    item?.member_logo ??
    "";
  const image = resolveImage(img) || "";

  const primary =
    item?.Color?.primary ??
    item?.color?.primary ??
    item?.colors?.primary ??
    item?.Colors?.primary ??
    item?.primary ??
    "";
  const secondary =
    item?.Color?.secondary ??
    item?.color?.secondary ??
    item?.colors?.secondary ??
    item?.Colors?.secondary ??
    item?.secondary ??
    "";

  const layer1 = buildLayer1FromColors(primary, secondary);
  const layer2 = "linear-gradient(321deg, transparent 0%, #b88a44 100%)";
  const layer3 = "linear-gradient(26deg, transparent 0%, #faf398 100%)";
  const layer4 = "linear-gradient(172deg, transparent 0%, #e0aa4e 100%)";
  const layer5 = "linear-gradient(270deg, transparent 0%, #f9f295 100%)";

  // Filters from CrossBorder.items only
  const filters = buildCrossBorderFiltersFromApi(item);

  return {
    memberId,
    bankCode,
    image,
    title,
    subtitle,
    link1,
    link2,
    layer1,
    layer2,
    layer3,
    layer4,
    layer5,
    filters
  };
};

async function loadMembersFromApi() {
  const json = await fetchJson(MEMBERS_API_URL);

  const list = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.members)
    ? json.members
    : Array.isArray(json?.result)
    ? json.result
    : [];

  // Only membercrossborder = 1
  const onlyCrossBorder = list.filter((it) => {
    const v =
      it?.membercrossborder ??
      it?.Membercrossborder ??
      it?.memberCrossborder ??
      it?.MemberCrossborder ??
      it?.memberCrossBorder ??
      it?.MemberCrossBorder ??
      it?.member_crossborder ??
      it?.member_cross_border ??
      it?.crossborderMember ??
      it?.CrossborderMember ??
      it?.crossBorderMember ??
      it?.CrossBorderMember ??
      0;

    return v === 1 || v === "1" || v === true;
  });

  const mapped = onlyCrossBorder.map(mapApiMemberToCard);

  // Sort by memberId so id=1 first
  mapped.sort((a, b) => {
    const A = a.memberId ?? 999999;
    const B = b.memberId ?? 999999;
    if (A !== B) return A - B;
    return String(a.bankCode).localeCompare(String(b.bankCode));
  });

  members.value = mapped;

  memberLogos.value = mapped
    .filter((m) => !!m.image)
    .map((m) => ({
      src: m.image,
      alt: m.title || m.bankCode || "Member"
    }));
}

/* =========================
   Pagination / Filters UI
   ========================= */
const itemsPerPage = 5;
const currentPage = ref(1);

const searchQuery = ref("");
const selectedFilters = ref([]);

// filter options with flags (UI stays the same)
const filterOptions = [
  { label: "ເລືອກທັງໝົດ", value: "all", flags: [] },
  {
    label: "ກຳປູເຈຍ ສະແກນ ລາວ ",
    value: "kh-la",
    flags: [
      { code: "kh", alt: "Cambodia flag" },
      { code: "la", alt: "Laos flag" }
    ]
  },
  {
    label: "ລາວ ສະແກນ ກຳປູເຈຍ ",
    value: "la-kh",
    flags: [
      { code: "la", alt: "Laos flag" },
      { code: "kh", alt: "Cambodia flag" }
    ]
  },
  {
    label: "ໄທ ສະແກນ ລາວ ",
    value: "th-la",
    flags: [
      { code: "th", alt: "Thailand flag" },
      { code: "la", alt: "Laos flag" }
    ]
  },
  {
    label: "ລາວ ສະແກນ ໄທ ",
    value: "la-th",
    flags: [
      { code: "la", alt: "Laos flag" },
      { code: "th", alt: "Thailand flag" }
    ]
  },
  {
    label: "ຫວຽດນາມ ສະແກນ ລາວ ",
    value: "vn-la",
    flags: [
      { code: "vn", alt: "Vietnam flag" },
      { code: "la", alt: "Laos flag" }
    ]
  },
  {
    label: "ຈີນ ສະແກນ ລາວ ",
    value: "cn-la",
    flags: [
      { code: "cn", alt: "China flag" },
      { code: "la", alt: "Laos flag" }
    ]
  }
];

// select-all helpers (unchanged behavior)
const realFilterValues = computed(() => filterOptions.filter((o) => o.value !== "all").map((o) => o.value));

const isAllChecked = computed({
  get() {
    return realFilterValues.value.length > 0 && realFilterValues.value.every((v) => selectedFilters.value.includes(v));
  },
  set(checked) {
    selectedFilters.value = checked ? [...realFilterValues.value] : [];
  }
});

// Filtered list (search + filters -> pagination)
const filteredMembers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const activeFilters = selectedFilters.value;

  return members.value.filter((m) => {
    const title = (m.title || "").toLowerCase();
    const subtitle = (m.subtitle || "").toLowerCase();

    const matchesSearch = !q || title.includes(q) || subtitle.includes(q);
    if (!matchesSearch) return false;

    if (!activeFilters.length) return true;

    const memberFilters = m.filters || [];
    return activeFilters.every((f) => memberFilters.includes(f)); // AND
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredMembers.value.length / itemsPerPage)));

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMembers.value.slice(start, start + itemsPerPage);
});

/* =========================
   GSAP animation
   ========================= */
const cardsGridEl = ref(null);

const animateCards = () => {
  const grid = cardsGridEl.value;
  if (!grid) return;

  const cards = grid.children;
  if (!cards || !cards.length) return;

  gsap.killTweensOf(cards);

  gsap.fromTo(
    cards,
    { autoAlpha: 0, y: 24, scale: 0.96 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out", stagger: 0.06 }
  );
};

function goToPage(p) {
  const next = Math.min(Math.max(1, p), totalPages.value);
  if (next === currentPage.value) return;
  currentPage.value = next;
}
function prevPage() {
  goToPage(currentPage.value - 1);
}
function nextPage() {
  goToPage(currentPage.value + 1);
}

// keep currentPage valid
watch(totalPages, (tp) => {
  if (currentPage.value > tp) currentPage.value = tp;
});
watch(searchQuery, () => {
  currentPage.value = 1;
});
watch(selectedFilters, () => {
  currentPage.value = 1;
});
watch(currentPage, async () => {
  await nextTick();
  animateCards();
});
watch(filteredMembers, async () => {
  await nextTick();
  animateCards();
});

/** ✅ onMounted */
onMounted(async () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  try {
    await loadMembersFromApi();
    currentPage.value = 1;
  } catch (e) {
    console.error("โหลด /api/members ไม่สำเร็จ:", e);
    members.value = [];
    memberLogos.value = [];
    currentPage.value = 1;
  }

  await nextTick();
  animateCards();
});
</script>

<template>
  <main_navbar
    title="ສະມາຊິກລະບົບຊຳລະຂ້າມແດນໃນຮູບແບບ QR Code ລະຫວ່າງປະເທດ"
    :breadcrumb="[
      'ໜ້າຫຼັກ',
      'ສະມາຊິກ',
      'ສະມາຊິກລະບົບຊຳລະຂ້າມແດນໃນຮູບແບບ QR Code ລະຫວ່າງປະເທດ'
    ]"
    background-image="/member/membercard/membercrd-2.png"
  />

  <div class="boxmargin" style="width: 100%; height: 20vh"></div>

  <div class="membercardcontainer">
    <div class="leftsection">
      <div class="cardsgrid" ref="cardsGridEl">
        <membercard
          v-for="(m, idx) in paginatedMembers"
          :key="m.memberId ?? `${m.bankCode}-${idx}`"
          :image="m.image"
          :title="m.title"
          :subtitle="m.subtitle"
          :link1="m.link1"
          :link2="m.link2"
          :layer1="m.layer1"
          :layer2="m.layer2"
          :layer3="m.layer3"
          :layer4="m.layer4"
          :layer5="m.layer5"
        />
      </div>
    </div>

    <aside class="rightcontainer">
      <div class="filterPanel">
        <div class="filterHeader">
          <div>
            <h2 class="filterTitle">ຄົ້ນຫາທະນາຄານສະມາຊິກ</h2>
            <p class="filterSubtitle">
              ສະມາຊິກລະບົບຊຳລະຂ້າມແດນໃນຮູບແບບ QR Code ລະຫວ່າງປະເທດ
            </p>
          </div>
          <span class="filterBadge">LAPNet</span>
        </div>

        <!-- Search box -->
        <div class="searchBox">
          <span class="searchIcon">
            <img src="/icon/search2.png" alt="" style="width: 30px; height: 30px" />
          </span>
          <input v-model="searchQuery" type="text" class="searchInput" placeholder="ຄົ້ນຫາທະນາຄານສະມາຊິກ..." />
        </div>

        <div class="filterDivider"></div>

        <!-- Checkbox filters -->
        <div class="filterGroup">
          <div class="filterGroupHeader">
            <span class="filterGroupTitle">ຄົ້ນໝວດໝູ່ທະນາຄານສະມາຊິກ</span>
            <span class="filterGroupHint">7 ຕົວເລືອກ</span>
          </div>

          <div class="filterChecks">
            <label v-for="opt in filterOptions" :key="opt.value" class="filterCheck">
              <!-- select all -->
              <input
                v-if="opt.value === 'all'"
                type="checkbox"
                :checked="isAllChecked"
                @change="isAllChecked = $event.target.checked"
              />
              <!-- normal filters -->
              <input v-else type="checkbox" :value="opt.value" v-model="selectedFilters" />

              <span class="checkFake">
                <span class="checkTick">✓</span>
              </span>

              <span class="checkLabel">
                <!-- flags + arrow -->
                <span v-if="opt.flags && opt.flags.length === 2" class="flagWrap">
                  <img
                    class="flagIcon"
                    :src="`https://flagcdn.com/w20/${opt.flags[0].code}.png`"
                    :srcset="`https://flagcdn.com/w40/${opt.flags[0].code}.png 2x`"
                    :alt="opt.flags[0].alt"
                    loading="lazy"
                  />
                  <i class="fa-solid fa-arrow-right flagArrow"></i>
                  <img
                    class="flagIcon"
                    :src="`https://flagcdn.com/w20/${opt.flags[1].code}.png`"
                    :srcset="`https://flagcdn.com/w40/${opt.flags[1].code}.png 2x`"
                    :alt="opt.flags[1].alt"
                    loading="lazy"
                  />
                </span>

                <span v-else class="flagWrap"></span>
                {{ opt.label }}
              </span>
            </label>
          </div>
        </div>

        <div class="filterFooter">
          <p class="filterFooterText">
            ຄົ້ນຫາພົບ :
            <span class="filterFooterHighlight">{{ filteredMembers.length }}</span>
            ສະມາຊິກລະບົບຊຳລະຂ້າມແດນໃນຮູບແບບ QR Code ລະຫວ່າງປະເທດ
          </p>
        </div>
      </div>
    </aside>
  </div>

  <div class="paginationcontainer">
    <div class="pagerWrap" aria-label="Pagination">
      <button class="pagerBtn" :disabled="currentPage === 1" @click="prevPage" aria-label="Previous page">
        <span class="chev">‹</span>
        <span class="txt">Prev</span>
      </button>

      <div class="pagerPills" role="navigation" aria-label="Page numbers">
        <button
          v-for="p in totalPages"
          :key="p"
          class="pagePill"
          :class="{ active: p === currentPage }"
          @click="goToPage(p)"
          :aria-current="p === currentPage ? 'page' : undefined"
          :aria-label="`Go to page ${p}`"
        >
          {{ p }}
        </button>
      </div>

      <button class="pagerBtn" :disabled="currentPage === totalPages" @click="nextPage" aria-label="Next page">
        <span class="txt">Next</span>
        <span class="chev">›</span>
      </button>
    </div>
  </div>

  <div class="boxmargin" style="width: 100%; height: 15vh"></div>
  <footermembercrossborder :logos="memberLogos" />
  <secondfooter />
</template>

<style scoped>
/* (styles unchanged) */
.flagArrow {
  font-size: 12px;
  margin: 0 4px;
  opacity: 0.85;
}
.flagWrap {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
}
.flagIcon {
  width: 25px;
  height: 20px;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  object-fit: cover;
}
.membercardcontainer {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  height: auto;
}
.leftsection {
  width: 55%;
  height: auto;
}
.rightcontainer {
  width: 42%;
  height: 750px;
  display: flex;
  align-items: stretch;
}
.filterPanel {
  width: 100%;
  height: 100%;
  padding: 18px 20px;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #e7f0ff 35%, #f6fbff 100%);
  border: 1px solid rgba(58, 123, 255, 0.5);
  box-shadow: 0 14px 40px rgba(10, 32, 94, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.filterHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.filterTitle {
  font-size: var(--fs-lg);
  font-weight: 700;
  color: #0a1f55;
  margin: 0;
}
.filterSubtitle {
  margin: 3px 0 0;
  font-size: var(--fs-sm);
  color: #5a6f9f;
}
.filterBadge img {
  width: 30px;
  height: auto;
}
.filterBadge {
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 999px;
  background: linear-gradient(120deg, #1b5cff, #46a9ff);
  color: #ffffff;
  display: flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.3px;
  box-shadow: 0 0 12px rgba(58, 123, 255, 0.75);
  align-self: center;
}
.searchBox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 32px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 153, 255, 0.7);
  box-shadow: 0 6px 16px rgba(9, 30, 66, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}
.searchIcon {
  font-size: var(--fs-md);
}
.searchInput {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-xs);
  color: #10275b;
}
.searchInput::placeholder {
  color: #9aaad9;
}
.filterDivider {
  height: 1px;
  width: 100%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(46, 94, 255, 0) 0%,
    rgba(46, 94, 255, 0.7) 35%,
    rgba(46, 94, 255, 0.7) 65%,
    rgba(46, 94, 255, 0) 100%
  );
}
.filterGroup {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.filterGroupHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filterGroupTitle {
  font-size: var(--fs-md);
  font-weight: 600;
  color: #12306a;
}
.filterGroupHint {
  font-size: 11px;
  color: #7d90c7;
}
.filterChecks {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 30px;
}
.filterCheck {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #21345f;
  user-select: none;
}
.filterCheck input {
  display: none;
}
.checkFake {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(102, 155, 255, 0.9);
  background: radial-gradient(circle at 30% 0%, #ffffff, #dfe9ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9), 0 4px 10px rgba(44, 93, 255, 0.35);
  transition: background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, transform 0.12s ease;
}
.checkTick {
  font-size: 12px;
  opacity: 0;
  transform: scale(0.3);
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.filterCheck input:checked + .checkFake {
  background: linear-gradient(135deg, #1a57ff, #47b3ff);
  border-color: #ffffff;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.7), 0 6px 14px rgba(43, 100, 255, 0.5);
  transform: translateY(-1px);
}
.filterCheck input:checked + .checkFake .checkTick {
  opacity: 1;
  transform: scale(1);
  color: #ffffff;
}
.checkLabel {
  font-size: var(--fs-base);
  display: inline-flex;
  align-items: center;
}
.filterFooter {
  margin-top: auto;
  padding-top: 4px;
  border-top: 1px dashed rgba(148, 179, 255, 0.7);
}
.filterFooterText {
  font-size: var(--fs-sm);
  color: #1e3567;
  margin: 6px 0 0;
}
.filterFooterHighlight {
  font-weight: 700;
  color: #275eff;
}
.cardsgrid {
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;
  align-items: stretch;
  overflow: hidden;
}
.paginationcontainer {
  width: 40%;
  margin: 0 auto;
  height: auto;
  border: none;
}
.pagerWrap {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 999px;
  background: linear-gradient(95deg, rgba(0, 18, 61, 1) 0%, rgba(0, 51, 171, 1) 35%, rgba(6, 0, 120, 1) 100%);
  border: 1px solid rgba(152, 189, 255, 0.8);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06);
}
.pagerBtn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  letter-spacing: 0.2px;
  color: #e9f3ff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(184, 210, 255, 0.7);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, opacity 0.16s ease;
}
.pagerBtn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.16);
  box-shadow: 0 7px 16px rgba(0, 0, 0, 0.35);
}
.pagerBtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.chev {
  font-size: 16px;
  line-height: 1;
}
.pagerPills {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 999px;
  background: rgba(1, 8, 30, 0.55);
  border: 1px solid rgba(167, 199, 255, 0.6);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
}
.pagePill {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #dbe8ff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(179, 204, 255, 0.7);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
}
.pagePill:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.18);
  border-color: #c4d6ff;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.45);
}
.pagePill.active {
  background: #ffffff;
  color: #0b2e7e;
  border-color: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(116, 170, 255, 0.6);
}
@media (max-width: 900px) {
  .membercardcontainer {
    flex-direction: column;
    width: 95%;
  }
  .rightcontainer {
    width: 100%;
    height: auto;
    order: 1;
  }
  .leftsection {
    width: 100%;
    order: 2;
  }
  .paginationcontainer {
    width: 100%;
  }
  .pagerWrap {
    flex-wrap: wrap;
    padding: 10px 10px;
    gap: 8px;
  }
}
</style>