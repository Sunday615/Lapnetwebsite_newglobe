<script setup lang="ts">
import navbar from "../../components/miannavbar/main_navbar.vue";
import product6benetfit from "../techbenetfit/product6benetfit.vue";
import crossborderbtn from "../../components/button/crossborderbtn.vue";
import product6tech from "../techbenetfit/product6tech.vue";
import secondfooter from "../../components/footer/mainfooter/secondfooter.vue";
import vdoproductcrossborderKH_LA from "../../components/videoproductcrossborder/vdoproductcrossborderKH_LA.vue";
import vdoproductcrossborderLA_KH from "../../components/videoproductcrossborder/vdoproductcrossborderLA_KH.vue";
import vdoproductcrossborderTH_LA from "../../components/videoproductcrossborder/vdoproductcrossborderTH_LA.vue";
import vdoproductcrossborderLA_TH from "../../components/videoproductcrossborder/vdoproductcrossborderLA_TH.vue";
import vdoproductcrossborderVN_LA from "../../components/videoproductcrossborder/vdoproductcrossborderVN_LA.vue";
import vdoproductcrossborderCN_LA from "../../components/videoproductcrossborder/vdoproductcrossborderCN_LA.vue";
import hero_sectionproduct6 from "../../Views/products/product_herosection/hero_sectionproduct6.vue";
import product6_footerlogomember from "../../components/footer/logomemberfooter/product6_footerlogomember.vue";

import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** =========================
 * ✅ Load member logos from API (env only)
 * API: {VITE_API_BASE_URL}/api/members
 * Condition: crossborderproduct = 1
 * ========================= */
type MemberLogo = {
  src: string;
  alt: string;
  memberId?: number;
};

type TimelineStep = {
  id: string;
  tag: string;
  title: string;
  text: string;
  side: "left" | "right";
};

// Required in .env:
//   VITE_API_BASE_URL=http://localhost:3000
function resolveEnvBaseUrl(): string {
  // IMPORTANT: Use direct access so Vite injects import.meta.env correctly.
  const raw = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  return raw.replace(/\/+$/, "");
}

function normalizeBaseUrl(u: string): string {
  return String(u || "").trim().replace(/\/+$/, "");
}

function joinBaseAndPath(baseUrl: string, path: string): string {
  const b = normalizeBaseUrl(baseUrl);
  const p = String(path || "");

  if (!b) return p;

  // Prevent double "/api"
  if (b.endsWith("/api") && /^\/api(\/|$)/i.test(p)) {
    return b + p.replace(/^\/api/i, "");
  }

  if (!p) return b;
  if (p.startsWith("/")) return b + p;
  return b + "/" + p;
}

function isLoopbackHost(hostname: string) {
  const h = String(hostname || "").toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
}

function isLikelyAssetPath(pathname: string) {
  const p = String(pathname || "");
  return /^\/(uploads|upload|images|files|static)\b/i.test(p) || p.includes("/uploads/") || p.includes("/images/");
}

const API_BASE = normalizeBaseUrl(resolveEnvBaseUrl());
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;
const MEMBERS_API_URL = joinBaseAndPath(API_BASE, "/api/members");

const memberLogos = ref<MemberLogo[]>([]);
const timelineSection = ref<HTMLElement | null>(null);
let timelineContext: gsap.Context | null = null;

