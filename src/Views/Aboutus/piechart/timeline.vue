<template>
  <div class="page">
    <div class="wrap">
      <header class="hero">
        <div>
          <div class="kicker">Roadmap</div>
          <h1> <span id="roadmap-title">ຄວາມເປັນມາຂອງ</span> <br>Lao National Payment Network CO., LTD</h1>
         
        </div>
      </header>

      <section class="timeline" ref="timelineRef">
        <div class="line" aria-hidden="true">
          <div class="lineFill" ref="lineFillRef" />
        </div>

        <article v-for="(item, i) in items" :key="item.id" class="event" :data-side="item.side"
          :ref="(el) => setEventRef(el, i)">
          <!-- Left side -->
          <div class="side left" :class="{ reveal: item.side === 'left' }">
            <div v-if="item.side === 'left'" class="card" role="button" tabindex="0" @click="openOverlay(item, i)"
              @keydown.enter="openOverlay(item, i)" @keydown.space.prevent="openOverlay(item, i)"
              @mouseenter="onCardEnter(i)" @mouseleave="onCardLeave(i)">
              <div class="date">{{ item.date }}</div>

              <h3 class="title">
                <i class="fa-solid" :class="item.icon" aria-hidden="true"></i>
                <span>{{ item.title }}</span>
              </h3>

              <p class="desc">{{ item.desc }}</p>

              <div class="readmore">
                <span class="readmore-dot">●</span>
                <span>ອ່ານທັງໝົດ</span>
              </div>
            </div>
          </div>

          <!-- Middle -->
          <div class="mid">
            <span class="connector" aria-hidden="true">
              <span class="connector-flow" aria-hidden="true" />
            </span>
            <span class="node" aria-hidden="true" />
          </div>

          <!-- Right side -->
          <div class="side right" :class="{ reveal: item.side === 'right' }">
            <div v-if="item.side === 'right'" class="card" role="button" tabindex="0" @click="openOverlay(item, i)"
              @keydown.enter="openOverlay(item, i)" @keydown.space.prevent="openOverlay(item, i)"
              @mouseenter="onCardEnter(i)" @mouseleave="onCardLeave(i)">
              <div class="date">{{ item.date }}</div>

              <h3 class="title">
                <i class="fa-solid" :class="item.icon" aria-hidden="true"></i>
                <span>{{ item.title }}</span>
              </h3>

              <p class="desc">{{ item.desc }}</p>

              <div class="readmore">
                <span class="readmore-dot">●</span>
                <span>ອ່ານທັງໝົດ</span>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>

    <!-- ✅ Overlay (full read) -->
    <Teleport to="body">
      <div v-if="isOverlayOpen && activeItem" class="overlay" ref="overlayRef" @click.self="closeOverlay">
        <button class="overlay-close" @click="closeOverlay" aria-label="Close">
          ✕
        </button>

        <div class="overlay-card" ref="overlayCardRef" role="dialog" aria-modal="true" @pointerdown="onSwipeDown"
          @pointermove="onSwipeMove" @pointerup="onSwipeUp" @pointercancel="onSwipeCancel">
          <div class="overlay-top">
            <div class="overlay-chip">
              <span class="overlay-chip-dot" />
              <span>{{ activeItem.date }}</span>
            </div>

            <h2 class="overlay-title">
              <i class="fa-solid" :class="activeItem.icon" aria-hidden="true"></i>
              <span>{{ activeItem.title }}</span>
            </h2>

            <div class="overlay-counter">
              <span class="overlay-count">{{ activeIndex + 1 }}</span>
              <span class="overlay-total">/ {{ items.length }}</span>
            </div>
          </div>

          <div class="overlay-body">
            <p class="overlay-desc">
              {{ activeItem.desc }}
            </p>
          </div>

          <!-- ✅ Bottom actions (theme-matching) -->
          <div class="overlay-actions" role="group" aria-label="Overlay navigation" @pointerdown.stop @pointerup.stop
            @pointercancel.stop>
            <button class="ov-btn ov-prev" :disabled="!hasPrev" :class="{ disabled: !hasPrev }" @click="goPrev"
              @pointerdown.stop @pointerup.stop @pointercancel.stop aria-label="Previous" title="Previous"
              type="button">
              <span class="ov-ico">←</span>
              <span class="ov-txt">Prev</span>
            </button>

            <!-- ✅ Dots indicator -->
            <div class="overlay-dots" role="tablist" aria-label="Pages">
              <button v-for="(it, idx) in items" :key="it.id" class="dot" :class="{ active: idx === activeIndex }"
                type="button" role="tab" :aria-selected="idx === activeIndex"
                :aria-current="idx === activeIndex ? 'true' : undefined" :title="`Page ${idx + 1} / ${items.length}`"
                @click="goTo(idx)" @pointerdown.stop @pointerup.stop @pointercancel.stop>
                <span class="sr-only">Go to page {{ idx + 1 }}</span>
              </button>
            </div>

            <button class="ov-btn ov-next" :disabled="!hasNext" :class="{ disabled: !hasNext }" @click="goNext"
              @pointerdown.stop @pointerup.stop @pointercancel.stop aria-label="Next" title="Next" type="button">
              <span class="ov-txt">Next</span>
              <span class="ov-ico">→</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = ref([
  {
    id: "p1",
    side: "left",
    icon: "fa-solid fa-landmark",
    date: "Phase 01 • ",
    title: "ເຄົ້າກໍາເນີດ ",
    desc: "ເຄົ້າກໍາເນີດ ແມ່ນມາຈາກໂຄງການຊ່ວຍເຫຼືອລະຫວ່າງລັດຖະບານ ສປ ຈີນ ຕໍ່ກັບ ສປປ ລາວ ຕາມສານແລກປ່ຽນວ່າດ້ວຍ ລັດຖະບານ ສປ ຈີນ ເຫັນດີຊ່ວຍເຫຼືອລັດຖະບານ  ສປປ ລາວ ປະຕິບັດ “ໂຄງການລະບົບຊຳລະດ້ວຍບັດອັດຕະໂນມັດຂອງທະນາຄານ”.",
  },
  {
    id: "p2",
    side: "right",
    icon: "fa-circle-play",
    date: "Phase 02 • ",
    title: "ເປີດນຳໃຊ້ລະບົບຢ່າງເປັນທາງການ",
    desc: "ພາຍຫຼັງໂຄງການດັ່ງກ່າວໄດ້ສໍາເລັດ ແລະ ເປີດໃຫ້ບໍລິການລະບົບບັດທະນາຄານ   ຮ່ວມກັນ ຫຼື Lao ATM Pool Switching (LAPS) ຢ່າງເປັນທາງການໃນວັນທີ 01 ທັນວາ 2015 ພາຍໃຕ້ການບໍລິຫານຂອງ ທະນາຄານແຫ່ງ ສປປ ລາວ.",
  },
  {
    id: "p3",
    side: "left",
    icon: "fa-screwdriver-wrench",
    date: "Phase 03 • ",
    title: "ການບຳລຸງຮັກສາລະບົບ",
    desc: "ການບໍາລຸງຮັກສາທາງດ້ານເຕັກນິກດ້ວຍຮູບແບບຊ່ວຍເຫຼືອລ້າ ເປັນໄລຍະເວລາ 03 ປີ ແມ່ນຄວາມຮັບຜິດຊອບໃນຂອງ ບໍລິສັດ ຢູນຽນເພ ສປ ຈີນ (China UnionPay). ",
  },
  {
    id: "p4",
    side: "right",
    icon: "fa-solid fa-arrows-rotate",
    date: "Phase 04 • ",
    title: "ຫັນເປັນນິຕິບຸກຄົນ",
    desc: "ຜ່ານການຈັດຕັ້ງປະຕິບັດຕົວຈິງ ໃນໄລຍະເວລາ 03 ປີ ຫຼັງການຊ່ວຍເຫຼືອລ້າຈາກລັດຖະບານ ສປ ຈີນ ທາງທະນາຄານແຫ່ງ ສປປ ລາວ ຈຶ່ງມີມະຕິຕົກລົງເຫັນດີໃຫ້ຫັນເອົາວຽກງານໂຄງການດັ່ງກ່າວ ມາເປັນນິຕິບຸກຄົນໃນຮູບແບບ ບໍລິສັດ ຈໍາກັດ ກໍຄື ສ້າງຕັ້ງເປັນ ບໍລິສັດ ລາວເນເຊີນນໍ ເພເມັ້ນ ເນັດເວີກ ຈຳກັດ (LAPNet) ໃນວັນທີ 12 ມີນາ 2019  ທີ່ດໍາເນີນທຸລະກິດພາຍໃຕ້ການຮ່ວມທຶນຂອງ 09 ຜູ້ຖືຮຸ້ນ.",
  },
  {
    id: "p5",
    side: "left",
    icon: "fa-solid fa-users",
    date: "Phase 05 • ",
    title: "ຜູ້ຖືຮຸ້ນ",
    desc: "ດໍາເນີນທຸລະກິດພາຍໃຕ້ການຮ່ວມທຶນຂອງ 09 ຜູ້ຖືຮຸ້ນຄື: ທະນາຄານແຫ່ງ ສປປ ລາວ, ທະນາຄານ ການຄ້າຕ່າງປະເທດລາວ ມະຫາຊົນ, ບໍລິສັດ ຢູນຽນເພ ສາກົນ, ທະນາຄານ ພັດທະນາລາວ ຈຳກັດ, ທະນາຄານ ສົ່ງເສີມກະສິກຳ ຈຳກັດ, ທະນາຄານ ຮ່ວມທຸລະກິດລາວ-ຫວຽດ ຈໍາກັດ, ທະນາຄານ ຮ່ວມພັດທະນາ ມະຫາຊົນ, ທະນາຄານ ເອັສທີ ຈຳກັດ ແລະ ທະນາຄານ ບີໄອຊີ ລາວ ຈຳກັດ.",
  },
]);

