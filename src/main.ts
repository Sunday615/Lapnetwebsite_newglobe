import { createApp } from "vue";
import { gsap } from "gsap";
import AOS from "aos";

import App from "./App.vue";
import router from "./router";

import "./mainstyle.css";
import "aos/dist/aos.css";

const app = createApp(App);

app.provide("gsap", gsap);
app.use(router);

let aosReady = false;

router.afterEach(() => {
  if (!aosReady) return;

  requestAnimationFrame(() => {
    AOS.refreshHard();
  });
});

router.isReady().then(() => {
  app.mount("#app");

  AOS.init({
    once: true,
    duration: 700,
    easing: "ease-out-cubic",
    mirror: false,
  });

  aosReady = true;

  if (import.meta.env.DEV) {
    console.log("[env] VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);
  }
});