const crossBorderTimeline: TimelineStep[] = [
  {
    id: "01",
    tag: "ເລີ່ມຕົ້ນ",
    title: "ເປີດໃຊ້ Mobile Banking ກັບທະນາຄານສະມາຊິກ",
    text: "ລູກຄ້າເລີ່ມຕົ້ນຈາກການເປີດໃຊ້ Mobile Banking ແລະ ກວດສອບໃຫ້ບັນຊີພ້ອມສຳລັບການຊຳລະຂ້າມແດນ.",
    side: "left",
  },
  {
    id: "02",
    tag: "ເລືອກການຊຳລະ",
    title: "ເລືອກປະເທດ ແລະ ຮູບແບບ QR ທີ່ຕ້ອງການ",
    text: "ລະບົບຮອງຮັບການຊຳລະກັບປະເທດທີ່ເຊື່ອມໂຍງ ເພື່ອໃຫ້ຜູ້ໃຊ້ເລືອກ flow ທີ່ກົງກັບປາຍທາງໄດ້ທັນທີ.",
    side: "right",
  },
  {
    id: "03",
    tag: "Scan",
    title: "ສະແກນ QR ຂອງຮ້ານຄ້າ ຫຼື ຈຸດຮັບຊຳລະ",
    text: "ນັກທ່ອງທ່ຽວ ຫຼື ຜູ້ໃຊ້ງານສາມາດສະແກນ QR ໄດ້ໂດຍກົງຜ່ານແອັບຂອງທະນາຄານທີ່ເຂົ້າຮ່ວມ.",
    side: "left",
  },
  {
    id: "04",
    tag: "Review",
    title: "ກວດສອບລາຍການ ແລະ ຢືນຢັນຈຳນວນເງິນ",
    text: "ແອັບຈະສະແດງຈຳນວນເງິນ, ສະກຸນເງິນ ແລະ ລາຍລະອຽດທີ່ຈຳເປັນ ກ່ອນໃຫ້ລູກຄ້າກົດຢືນຢັນ.",
    side: "right",
  },
  {
    id: "05",
    tag: "Real-time",
    title: "ຕັດບັນຊີ ແລະ ສົ່ງຜົນການຊຳລະແບບທັນທີ",
    text: "ເມື່ອຢືນຢັນການຊຳລະ ລະບົບຈະດຳເນີນທຸລະກຳແບບ real-time ເພື່ອໃຫ້ທັງຜູ້ຊື້ ແລະ ຮ້ານຄ້າຮູ້ສະຖານະທັນທີ.",
    side: "left",
  },
  {
    id: "06",
    tag: "Success",
    title: "ຮ້ານຄ້າຮັບເງິນສຳເລັດ ແລະ ປິດການຊຳລະ",
    text: "ຫຼັງຈາກການຊຳລະສຳເລັດ ຮ້ານຄ້າຈະໄດ້ຮັບການແຈ້ງຢືນຢັນ ແລະ ລູກຄ້າສາມາດດຳເນີນການຊື້ຂາຍຕໍ່ໄດ້ຢ່າງລື່ນໄຫຼ.",
    side: "right",
  },
];

const ASSET_BASE_URL = (() => {
  try {
    return ASSET_BASE ? new URL(ASSET_BASE) : null;
  } catch {
    return null;
  }
})();

function rewriteBadAbsoluteToEnvBase(absoluteUrl: string) {
  try {
    const u = new URL(absoluteUrl);
    const fullPath = `${u.pathname || ""}${u.search || ""}`;

    // Rewrite when backend returns localhost
    if (isLoopbackHost(u.hostname)) {
      return ASSET_BASE ? joinBaseAndPath(ASSET_BASE, fullPath) : absoluteUrl;
    }

    // Rewrite when it looks like an asset path but host mismatches env base
    if (ASSET_BASE_URL && isLikelyAssetPath(u.pathname) && u.hostname !== ASSET_BASE_URL.hostname) {
      return joinBaseAndPath(ASSET_BASE, fullPath);
    }

    return absoluteUrl;
  } catch {
    return absoluteUrl;
  }
}