const timelineRef = ref(null);
const lineFillRef = ref(null);
const eventRefs = ref([]);

function setEventRef(el, idx) {
  if (!el) return;
  eventRefs.value[idx] = el;
}

let triggers = [];

// ✅ hover tech-line tweens
const flowTweens = ref([]);

// ✅ overlay state
const isOverlayOpen = ref(false);
const activeItem = ref(null);
const activeIndex = ref(-1);
const overlayRef = ref(null);
const overlayCardRef = ref(null);

// ✅ prev / next computed
const hasPrev = computed(() => activeIndex.value > 0);
const hasNext = computed(() => activeIndex.value < items.value.length - 1);

/** ✅ Swipe state (left/right to prev/next) */
const swipe = ref({
  active: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
});
const swipeCooldown = ref(false);

function onSwipeDown(e) {
  if (!isOverlayOpen.value) return;
  if (e.pointerType === "mouse" && e.button !== 0) return;

  // ✅ IMPORTANT: ถ้ากดบนปุ่ม/แถบ actions/dots ไม่เริ่ม swipe
  const target = e.target;
  if (
    target?.closest?.(".overlay-actions") ||
    target?.closest?.("button") ||
    target?.closest?.("a") ||
    target?.closest?.("input, textarea, select")
  ) {
    return;
  }

  swipe.value.active = true;
  swipe.value.pointerId = e.pointerId;
  swipe.value.startX = e.clientX;
  swipe.value.startY = e.clientY;
  swipe.value.lastX = e.clientX;
  swipe.value.lastY = e.clientY;

  try {
    e.currentTarget?.setPointerCapture?.(e.pointerId);
  } catch { }
}

