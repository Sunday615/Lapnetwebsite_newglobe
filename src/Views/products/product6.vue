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
  title: string;
  text: string;
  icon: string;
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
    title: "ຈຸດປະສົງຫຼັກຂອງໂຄງການຈຸດປະສົງຫຼັກຂອງໂຄງການ",
    text: "ໂຄງການດັ່ງກ່າວມີຈຸດປະສົງຫຼັກເພື່ອ ສົ່ງເສີມ ແລະ ອຳນວຍຄວາມສະດວກໃຫ້ແກ່ການບໍລິການຮ່ວມກັນພາຍໃນ ແລະ ຕ່າງປະເທດ ໃຫ້ສາມາດດຳເນີນລື່ນໄຫຼ ແລະ ບໍລິການ ລະຫວ່າງ ສປປ ລາວ ແລະ ປະເທດຄູ່ຮ່ວມ, ໂດຍຜ່ານລະບົບທີ່ປອດໄພ, ວ່ອງໄວ, ແລະ ສະດວກສະບາຍ.",
    icon: "fa-solid fa-link",
    side: "left",
  },
  {
    id: "02",
    title: "ພາບລວມການເຊື່ອມໂຍງການຊຳລະຂ້າມແດນດ້ວຍ QR Code (Cross-border QR Payment)",
    text: "ບໍລິສັດ ລາວເນເຊີນນໍ ເພເມັ້ນ ເນັດເວີກ ຈຳກັດ (LAPNET) ມີຄວາມມຸ່ງໝັ້ນໃນການພັດທະນາລະບົບເພື່ອເປັນພື້ນຖານໂຄງຮ່າງດ້ານການຊຳ ລະສະສາງ ແລະ ເຊື່ອມໂຍງເຂົ້າກັນບັນດາປະເທດພາກພື້ນ. ໂດຍເລີ່ມຕົ້ນຈາກການຮ່ວມມືກັບບັນດາປະເທດໃກ້ຄຽງເປັນຕົ້ນແມ່ນ: ຣາຊະອານາຈັກ ກຳປູເຈຍ, ຣາຊະອານາຈັກ ໄທ, ສາທາລະນະລັດ ສັງຄົມນິຍົມ ຫວຽດນາມ, ແລະ ສາທານະລັດ ປະຊາຊົນ ຈີນ.",
    icon: "fa-solid fa-link",
    side: "right",
  },
  {
    id: "03",
    title: "ກົນໄກການຊຳລະ",
    text: "ໂຄງການນີ້ໄດ້ນຳໃຊ້ເທັກໂນໂລຢີ QR Code ທີ່ທັນສະໄໝ.",
    icon: "fa-solid fa-qrcode",
    side: "left",
  },
  {
    id: "04",
    title: "ສຳລັບນັກທ່ອງທຽວ",
    text: "ນັກທ່ອງທ່ຽວຈາກປະເທດຄູ່ຮ່ວມສາມາດນໍາໃຊ້ Mobile Banking Application ຂອງທະນາຄານທີ່ເຂົ້າຮ່ວມໂຄງການ ເພື່ອສະແກນຈ່າຍຄ່າສິນຄ້າ ແລະ ບໍລິການຢູ່ຮ້ານຄ້າໃນ ສປປ ລາວ (ເຊັ່ນ: ການໃຊ້ແອັບໄທສະແກນ LAO QR ຫຼື ແອັບກຳປູເຈຍ ສະແກນ LAO QR);",
    icon: "fa-solid fa-list-check",
    side: "right",
  },
  {
    id: "05",
    title: "ສຳລັບຮ້ານຄ້າ",
    text: "ຮ້ານຄ້າພາຍໃນ ສປປ ລາວ ສາມາດຮັບການຊຳລະຈາກຕ່າງປະເທດໄດ້ ໂດຍຈະໄດ້ຮັບເງິນເປັນເງິນສະກຸນທ້ອງຖິ່ນ (ເງິນ ກີບ) ເຂົ້າບັນຊີຂອງຕົນໂດຍກົງ, ໂດຍລະບົບຈະມີການຄິດໄລ່ການແລກປ່ຽນເງິນຕາແບບອັດຕະໂນມັດຕາມອັດຕາ ແລກປ່ຽນທີ່ໄດ້ກຳນົດໄວ້ໃນເວລາເຮັດທຸລະກຳ.",
    icon: "fa-solid fa-bolt",
    side: "left",
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
    gsap.from(".process-eyebrow, .process-title, .process-copy", {
      opacity: 0,
      y: 24,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.1,
    });

    const timelineRoot = timelineSection.value?.querySelector<HTMLElement>(".process-timeline");
    const lineRail = timelineSection.value?.querySelector<HTMLElement>(".process-line");
    const lineFill = timelineSection.value?.querySelector<HTMLElement>(".process-line-fill");
    const lineGlow = timelineSection.value?.querySelector<HTMLElement>(".process-line-glow");

    const syncLineGeometry = () => {
      if (!timelineRoot || !lineRail || !lineFill || !lineGlow) return 0;

      const nodes = gsap.utils.toArray<HTMLElement>(".process-node");
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];

      if (!firstNode || !lastNode) return 0;

      const timelineRect = timelineRoot.getBoundingClientRect();
      const firstRect = firstNode.getBoundingClientRect();
      const lastRect = lastNode.getBoundingClientRect();

      const start = firstRect.top - timelineRect.top + firstRect.height / 2;
      const end = lastRect.top - timelineRect.top + lastRect.height / 2;
      const travel = Math.max(end - start, 1);

      gsap.set(lineRail, {
        top: start,
        height: travel,
        bottom: "auto",
      });

      gsap.set(lineFill, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      gsap.set(lineGlow, {
        y: 0,
      });

      return travel;
    };

    if (timelineRoot && lineRail && lineFill && lineGlow) {
      syncLineGeometry();

      gsap.set(lineFill, { scaleY: 0, transformOrigin: "top center" });

      gsap.timeline({
        scrollTrigger: {
          trigger: timelineRoot,
          start: "top 72%",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
          onRefresh: () => {
            syncLineGeometry();
          },
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
      scale: 1.06,
      boxShadow: "0 0 0 9px rgba(49, 61, 255, 0.1), 0 0 22px rgba(49, 61, 255, 0.42)",
      duration: 1.35,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".process-node-ring", {
      scale: 1.12,
      opacity: 0.55,
      duration: 1.45,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.15,
    });

    gsap.utils.toArray<HTMLElement>(".process-row").forEach((item) => {
      const isLeft = item.classList.contains("is-left");
      const card = item.querySelector(".process-card");
      const node = item.querySelector(".process-node");

      if (card) {
        gsap.from(card, {
          opacity: 0,
          y: 42,
          x: isLeft ? 48 : -48,
          duration: 0.82,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (node) {
        gsap.from(node, {
          opacity: 0,
          scale: 0.5,
          duration: 0.48,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        });
      }

      ScrollTrigger.create({
        trigger: item,
        start: "top 58%",
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
    <div class="process-shell">
      <div class="process-header">
        <span class="process-eyebrow">How It Works</span>
        <h2 class="process-title">
          ຂັ້ນຕອນການຊຳລະ
          <span>ຂ້າມແດນຜ່ານ QR Code</span>
        </h2>
        <p class="process-copy">
          ປັດຈຸບັນ LAPNet ໄດ້ຮ່ວມໂຄງການກັບ 4 ປະເທດຄື: ປະເທດກຳປູເຈຍ, ປະເທດໄທ, ປະເທດຈີນ ແລະ ປະເທດຫວຽດນາມ.
        </p>
      </div>

      <div class="process-timeline">
        <div class="process-line">
          <div class="process-line-track"></div>
          <div class="process-line-fill"></div>
          <div class="process-line-glow"></div>
        </div>

        <div
          v-for="item in crossBorderTimeline"
          :key="item.id"
          class="process-row"
          :class="item.side === 'left' ? 'is-left' : 'is-right'"
        >
          <div class="process-side process-side--left">
            <article v-if="item.side === 'left'" class="process-card">
              <span class="process-step">{{ item.id }}</span>
              <h3 class="process-card-title">{{ item.title }}</h3>
              <p class="process-card-text">{{ item.text }}</p>
            </article>
          </div>

          <div class="process-node-column">
            <span class="process-node-ring"></span>
            <span class="process-node">
              <i :class="item.icon"></i>
            </span>
          </div>

          <div class="process-side process-side--right">
            <article v-if="item.side === 'right'" class="process-card">
              <span class="process-step">{{ item.id }}</span>
              <h3 class="process-card-title">{{ item.title }}</h3>
              <p class="process-card-text">{{ item.text }}</p>
            </article>
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
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600&display=swap");

.process-showcase {
  position: relative;
  overflow: hidden;
  padding: clamp(5rem, 7vw, 6.75rem) 0;
  background:
    radial-gradient(circle at 20% 16%, rgba(190, 194, 255, 0.2), transparent 34%),
    radial-gradient(circle at 86% 78%, rgba(224, 232, 250, 0.55), transparent 26%),
    linear-gradient(180deg, #f7f9fb 0%, #f7f9fb 62%, #ffffff 100%);
}

.process-shell {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}

.process-header {
  max-width: 760px;
  margin: 0 auto clamp(3.5rem, 6vw, 5.5rem);
  text-align: center;
}

.process-eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  font-family: "Inter", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #313dff;
}

.process-title {
  margin: 0;
   font-family: "Inter", sans-serif;
  font-size: clamp(2.25rem, 4vw, 4.1rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: #191c1e;
}

.process-title span {
  color: #000abc;
  background: linear-gradient(135deg, #000ba6 0%, #001cff 45%, #00a6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.process-copy {
  max-width: 560px;
  margin: 18px auto 0;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  line-height: 1.75;
  color: #6d7387;
}

.process-timeline {
  position: relative;
  padding: 4px 0 0;
}

.process-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  transform: translateX(-50%);
}

.process-line-track,
.process-line-fill {
  position: absolute;
  inset: 0;
  border-radius: 999px;
}

.process-line-track {
  background: linear-gradient(180deg, rgba(224, 227, 229, 1), rgba(224, 227, 229, 0.78));
}

.process-line-fill {
  background: linear-gradient(180deg, #000ba6 0%, #0011ff 100%);
  box-shadow: 0 0 18px rgba(0, 17, 255, 0.2);
}

.process-line-glow {
  position: absolute;
  left: 50%;
  top: 0;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  transform: translateX(-50%);
  background:
    radial-gradient(circle at 32% 32%, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.32) 42%, rgba(0, 17, 255, 0.92) 70%, rgba(0, 17, 255, 0.08) 100%);
  box-shadow: 0 0 0 6px rgba(0, 17, 255, 0.08), 0 0 16px rgba(0, 17, 255, 0.26);
}

.process-row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 74px minmax(0, 1fr);
  align-items: center;
  margin: 0 0 2.3rem;
}

.process-side {
  display: flex;
}

.process-side--left {
  justify-content: flex-end;
  padding-right: 24px;
}

.process-side--right {
  justify-content: flex-start;
  padding-left: 24px;
}

.process-node-column {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.process-node-ring,
.process-node {
  position: absolute;
  border-radius: 999px;
}

.process-node-ring {
  width: 26px;
  height: 26px;
  border: 1px solid rgba(0, 17, 255, 0.18);
  background: rgba(0, 17, 255, 0.04);
  opacity: 0.4;
}

.process-node {
  position: relative;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: #000abc;
  font-size: 0.9rem;
  background: #e6e8ea;
  box-shadow: 0 8px 22px rgba(19, 27, 46, 0.08);
  transition: background 0.28s ease, color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;
}

.process-card {
  width: min(100%, 348px);
  min-height: 150px;
  padding: 24px 24px 22px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid rgba(197, 196, 219, 0.15);
  box-shadow: 0 26px 55px rgba(19, 27, 46, 0.06);
  transition: transform 0.32s ease, box-shadow 0.32s ease;
}

.process-step {
  display: inline-block;
  margin-bottom: 10px;
  font-family: "Manrope", "Inter", sans-serif;
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.05em;
  color: rgba(0, 17, 255, 0.22);
}

.process-card-title {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 1.08rem;
  line-height: 1.42;
  font-weight: 600;
  color: #191c1e;
}

.process-card-text {
  margin: 10px 0 0;
  font-family: "Inter", sans-serif;
  font-size: 0.92rem;
  line-height: 1.72;
  color: #767b8b;
}

.process-row.is-active .process-card {
  transform: translateY(-4px);
  box-shadow: 0 32px 62px rgba(19, 27, 46, 0.08);
}

.process-row.is-active .process-node {
  color: #ffffff;
  background: linear-gradient(135deg, #000ba6 0%, #0011ff 100%);
  box-shadow: 0 0 0 8px rgba(0, 17, 255, 0.08), 0 16px 34px rgba(0, 17, 255, 0.22);
  transform: scale(1.04);
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
  .process-shell {
    padding: 0 22px;
  }

  .process-line {
    left: 20px;
    transform: none;
  }

  .process-row {
    grid-template-columns: 40px minmax(0, 1fr);
    gap: 18px;
    margin-bottom: 1.8rem;
  }

  .process-side--left,
  .process-side--right {
    grid-column: 2;
    justify-content: flex-start;
    padding: 0;
  }

  .process-side--left:empty,
  .process-side--right:empty {
    display: none;
  }

  .process-node-column {
    grid-column: 1;
    align-items: flex-start;
    padding-top: 18px;
  }

  .process-row.is-left .process-side--left,
  .process-row.is-right .process-side--right {
    grid-column: 2;
  }

  .process-card {
    width: 100%;
    min-height: 0;
  }
}

@media (max-width: 640px) {
  .process-showcase {
    padding: 4.25rem 0;
  }

  .process-title {
    font-size: 1.95rem;
  }

  .process-copy {
    font-size: 0.94rem;
    line-height: 1.72;
  }

  .process-card {
    padding: 22px 18px 20px;
    border-radius: 24px;
  }

  .process-card-title {
    font-size: 1rem;
  }

  .process-card-text {
    font-size: 0.9rem;
    line-height: 1.66;
  }

  .process-step {
    font-size: 2.05rem;
  }

  .process-node {
    width: 36px;
    height: 36px;
    font-size: 0.82rem;
  }
}
</style>