const normalizeUrl = (p: unknown) => {
  const s = String(p ?? "").trim();
  if (!s) return "";

  if (/^data:/i.test(s) || /^blob:/i.test(s)) return s;

  // Absolute URL
  if (/^https?:\/\//i.test(s)) return rewriteBadAbsoluteToEnvBase(s);

  // Absolute path
  if (s.startsWith("/")) return joinBaseAndPath(ASSET_BASE, s);

  // Relative path
  return joinBaseAndPath(ASSET_BASE, "/" + s);
};

const getMemberId = (m: any) => Number(m?.idmember ?? m?.id ?? m?.member_id ?? 0);

const fetchMemberLogos = async () => {
  try {
    if (!API_BASE) {
      throw new Error("Missing VITE_API_BASE_URL in .env");
    }

    const res = await fetch(MEMBERS_API_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data || json?.members || [];
    const arr = Array.isArray(list) ? list : [];

    memberLogos.value = arr
      .filter((m: any) => String(m?.crossborderproduct) === "1" || m?.crossborderproduct === true)
      .sort((a: any, b: any) => getMemberId(a) - getMemberId(b))
      .map((m: any) => {
        const rawSrc = m?.image ?? m?.image_url ?? m?.logo ?? m?.img ?? m?.photo ?? m?.path ?? m?.src ?? "";
        const alt = m?.alt ?? m?.name ?? m?.bank_name ?? m?.title ?? "Member logo";

        return {
          src: normalizeUrl(rawSrc),
          alt,
          memberId: getMemberId(m),
        };
      })
      .filter((x: MemberLogo) => !!x.src);
  } catch (err) {
    console.error("Error loading member logos (crossborderproduct):", err);
    memberLogos.value = [];
  }
};

onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  fetchMemberLogos();

  timelineContext = gsap.context(() => {
    gsap.from(".process-kicker, .process-title, .process-copy", {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
    });

    gsap.from(".process-stat", {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.15,
    });

    gsap.to(".process-orb--one", {
      x: 24,
      y: -20,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".process-orb--two", {
      x: -22,
      y: 18,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const lineRail = timelineSection.value?.querySelector<HTMLElement>(".process-line");
    const lineFill = timelineSection.value?.querySelector<HTMLElement>(".process-line-fill");
    const lineGlow = timelineSection.value?.querySelector<HTMLElement>(".process-line-glow");

    if (lineRail && lineFill && lineGlow) {
      gsap.set(lineFill, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(lineGlow, { y: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: ".process-timeline",
          start: "top 72%",
          end: "bottom 20%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      })
        .to(
          lineFill,
          {
            scaleY: 1,
            ease: "none",
          },
          0
        )
        .to(
          lineGlow,
          {
            y: () => Math.max(lineRail.offsetHeight - lineGlow.offsetHeight, 0),
            ease: "none",
          },
          0
        );
    }

    gsap.to(".process-line-glow", {
      scale: 1.08,
      boxShadow: "0 0 0 10px rgba(49, 61, 255, 0.12), 0 0 28px rgba(49, 61, 255, 0.48)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".process-node-halo", {
      scale: 1.22,
      opacity: 0.26,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.15,
    });

    gsap.utils.toArray<HTMLElement>(".process-item").forEach((item) => {
      const isLeft = item.classList.contains("is-left");
      const card = item.querySelector(".process-card");
      const node = item.querySelector(".process-node-shell");

      if (card) {
        gsap.from(card, {
          opacity: 0,
          y: 54,
          x: isLeft ? 64 : -64,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (node) {
        gsap.from(node, {
          opacity: 0,
          scale: 0.4,
          duration: 0.55,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      }

      ScrollTrigger.create({
        trigger: item,
        start: "top 60%",
        end: "bottom 42%",
        toggleClass: {
          targets: item,
          className: "is-active",
        },
      });
    });
  }, timelineSection);

  ScrollTrigger.refresh();
});

onBeforeUnmount(() => {
  timelineContext?.revert();
  timelineContext = null;
});

/** =========================
 * ✅ Video switch by route param
 * ========================= */
const route = useRoute();
const videoBox = ref<HTMLElement | null>(null);

const pair = computed(() => {
  const currentPair = (route.params.pair as string) || "kh-la";

  if (currentPair === "cn-la") return "ch-la";
  if (currentPair === "la-cn") return "la-ch";

  return currentPair;
});

const currentVideoComponent = computed(() => {
  switch (pair.value) {
    case "kh-la":
      return vdoproductcrossborderKH_LA;
    case "la-kh":
      return vdoproductcrossborderLA_KH;
    case "th-la":
      return vdoproductcrossborderTH_LA;
    case "la-th":
      return vdoproductcrossborderLA_TH;
    case "vn-la":
    case "la-vn":
      return vdoproductcrossborderVN_LA;
    case "ch-la":
    case "la-ch":
      return vdoproductcrossborderCN_LA;
    default:
      return vdoproductcrossborderKH_LA;
  }
});

watch(
  pair,
  () => {
    if (!videoBox.value) return;

    gsap.fromTo(
      videoBox.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 2.0, ease: "power3.out" }
    );
  },
  { immediate: true }
);
</script>
<template>
  <navbar
    title="ຜະລິດຕະພັນ ແລະ ການບໍລິການ"
    :breadcrumb="[
      'ໜ້າຫຼັກ',
      'ຜະລິດຕະພັນ ແລະ ການບໍລິການ',
      'ຊຳລະຂ້າມແດນໃນຮູບແບບ QR CODE ລະຫວ່າງປະເທດ'
    ]"
    background-image="/overlaynav/product/navigatorcontent-bg.png"
  />

  <div class="productdiscription">
    <hero_sectionproduct6 />
  </div>

  <div class="benetfix">
    <product6benetfit />
  </div>

  <section ref="timelineSection" class="process-showcase">
    <div class="process-orb process-orb--one"></div>
    <div class="process-orb process-orb--two"></div>

    <div class="process-shell">
      <div class="process-header">
        <div class="process-copywrap">
          <span class="process-kicker">Cross-Border Journey</span>
          <h2 class="process-title">
            ຂັ້ນຕອນການຊຳລະຂ້າມແດນ
            <span>ຜ່ານ QR Code</span>
          </h2>
          <p class="process-copy">
            timeline ນີ້ສະແດງ flow ການໃຊ້ງານແບບເຂົ້າໃຈງ່າຍ ຕັ້ງແຕ່ເລີ່ມເປີດໃຊ້ບໍລິການ
            ຈົນໄປຮອດການຊຳລະສຳເລັດແບບ real-time.
          </p>
        </div>

        <div class="process-stats">
          <article class="process-stat">
            <strong>04</strong>
            <span>ປະເທດທີ່ເຊື່ອມໂຍງ</span>
          </article>
          <article class="process-stat">
            <strong>Scan</strong>
            <span>ຊຳລະດ້ວຍ QR ໄດ້ທັນທີ</span>
          </article>
          <article class="process-stat">
            <strong>Real-time</strong>
            <span>ຮູ້ຜົນການຊຳລະໄວ</span>
          </article>
        </div>
      </div>

      <div class="process-timeline">
        <div class="process-line">
          <div class="process-line-base"></div>
          <div class="process-line-fill"></div>
          <div class="process-line-glow"></div>
        </div>

        <div
          v-for="item in crossBorderTimeline"
          :key="item.id"
          class="process-item"
          :class="item.side === 'left' ? 'is-left' : 'is-right'"
        >
          <div class="process-card-shell">
            <article class="process-card">
              <div class="process-card-top">
                <span class="process-step">{{ item.id }}</span>
                <span class="process-tag">{{ item.tag }}</span>
              </div>

              <h3 class="process-card-title">{{ item.title }}</h3>
              <p class="process-card-text">{{ item.text }}</p>
            </article>
          </div>

          <div class="process-node-shell">
            <span class="process-node-halo"></span>
            <span class="process-node"></span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="crossborderinfo">
    <div class="boxmargin" style="width: 100%; height: 15vh"></div>

    <div class="titlecrossborder">
      <h1 id="memberjoin">ທະນາຄານສະມາຊິກທີ່ເຂົ້າຮ່ວມ</h1>
      <crossborderbtn />
    </div>

    <div class="videocontainer">
      <div class="videocorssbordershow" ref="videoBox">
        <component :is="currentVideoComponent" :key="pair" />
      </div>
    </div>
  </div>

  <div class="descriptionforcustomer">
    <product6tech />
  </div>

  <div class="footermember">
    <!-- ✅ ส่ง logos ที่ get จาก API (crossborderproduct=1) -->
    <product6_footerlogomember :subtitle="`  ຊຳລະຂ້າມແດນຜ່ານ QR CODE ບໍລິສັດ LAPNet ໄດ້ຕໍ່ຍອດການພັດທະນາລະບົບຊຳລະຂ້າມທະນາຄານເທິງມືຖື (LMPS) ເພື່ອຂະຫຍາຍຜະລິດຕະພັນ ຊຳລະຂ້າມທະນາຄານ ໃຫ້ສາມາດຮອງຮັບການ ຊຳລະ ຄ່າສິນຄ້າ - ບໍລິການ ລະຫວ່າງປະເທດ`"
      :features="[
        'ປັດຈຸບັນ LAPNet ໄດ້ຮ່ວມໂຄງການກັບ 4 ປະເທດຄື: ປະເທດກຳປູເຈຍ, ປະເທດໄທ, ປະເທດຈີນ ແລະ ປະເທດຫວຽດນາມ. ',
      ]"
      :logos="memberLogos" />
  </div>

  <secondfooter />
</template>

<style scoped>
.process-showcase {
  position: relative;
  overflow: hidden;
  padding: clamp(5rem, 8vw, 7.5rem) 0;
  background:
    radial-gradient(circle at 15% 20%, rgba(49, 61, 255, 0.12), transparent 32%),
    radial-gradient(circle at 88% 82%, rgba(0, 166, 255, 0.12), transparent 30%),
    linear-gradient(180deg, #f7f9ff 0%, #eef3ff 45%, #ffffff 100%);
}

.process-orb {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(18px);
  opacity: 0.75;
}

.process-orb--one {
  width: 260px;
  height: 260px;
  top: 6%;
  right: -4%;
  background: radial-gradient(circle, rgba(49, 61, 255, 0.18), rgba(49, 61, 255, 0));
}

.process-orb--two {
  width: 220px;
  height: 220px;
  bottom: 10%;
  left: -3%;
  background: radial-gradient(circle, rgba(0, 166, 255, 0.18), rgba(0, 166, 255, 0));
}

.process-shell {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 32px;
}

.process-header {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: 32px;
  align-items: end;
  margin-bottom: clamp(3rem, 5vw, 5rem);
}

.process-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #2447d6;
}

.process-kicker::before {
  content: "";
  width: 42px;
  height: 1px;
  background: linear-gradient(90deg, rgba(36, 71, 214, 0.25), rgba(36, 71, 214, 1));
}

.process-title {
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.process-title span {
  display: block;
  background: linear-gradient(135deg, #000ba6 0%, #001cff 45%, #00a6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.process-copy {
  max-width: 720px;
  margin: 18px 0 0;
  font-size: 1.04rem;
  line-height: 1.9;
  color: #475569;
}

.process-stats {
  display: grid;
  gap: 14px;
}

.process-stat {
  padding: 20px 22px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(197, 196, 219, 0.28);
  box-shadow: 0 22px 48px rgba(19, 27, 46, 0.08);
  backdrop-filter: blur(14px);
}

.process-stat strong {
  display: block;
  margin-bottom: 6px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #091b8d;
}

.process-stat span {
  display: block;
  font-size: 0.96rem;
  line-height: 1.6;
  color: #516176;
}

.process-timeline {
  position: relative;
  padding: 10px 0;
}

.process-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 6px;
  transform: translateX(-50%);
}

.process-line-base,
.process-line-fill {
  position: absolute;
  inset: 0;
  border-radius: 999px;
}

.process-line-base {
  background: linear-gradient(180deg, rgba(196, 205, 225, 0.26), rgba(196, 205, 225, 0.65), rgba(196, 205, 225, 0.18));
}

.process-line-fill {
  background: linear-gradient(180deg, #0f33ff 0%, #3b5dff 45%, #2fd0ff 100%);
  box-shadow: 0 0 28px rgba(49, 61, 255, 0.28);
}

.process-line-glow {
  position: absolute;
  left: 50%;
  top: 0;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  transform: translateX(-50%);
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.4) 36%, rgba(49, 61, 255, 0.9) 60%, rgba(49, 61, 255, 0.12) 100%);
  box-shadow: 0 0 0 8px rgba(49, 61, 255, 0.08), 0 0 22px rgba(49, 61, 255, 0.34);
}

.process-item {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1fr);
  align-items: center;
  min-height: 178px;
  margin: 26px 0;
}

.process-item.is-left .process-card-shell {
  grid-column: 1;
  justify-self: end;
  padding-right: 30px;
}

.process-item.is-right .process-card-shell {
  grid-column: 3;
  justify-self: start;
  padding-left: 30px;
}

.process-node-shell {
  position: relative;
  grid-column: 2;
  justify-self: center;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
}

.process-node-halo,
.process-node {
  position: absolute;
  border-radius: 999px;
}

.process-node-halo {
  inset: -4px;
  border: 1px solid rgba(49, 61, 255, 0.24);
  background: rgba(49, 61, 255, 0.08);
}

.process-node {
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 30% 30%, #ffffff, #3b5dff 58%, #001cff 100%);
  box-shadow: 0 0 0 6px rgba(49, 61, 255, 0.12), 0 0 22px rgba(49, 61, 255, 0.3);
}

.process-card {
  width: min(100%, 420px);
  padding: 28px;
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 255, 0.9) 100%);
  border: 1px solid rgba(197, 196, 219, 0.25);
  box-shadow: 0 28px 60px rgba(19, 27, 46, 0.1);
  backdrop-filter: blur(16px);
  transition: transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease;
}

.process-item.is-active .process-card {
  transform: translateY(-8px);
  box-shadow: 0 34px 70px rgba(19, 27, 46, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(242, 246, 255, 0.94) 100%);
}

.process-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.process-step {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: rgba(59, 93, 255, 0.34);
}

.process-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1736be;
  background: rgba(49, 61, 255, 0.08);
}

.process-card-title {
  margin: 0;
  font-size: 1.28rem;
  line-height: 1.45;
  color: #121a2d;
}

.process-card-text {
  margin: 12px 0 0;
  font-size: 0.98rem;
  line-height: 1.82;
  color: #526277;
}

.footermember {
  width: 100%;
  height: auto;
}

.descriptionforcustomer {
  width: 100%;
  height: auto;
}

.videocontainer {
  width: 100%;
  height: auto;
}

@media (max-width: 518px) {
  #memberjoin {
    font-size: 2.3rem;
  }
}

.titlecrossborder h1 {
  font-size: var(--fs-hero);
  font-weight: bold;
  color: #0025b8;
  background-image: linear-gradient(45deg, #312ba4, #0d1c9c 8%, #00a6ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.titlecrossborder {
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.crossborderinfo {
  width: 100%;
  height: auto;
}

.footermemberproduct1 {
  width: 100%;
  height: 100vh;
}

.benetfitcontent p {
  width: 100%;
  padding-top: 40px;
  width: 80%;
  font-size: var(--fs-base);
  text-align: center;
}

.benetfitcontent h1 {
  text-align: center;
  width: 100%;
  font-size: var(--fs-xxl);
  font-weight: bold;
}

.benetfitcontent {
  width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40%;
}

.benetfitcontainer {
  width: 80%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
}

.benetfix {
  width: 100%;
  height: auto;
}

.productdiscription {
  width: 100%;
  height: auto;
}

@media (max-width: 980px) {
  .process-header {
    grid-template-columns: 1fr;
  }

  .process-shell {
    padding: 0 22px;
  }

  .process-line {
    left: 18px;
    transform: none;
  }

  .process-item {
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 18px;
    min-height: 0;
    margin: 22px 0;
  }

  .process-item.is-left .process-card-shell,
  .process-item.is-right .process-card-shell {
    grid-column: 2;
    justify-self: stretch;
    padding: 0;
  }

  .process-node-shell {
    grid-column: 1;
  }

  .process-card {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .process-showcase {
    padding: 4.5rem 0;
  }

  .process-title {
    font-size: 2rem;
  }

  .process-copy {
    font-size: 0.96rem;
    line-height: 1.75;
  }

  .process-card {
    padding: 22px 20px;
    border-radius: 24px;
  }

  .process-card-title {
    font-size: 1.12rem;
  }

  .process-card-text {
    font-size: 0.94rem;
    line-height: 1.7;
  }

  .process-step {
    font-size: 2rem;
  }
}
</style>