function onSwipeMove(e) {
  if (!swipe.value.active) return;
  if (swipe.value.pointerId != null && e.pointerId !== swipe.value.pointerId) return;
  swipe.value.lastX = e.clientX;
  swipe.value.lastY = e.clientY;
}

function onSwipeUp(e) {
  if (!swipe.value.active) return;
  if (swipe.value.pointerId != null && e.pointerId !== swipe.value.pointerId) return;

  const dx = swipe.value.lastX - swipe.value.startX;
  const dy = swipe.value.lastY - swipe.value.startY;

  onSwipeCancel();

  // ignore tiny swipes + require horizontal dominance
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const MIN = 45;
  const DOM = 1.2;

  if (absX < MIN) return;
  if (absX < absY * DOM) return;

  if (swipeCooldown.value) return;
  swipeCooldown.value = true;
  setTimeout(() => (swipeCooldown.value = false), 260);

  // swipe left => next, swipe right => prev
  if (dx < 0) goNext();
  else goPrev();
}

function onSwipeCancel() {
  swipe.value.active = false;
  swipe.value.pointerId = null;
}

/** ✅ GSAP swap (fade/slide) + update content in-between */
function swapToIndex(newIndex, direction = 1) {
  if (newIndex < 0 || newIndex > items.value.length - 1) return;

  const card = overlayCardRef.value;
  if (!card) {
    activeIndex.value = newIndex;
    activeItem.value = items.value[newIndex];
    return;
  }

  const outX = direction > 0 ? -18 : 18;
  const inX = direction > 0 ? 18 : -18;

  const tl = gsap.timeline();
  tl.to(card, {
    autoAlpha: 0,
    x: outX,
    y: 6,
    scale: 0.99,
    duration: 0.14,
    ease: "power2.inOut",
  })
    .add(() => {
      activeIndex.value = newIndex;
      activeItem.value = items.value[newIndex];
    })
    .set(card, { x: inX, y: 0 })
    .to(card, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: "power3.out",
    });
}

function goPrev() {
  if (!hasPrev.value) return;
  swapToIndex(activeIndex.value - 1, -1);
}

function goNext() {
  if (!hasNext.value) return;
  swapToIndex(activeIndex.value + 1, 1);
}

function goTo(idx) {
  if (idx === activeIndex.value) return;
  const dir = idx > activeIndex.value ? 1 : -1;
  swapToIndex(idx, dir);
}

function onCardEnter(i) {
  const eventEl = eventRefs.value[i];
  if (!eventEl) return;

  const flow = eventEl.querySelector(".connector-flow");
  const card = eventEl.querySelector(".card");
  const node = eventEl.querySelector(".node");

  if (card) {
    gsap.to(card, {
      duration: 0.22,
      y: -2,
      boxShadow: "0 26px 90px rgba(0,0,0,.66)",
      ease: "power2.out",
    });
  }

  if (node) {
    gsap.to(node, { duration: 0.25, scale: 1.08, ease: "power2.out" });
  }

  if (flow) {
    gsap.set(flow, { opacity: 1, x: -46 });
    if (flowTweens.value[i]) flowTweens.value[i].kill();
    flowTweens.value[i] = gsap.to(flow, {
      x: 64,
      duration: 1.05,
      ease: "none",
      repeat: -1,
    });
  }
}

function onCardLeave(i) {
  const eventEl = eventRefs.value[i];
  if (!eventEl) return;

  const flow = eventEl.querySelector(".connector-flow");
  const card = eventEl.querySelector(".card");
  const node = eventEl.querySelector(".node");

  if (card) {
    gsap.to(card, {
      duration: 0.22,
      y: 0,
      boxShadow: "var(--shadow)",
      ease: "power2.out",
    });
  }

  if (node) {
    gsap.to(node, { duration: 0.22, scale: 1, ease: "power2.out" });
  }

  const t = flowTweens.value[i];
  if (t) {
    t.kill();
    flowTweens.value[i] = null;
  }
  if (flow) {
    gsap.to(flow, { opacity: 0, duration: 0.18, ease: "power2.out" });
  }
}

function openOverlay(item, i) {
  activeItem.value = item;
  activeIndex.value = i;
  isOverlayOpen.value = true;

  // lock scroll
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  // reset swipe
  onSwipeCancel();
  swipeCooldown.value = false;

  nextTick(() => {
    const ov = overlayRef.value;
    const card = overlayCardRef.value;
    if (!ov || !card) return;

    gsap.set(ov, { autoAlpha: 0 });
    gsap.set(card, { autoAlpha: 0, y: 18, x: 0, scale: 0.985 });

    gsap
      .timeline()
      .to(ov, { autoAlpha: 1, duration: 0.18, ease: "power2.out" })
      .to(
        card,
        { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: 0.34, ease: "power3.out" },
        "-=0.05"
      );
  });
}

function closeOverlay() {
  const ov = overlayRef.value;
  const card = overlayCardRef.value;

  const done = () => {
    isOverlayOpen.value = false;
    activeItem.value = null;
    activeIndex.value = -1;

    // unlock scroll
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    onSwipeCancel();
    swipeCooldown.value = false;
  };

  if (!ov || !card) {
    done();
    return;
  }

  gsap
    .timeline({ onComplete: done })
    .to(card, {
      autoAlpha: 0,
      y: 10,
      x: 0,
      scale: 0.985,
      duration: 0.18,
      ease: "power2.inOut",
    })
    .to(ov, { autoAlpha: 0, duration: 0.2, ease: "power2.inOut" }, "-=0.06");
}

function onKeydown(e) {
  if (!isOverlayOpen.value) return;
  if (e.key === "Escape") closeOverlay();
  if (e.key === "ArrowLeft") goPrev();
  if (e.key === "ArrowRight") goNext();
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);

  if (lineFillRef.value && timelineRef.value) {
    gsap.set(lineFillRef.value, { scaleY: 0, transformOrigin: "top" });

    const st = ScrollTrigger.create({
      trigger: timelineRef.value,
      start: "top 70%",
      end: "bottom 70%",
      scrub: true,
      onUpdate: (self) => {
        gsap.to(lineFillRef.value, {
          scaleY: self.progress,
          ease: "none",
          overwrite: true,
          duration: 0,
        });
      },
    });

    triggers.push(st);
  }

  eventRefs.value.forEach((eventEl) => {
    if (!eventEl) return;

    const node = eventEl.querySelector(".node");
    const reveal = eventEl.querySelector(".reveal");
    const side = eventEl.dataset.side;
    const fromX = side === "left" ? -26 : 26;

    if (node) gsap.set(node, { opacity: 0, scale: 0.6 });
    if (reveal) gsap.set(reveal, { opacity: 0, x: fromX, y: 14 });

    const t = gsap.timeline({
      scrollTrigger: {
        trigger: eventEl,
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    });

    if (node) {
      t.to(node, {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "back.out(2.2)",
      });
    }

    if (reveal) {
      t.to(
        reveal,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        0.05
      );
    }

    triggers.push(t.scrollTrigger);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);

  triggers.forEach((t) => t && t.kill && t.kill());
  triggers = [];

  flowTweens.value.forEach((t) => t && t.kill && t.kill());
  flowTweens.value = [];

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* screen-reader only */
#roadmap-title {
  font-size: 50px;   font-weight: bold;
  background: #5BBDFF;
  background: linear-gradient(to right, #5BBDFF 0%, #0f44ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.page {
  --bg0: #03081a;
  --bg1: #01030f;
  --text: #eaf1ff;
  --muted: rgba(234, 241, 255, .70);
  --line: rgba(127, 168, 255, .22);
  --accent: #0048ff;
  --accent2: #60a5fa;
  --accent3: #a78bfa;
  --accent4: #5eead4;

  --card: rgba(255, 255, 255, .06);
  --stroke: rgba(255, 255, 255, .12);
  --shadow: 0 20px 70px rgba(0, 0, 0, .62);
  --radius: 18px;

  min-height: 100vh;
  color: var(--text);
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background:
    radial-gradient(900px 600px at 72% 18%, rgba(96, 165, 250, .22), transparent 56%),
    radial-gradient(820px 540px at 28% 82%, rgba(167, 139, 250, .18), transparent 58%),
    radial-gradient(720px 460px at 50% 45%, rgba(94, 234, 212, .10), transparent 60%),
    linear-gradient(180deg, var(--bg0), var(--bg1));
  position: relative;
  overflow: hidden;
}

.page::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: radial-gradient(1200px 700px at 50% -10%, rgba(255, 255, 255, .06), transparent 58%);
  pointer-events: none;
  mix-blend-mode: soft-light;
}

.page::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, .05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .05) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: .06;
  pointer-events: none;
  mask-image: radial-gradient(circle at 50% 30%, black 0%, transparent 68%);
}

.wrap {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 22px 90px;
  color: var(--text);
}

.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 28px;
}

.kicker {
  font-size: 12px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(234, 240, 255, .55);
}

h1 {
  margin: .35rem 0 0;
  font-size: clamp(30px, 3.8vw, 39px);
  line-height: 1.08;
  font-weight: 700;
}

.sub {
  max-width: 560px;
  color: var(--muted);
  margin: 10px 0 0;
  line-height: 1.6;
  font-size: 14.5px;
}

.timeline {
  position: relative;
  margin-top: 26px;
  padding: 26px 0;
}

.line {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 255, .05);
}

.lineFill {
  width: 100%;
  height: 100%;
  transform-origin: top;
  background: linear-gradient(180deg,
      rgba(96, 165, 250, 0),
      rgba(96, 165, 250, .65) 22%,
      rgba(167, 139, 250, .62) 72%,
      rgba(167, 139, 250, 0));
  filter: drop-shadow(0 0 14px rgba(96, 165, 250, .35));
}

.event {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 72px 1fr;
  align-items: center;
  padding: 18px 0;
  min-height: 120px;
}

.side {
  padding: 10px 18px;
}

.side.left {
  text-align: left;
}

.side.right {
  text-align: left;
}

.date {
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(234, 240, 255, .55);
  margin-bottom: 8px;
}

.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  margin: 0 0 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.title i {
  font-size: 15px;
  opacity: .95;
  margin-top: 2px;
}

.desc {
  margin: 0;
  color: rgba(234, 241, 255, .78);
  font-size: 14.2px;
  text-align: justify;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.readmore {
  margin-top: 10px;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: rgba(234, 241, 255, .62);
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: .85;
}

.readmore-dot {
  font-size: 10px;
  color: rgba(94, 234, 212, .95);
  text-shadow: 0 0 10px rgba(94, 234, 212, .4);
}

.mid {
  display: flex;
  align-items: stretch;
  justify-content: center;
  position: relative;
  height: 100%;
  min-height: 120px;
}

/* node centered ALWAYS (desktop) */
.node {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent2), var(--accent3));
  box-shadow:
    0 0 0 6px rgba(96, 165, 250, .11),
    0 0 0 14px rgba(167, 139, 250, .08),
    0 12px 40px rgba(96, 165, 250, .20);
  border: 1px solid rgba(255, 255, 255, .18);
}

.connector {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  height: 2px;
  width: 46px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(140, 170, 255, .0), rgba(140, 170, 255, .55));
  opacity: .85;
  overflow: hidden;
}

.connector-flow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 24px;
  border-radius: 999px;
  opacity: 0;
  background: linear-gradient(90deg, rgba(94, 234, 212, 0), rgba(96, 165, 250, .95), rgba(167, 139, 250, .92), rgba(94, 234, 212, 0));
  filter: drop-shadow(0 0 10px rgba(96, 165, 250, .45));
}

.event[data-side="left"] .connector {
  left: auto;
  right: 50%;
  transform: translateY(-50%) scaleX(-1);
}

.card {
  display: inline-block;
  max-width: 460px;
  padding: 16px 18px;
  border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(255, 255, 255, .085), rgba(255, 255, 255, .045));
  border: 1px solid rgba(255, 255, 255, .14);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  position: relative;
  cursor: pointer;
  outline: none;
  transition: border-color .18s ease, transform .18s ease;
}

.card:focus-visible {
  border-color: rgba(219, 234, 254, .85);
  box-shadow:
    0 26px 90px rgba(0, 0, 0, .66),
    0 0 0 2px rgba(96, 165, 250, .35);
}

.event[data-side="left"] .card {
  margin-left: auto;
}

.card::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: var(--radius);
  background:
    radial-gradient(420px 140px at 10% 10%, rgba(96, 165, 250, .14), transparent 50%),
    radial-gradient(460px 160px at 90% 80%, rgba(167, 139, 250, .14), transparent 55%);
  pointer-events: none;
  opacity: .7;
  filter: blur(18px);
  z-index: -1;
}

/* ✅ Overlay */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
  background:
    radial-gradient(circle at top, rgba(15, 23, 42, .92) 0%, rgba(15, 23, 42, .98) 55%, rgba(15, 23, 42, 1) 100%);
  backdrop-filter: blur(10px);
}

.overlay-close {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 10000;
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  cursor: pointer;
  color: #eaf2ff;
  background: rgba(15, 23, 42, .85);
  box-shadow:
    0 16px 34px rgba(0, 0, 0, .55),
    0 0 0 1px rgba(255, 255, 255, .18);
  backdrop-filter: blur(8px);
  transition: transform .18s ease, background .18s ease;
}

.overlay-close:hover {
  transform: translateY(-1px);
  background: rgba(30, 64, 175, .92);
}

.overlay-card {
  width: min(920px, 100%);
  max-height: 86vh;
  overflow: auto;
  border-radius: 22px;

  padding: 18px 18px 0;
  /* bottom handled by sticky actions */
  background: linear-gradient(180deg, rgba(255, 255, 255, .10), rgba(255, 255, 255, .06));
  border: 1px solid rgba(255, 255, 255, .16);
  box-shadow:
    0 40px 120px rgba(0, 0, 0, .72),
    0 0 0 1px rgba(255, 255, 255, .14);
  backdrop-filter: blur(12px);
  position: relative;

  /* ✅ allow vertical scroll + still detect horizontal swipe */
  touch-action: pan-y;
  overscroll-behavior: contain;
}

.overlay-top {
  padding: 6px 6px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, .10);
  position: relative;
}

.overlay-counter {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(2, 6, 23, .55);
  border: 1px solid rgba(255, 255, 255, .12);
  color: rgba(234, 241, 255, .78);
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;

}

.overlay-count {
  color: rgba(234, 241, 255, .95);
  font-weight: 800;
}

.overlay-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(2, 6, 23, .55);
  border: 1px solid rgba(255, 255, 255, .12);
  color: rgba(234, 241, 255, .82);
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;

}

.overlay-chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent4), var(--accent2), var(--accent3));
  box-shadow: 0 0 0 6px rgba(94, 234, 212, .08), 0 0 18px rgba(96, 165, 250, .35);
}

.overlay-title {
  margin: 12px 0 0;
  color: #fff;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.15;
  font-weight: 700;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.overlay-title i {
  margin-top: 4px;
  opacity: .95;
}

.overlay-body {
  padding: 14px 6px 16px;

}

.overlay-desc {
  margin: 0;
  font-size: 16.5px;
  line-height: 1.85;
  color: rgba(234, 241, 255, .86);
  white-space: pre-wrap;

}

/* ✅ Bottom nav inside overlay card */
.overlay-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

}

.ov-btn {
  border: none;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 999px;
  color: #eaf2ff;
  display: flex;
  align-items: center;
  gap: 10px;

  background: linear-gradient(95deg,
      rgba(0, 72, 255, .35) 0%,
      rgba(96, 165, 250, .30) 40%,
      rgba(167, 139, 250, .28) 100%);
  box-shadow:
    0 18px 44px rgba(0, 0, 0, .45),
    0 0 0 1px rgba(255, 255, 255, .16);
  transition: transform .16s ease, box-shadow .16s ease, filter .16s ease, opacity .16s ease;
}

.ov-btn:hover {
  transform: translateY(-1px);
  box-shadow:
    0 26px 56px rgba(0, 0, 0, .58),
    0 0 0 1px rgba(219, 234, 254, .85);
}

.ov-btn:focus-visible {
  outline: none;
  box-shadow:
    0 26px 56px rgba(0, 0, 0, .58),
    0 0 0 2px rgba(96, 165, 250, .40);
}

.ov-btn.disabled,
.ov-btn:disabled {
  opacity: .35;
  pointer-events: none;
}

.ov-ico {
  font-size: 16px;
  opacity: .95;
}

.ov-txt {
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  opacity: .92;
}

.overlay-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(2, 6, 23, .38);
  border: 1px solid rgba(255, 255, 255, .12);
  box-shadow: 0 12px 30px rgba(0, 0, 0, .35);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: rgba(234, 241, 255, .22);
  box-shadow: 0 0 0 0 rgba(96, 165, 250, .0);
  transition: transform .16s ease, background .16s ease, box-shadow .16s ease, width .16s ease;
}

.dot:hover {
  background: rgba(234, 241, 255, .35);
  transform: translateY(-1px);
}

.dot.active {
  width: 22px;
  background: linear-gradient(90deg, rgba(94, 234, 212, .95), rgba(96, 165, 250, .95), rgba(167, 139, 250, .95));
  box-shadow:
    0 0 0 6px rgba(96, 165, 250, .10),
    0 10px 28px rgba(96, 165, 250, .18);
}

.dot:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(219, 234, 254, .90),
    0 0 0 7px rgba(96, 165, 250, .18);
}

/* ✅ Mobile layout (1 column) — ทำให้ .node อยู่ “กึ่งกลางหน้าจอ” เหมือน overlay-card */
@media (max-width: 820px) {
  .hero {
    flex-direction: column;
    align-items: flex-start
  }

  /* ✅ เส้น timeline กลับมาอยู่กึ่งกลาง (เหมือน overlay-card center) */
  .line {
    left: 50%;
    transform: translateX(-50%);
  }

  /* ✅ 1 column + แยก node เป็นแถวบน เพื่อให้อยู่กลางเสมอและไม่ชนการ์ด */
  .event {
    grid-template-columns: 1fr;
    grid-template-rows: 44px auto;
    align-items: stretch;
    padding: 18px 0 22px;
    min-height: auto;
    position: relative;
  }

  /* ✅ ซ่อน side ที่ไม่ได้ใช้ เพื่อไม่ให้กินพื้นที่ */
  .event[data-side="left"] .side.right {
    display: none;
  }

  .event[data-side="right"] .side.left {
    display: none;
  }

  .mid {
    grid-column: 1;
    grid-row: 1;
    position: relative;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* ✅ node กลางแนวนอน */
  }

  /* ✅ node ไม่ใช้ absolute แล้ว ให้อยู่กลางแถวบนได้เป๊ะ */
  .node {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin: 0 auto;
  }


  .connector {
    display: none;
  }

  .side {
    grid-column: 1;
    grid-row: 2;
    padding: 6px 0 8px;
    align-self: stretch;
    display: block;
  }


  .card {
    display: block;
    width: min(560px, 100%);
    max-width: none;
    margin: 0 auto;
  }

  .event[data-side="left"] .card {
    margin-left: auto;
    margin-right: auto;
  }

  /* overlay */
  .overlay {
    padding: 14px;
  }

  .overlay-card {
    max-height: 88vh;
  }

  .overlay-actions {
    padding: 10px 10px;
    gap: 10px;
  }

  .ov-txt {
    display: none;
  }

  .ov-btn {
    padding: 10px 12px;
  }

  .overlay-dots {
    gap: 7px;
    padding: 6px 8px;
  }
}

/* Extra small phones */
@media (max-width: 420px) {
  .overlay-actions {
    flex-wrap: nowrap;
    gap: 8px;
  }

  .overlay-dots {
    gap: 6px;
  }

  .dot {
    width: 9px;
    height: 9px;
  }

  .dot.active {
    width: 18px;
  }
}
</style>
