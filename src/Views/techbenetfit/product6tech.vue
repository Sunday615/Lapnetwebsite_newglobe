<template>
  <section class="landing-tech" ref="section">
    <!-- glow background -->
    <div class="glow glow-top"></div>
    <div class="glow glow-bottom"></div>

    <div class="landing-inner">
      <!-- LOGO -->
      <div class="logolapnet">
        <img src="/logolapnet/logolapnet.PNG" alt="" />
        <img src="/logolapnet/textlogowhite.PNG" alt="" />
      </div>

      <!-- TITLE -->
      <header class="landing-header">
        <p class="kicker">Lao National Payment Network</p>
        <h1>ຄຳອະທິບາຍເພີ່ມເຕີມສຳລັບລູກຄ້າ</h1>
      </header>

      <!-- SLIDER WRAPPER -->
      <div class="slider">
        <button class="nav-arrow nav-arrow--left" @click="handlePrev">‹</button>

        <!-- ✅ Swipe สำหรับ slider -->
        <div
          class="slider-window"
          @pointerdown="onSliderPointerDown"
          @pointermove="onSliderPointerMove"
          @pointerup="onSliderPointerUp"
          @pointercancel="onSliderPointerUp"
        >
          <div
            class="slider-track"
            :class="{ 'is-dragging': isDragging }"
            :style="{
              transform: `translateX(calc(-${currentPage * 100}% + ${dragOffset}px))`
            }"
          >
            <!-- PAGE 1 -->
            <div class="slider-page">
              <div class="features">
                <!-- BLOCK 1 : QR CODE BG -->
                <div class="card feature-card feature-card--qr" @click="openOverlay('qrUsed')">
                  <h3>QR Code ທີ່ໃຊ້:</h3>
                  <p>
                    ທ່ານສາມາດຊໍາລະໄດ້ໂດຍການສະແກນ LAO QR ທີ່ຮ້ານຄ້າໃນລາວ ຫຼື ສະແກນ QR ຂອງປະເທດຄູ່ຮ່ວມ
                    ທີ່ຮ້ານຄ້າໃນຕ່າງປະເທດ.
                  </p>
                  <div class="flexicon">
                    <div class="feature-icon" style="width: 190px; height: 66px">
                      <span>
                        <img
                          style="border-radius: 5px; width: 100%; height: 100%"
                          src="/product/product6/qr.png"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                </div>

                <!-- BLOCK 2 : FOREIGN CURRENCY BG -->
                <div class="card feature-card feature-card--fx" @click="openOverlay('currency')">
                  <h3>ສະກຸນເງິນ:</h3>
                  <p>
                    ນັກທ່ອງທ່ຽວຈະຖືກຫັກເງິນໃນບັນຊີຂອງປະເທດຕົນເອງ, ສ່ວນຮ້ານຄ້າໃນລາວຈະໄດ້ຮັບເປັນເງິນ ກີບລາວ (LAK)
                    ໂດຍອັດຕະໂນມັດ.
                  </p>
                  <div class="chip-row">
                    <div class="chip">
                      KHR
                      <img src="https://flagcdn.com/kh.svg" style="width: 20px; margin-left: 3px" alt="" />
                    </div>
                    <div class="chip">
                      THB
                      <img src="https://flagcdn.com/th.svg" style="width: 20px; margin-left: 3px" alt="" />
                    </div>
                    <div class="chip">
                      VND
                      <img src="https://flagcdn.com/vn.svg" style="width: 20px; margin-left: 3px" alt="" />
                    </div>
                    <div class="chip">
                      CNY
                      <img src="https://flagcdn.com/cn.svg" style="width: 20px; margin-left: 3px" alt="" />
                    </div>
                  </div>
                </div>

                <!-- BLOCK 3 : EXCHANGE / ARROW BG -->
                <div class="card feature-card feature-card--exchange" @click="openOverlay('exchange')">
                  <h3>ອັດຕາແລກປ່ຽນ:</h3>
                  <p>ແມ່ນອີງຕາມອັດຕະແລກປ່ຽນທີ່ຖືກກໍານົດໃນລະບົບໃນເວລາເຮັດທຸລະກໍາ.</p>
                  <div class="chat-bubbles">
                    <div class="bubble bubble-secondary">LAK ⇄ KHR</div>
                    <div class="bubble bubble-secondary">LAK ⇄ THB</div>
                    <div class="bubble bubble-secondary">LAK ⇄ VND</div>
                    <div class="bubble bubble-secondary">LAK ⇄ CNY</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAGE 2 -->
            <div class="slider-page">
              <div class="features">
                <div class="card feature-card feature-card--qr" @click="openOverlay('khScanLaos')">
                  <h3>ວິທີການຊຳລະ ກຳປູເຈຍ🇰🇭 ສະແກນ ລາວ🇱🇦</h3>
                  <p>
                    ນັກທ່ອງທ່ຽວກຳປູເຈຍໃຊ້ Bakong Mobile App ຫຼື ACLEDA Mobile App ສະແກນ LAO QR
                    ທີ່ຮ້ານຄ້າໃນລາວ.
                  </p>
                  <div class="flexicon">
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/khqrall.png" alt="" />
                      </span>
                    </div>
                    <span><i class="fa-solid fa-right-long" style="font-size: 2rem; margin-top: 20px; margin-right: 20px"></i></span>
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                      </span>
                    </div>
                  </div>
                </div>

                <div class="card feature-card feature-card--fx" @click="openOverlay('laosScanKh')">
                  <h3>ວິທີການຊຳລະ ລາວ🇱🇦 ສະແກນ ກຳປູເຈຍ🇰🇭</h3>
                  <p>
                    ນັກທ່ອງທ່ຽວລາວໃຊ້ Mobile Banking App ຂອງທະນາຄານລາວທີ່ເຂົ້າຮ່ວມ ສະແກນ QR ຂອງ
                    Bakong ຫຼື ACLEDA QR ຢູ່ກຳປູເຈຍ.
                  </p>
                  <div class="flexicon">
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                      </span>
                    </div>
                    <span><i class="fa-solid fa-right-long" style="font-size: 2rem; margin-top: 20px; margin-right: 20px"></i></span>
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/khqrall.png" alt="" />
                      </span>
                    </div>
                  </div>
                </div>

                <div class="card feature-card feature-card--exchange" @click="openOverlay('thScanLaos')">
                  <h3>ວິທີການຊຳລະ ໄທ🇹🇭 ສະແກນ ລາວ🇱🇦</h3>
                  <p>
                    ນັກທ່ອງທ່ຽວໄທໃຊ້ Mobile Banking App ຂອງທະນາຄານໄທທີ່ເຂົ້າຮ່ວມ ສະແກນ LAO QR
                    ທີ່ຮ້ານຄ້າໃນລາວ.
                  </p>
                  <div class="flexicon">
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/TH.png" alt="" />
                      </span>
                    </div>
                    <span><i class="fa-solid fa-right-long" style="font-size: 2rem; margin-top: 20px; margin-right: 20px"></i></span>
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAGE 3 -->
            <div class="slider-page">
              <div class="features">
                <div class="card feature-card feature-card--qr" @click="openOverlay('laosScanTh')">
                  <h3>ວິທີການຊຳລະ ລາວ🇱🇦 ສະແກນ ໄທ🇹🇭</h3>
                  <p>
                    ນັກທ່ອງທ່ຽວລາວໃຊ້ Mobile Banking App ຂອງທະນາຄານລາວທີ່ເຂົ້າຮ່ວມ ສະແກນ Thai QR
                    ຢູ່ຮ້ານຄ້າໃນໄທ.
                  </p>
                  <div class="flexicon">
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                      </span>
                    </div>
                    <span><i class="fa-solid fa-right-long" style="font-size: 2rem; margin-top: 20px; margin-right: 20px"></i></span>
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/TH.png" alt="" />
                      </span>
                    </div>
                  </div>
                </div>

                <div class="card feature-card feature-card--fx" @click="openOverlay('vnScanLaos')">
                  <h3>ວິທີການຊຳລະ ຫວຽດນາມ🇻🇳 ສະແກນ ລາວ🇱🇦</h3>
                  <p>
                    ນັກທ່ອງທ່ຽວຫວຽດນາມໃຊ້ Mobile Banking App ຂອງທະນາຄານຫວຽດນາມທີ່ເຂົ້າຮ່ວມ ສະແກນ LAO QR ທີ່ຮ້ານຄ້າໃນລາວ.
                  </p>
                  <div class="flexicon">
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/napas.png" alt="" />
                      </span>
                    </div>
                    <span><i class="fa-solid fa-right-long" style="font-size: 2rem; margin-top: 20px; margin-right: 20px"></i></span>
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                      </span>
                    </div>
                  </div>
                </div>

                <div class="card feature-card feature-card--exchange" @click="openOverlay('cnScanLaos')">
                  <h3>ວິທີການຊຳລະ ຈີນ🇨🇳 ສະແກນ ລາວ🇱🇦</h3>
                  <p>
                    ນັກທ່ອງທ່ຽວໃຊ້ Mobile App ຂອງເຄືອຂ່າຍທີ່ເຊື່ອມຕໍ່ກັບ UnionPay ຫຼື ຜູ້ໃຫ້ບໍລິການທີ່ກ່າວມາຂ້າງເທິງ
                    ສະແກນ LAO QR ທີ່ຮ້ານຄ້າໃນລາວ.
                  </p>
                  <div class="flexicon">
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/upi.png" alt="" />
                      </span>
                    </div>
                    <span><i class="fa-solid fa-right-long" style="font-size: 2rem; margin-top: 20px; margin-right: 20px"></i></span>
                    <div class="feature-icon" style="width: 100px; height: 100px">
                      <span>
                        <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- /PAGE 3 -->
          </div>
        </div>

        <!-- ✅ Pagination (เลขหน้า) ใต้การ์ด -->
        <div class="pager" aria-label="Slider pages">
          <button
            v-for="i in totalPages"
            :key="i"
            type="button"
            class="pager-btn"
            :class="{ 'is-active': currentPage === i - 1 }"
            @click="goToPage(i - 1)"
            :aria-label="`Go to page ${i}`"
          >
            {{ i }}
          </button>


        </div>

        <button class="nav-arrow nav-arrow--right" @click="handleNext">›</button>
      </div>
    </div>

    <!-- OVERLAY POPUP -->
    <div v-if="overlayVisible" class="overlay" @click.self="closeOverlay">
      <!-- ✅ ใส่ swipe ให้ overlay -->
      <div
        class="overlay-card"
        ref="overlayCard"
        @pointerdown="onOverlayPointerDown"
        @pointermove="onOverlayPointerMove"
        @pointerup="onOverlayPointerUp"
        @pointercancel="onOverlayPointerUp"
      >
        <button class="overlay-close" @click="closeOverlay">×</button>

        <!-- stable wrapper for GSAP animation -->
        <div class="overlay-content" ref="overlayContent">
          <div v-if="activeCardId === 'qrUsed'" class="overlay-body">
            <h2 class="overlay-title">QR Code ທີ່ໃຊ້:</h2>
            <p class="overlay-text">
              ທ່ານສາມາດຊໍາລະໄດ້ໂດຍການສະແກນ LAO QR ທີ່ຮ້ານຄ້າໃນລາວ ຫຼື
              ສະແກນ QR ຂອງປະເທດຄູ່ຮ່ວມ ທີ່ຮ້ານຄ້າໃນຕ່າງປະເທດ.
            </p>
            <div class="overlay-icon-row">
              <img class="overlay-main-img" src="/product/product6/qr.png" alt="" />
            </div>
          </div>

          <div v-else-if="activeCardId === 'currency'" class="overlay-body">
            <h2 class="overlay-title">ສະກຸນເງິນທີ່ໃຊ້</h2>
            <p class="overlay-text">
              ນັກທ່ອງທ່ຽວຈະຖືກຫັກເງິນໃນບັນຊີຂອງປະເທດຕົນເອງ, ສ່ວນຮ້ານຄ້າໃນລາວຈະໄດ້ຮັບເປັນເງິນ ກີບລາວ (LAK)
              ໂດຍອັດຕະໂນມັດ.
            </p>
            <div class="chip-row overlay-chip-row">
              <div class="chip" id="chip">
                KHR
                <img src="https://flagcdn.com/kh.svg"  alt="" />
              </div>
              <div class="chip" id="chip">
                THB
                <img src="https://flagcdn.com/th.svg"  alt="" />
              </div>
              <div class="chip" id="chip">
                VND
                <img src="https://flagcdn.com/vn.svg"  alt="" />
              </div>
              <div class="chip" id="chip">
                CNY
                <img src="https://flagcdn.com/cn.svg"  alt="" />
              </div>
            </div>
          </div>

          <div v-else-if="activeCardId === 'exchange'" class="overlay-body">
            <h2 class="overlay-title">ອັດຕາແລກປ່ຽນ</h2>
            <p class="overlay-text">ອັດຕາແລກປ່ຽນແມ່ນອີງຕາມອັດຕາທີ່ຖືກກໍານົດໃນລະບົບໃນເວລາເຮັດທຸລະກໍາ.</p>
            <div class="chat-bubbles overlay-bubbles">
              <div class="bubble bubble-secondary">LAK ⇄ KHR</div>
              <div class="bubble bubble-secondary">LAK ⇄ THB</div>
              <div class="bubble bubble-secondary">LAK ⇄ VND</div>
              <div class="bubble bubble-secondary">LAK ⇄ CNY</div>
            </div>
          </div>

          <!-- PAGE 2 OVERLAY -->
          <div v-else-if="activeCardId === 'khScanLaos'" class="overlay-body">
            <h2 class="overlay-title">ວິທີການຊຳລະ ກຳປູເຈຍ🇰🇭 ສະແກນ ລາວ🇱🇦</h2>
            <p class="overlay-text">
              ນັກທ່ອງທ່ຽວກຳປູເຈຍໃຊ້ Bakong Mobile App ຫຼື ACLEDA Mobile App ສະແກນ LAO QR ທີ່ຮ້ານຄ້າໃນລາວ.
            </p>
            <div class="overlay-flexicon">
              <div class="flexicon">
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/khqrall.png" alt="" />
                  </span>
                </div>
                <span><i class="fa-solid fa-right-long" style="font-size: 3rem; margin-top: 20px; margin-right: 20px"></i></span>
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeCardId === 'laosScanKh'" class="overlay-body">
            <h2 class="overlay-title">ວິທີການຊຳລະ ລາວ🇱🇦 ສະແກນ ກຳປູເຈຍ🇰🇭</h2>
            <p class="overlay-text">
              ນັກທ່ອງທ່ຽວລາວໃຊ້ Mobile Banking App ຂອງທະນາຄານລາວທີ່ເຂົ້າຮ່ວມ ສະແກນ QR ຂອງ Bakong ຫຼື ACLEDA QR ຢູ່ກຳປູເຈຍ.
            </p>
            <div class="overlay-flexicon">
              <div class="flexicon">
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                  </span>
                </div>
                <span><i class="fa-solid fa-right-long" style="font-size: 3rem; margin-top: 20px; margin-right: 20px"></i></span>
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/khqrall.png" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeCardId === 'thScanLaos'" class="overlay-body">
            <h2 class="overlay-title">ວິທີການຊຳລະ ໄທ🇹🇭 ສະແກນ ລາວ🇱🇦</h2>
            <p class="overlay-text">
              ນັກທ່ອງທ່ຽວໄທໃຊ້ Mobile Banking App ຂອງທະນາຄານໄທທີ່ເຂົ້າຮ່ວມ ສະແກນ LAO QR ທີ່ຮ້ານຄ້າໃນລາວ.
            </p>
            <div class="overlay-icon-row">
              <div class="flexicon">
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/TH.png" alt="" />
                  </span>
                </div>
                <span><i class="fa-solid fa-right-long" style="font-size: 3rem; margin-top: 20px; margin-right: 20px"></i></span>
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- PAGE 3 OVERLAY -->
          <div v-else-if="activeCardId === 'laosScanTh'" class="overlay-body">
            <h2 class="overlay-title">ວິທີການຊຳລະ ລາວ🇱🇦 ສະແກນ ໄທ🇹🇭</h2>
            <p class="overlay-text">
              ນັກທ່ອງທ່ຽວລາວໃຊ້ Mobile Banking App ຂອງທະນາຄານລາວທີ່ເຂົ້າຮ່ວມ ສະແກນ Thai QR ຢູ່ຮ້ານຄ້າໃນໄທ.
            </p>
            <div class="overlay-icon-row">
              <div class="flexicon">
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                  </span>
                </div>
                <span><i class="fa-solid fa-right-long" style="font-size: 3rem; margin-top: 20px; margin-right: 20px"></i></span>
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/TH.png" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeCardId === 'vnScanLaos'" class="overlay-body">
            <h2 class="overlay-title">ວິທີການຊຳລະ ຫວຽດນາມ🇻🇳 ສະແກນ ລາວ🇱🇦</h2>
            <p class="overlay-text">
              ນັກທ່ອງທ່ຽວຫວຽດນາມໃຊ້ Mobile Banking App ຂອງທະນາຄານຫວຽດນາມທີ່ເຂົ້າຮ່ວມ ສະແກນ LAO QR ທີ່ຮ້ານຄ້າໃນລາວ.
            </p>
            <div class="overlay-icon-row">
              <div class="flexicon">
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/napas.png" alt="" />
                  </span>
                </div>
                <span><i class="fa-solid fa-right-long" style="font-size: 3rem; margin-top: 20px; margin-right: 20px"></i></span>
                <div class="feature-icon" style="width: 150px; height: auto">
                  <span>
                    <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeCardId === 'cnScanLaos'" class="overlay-body">
            <h2 class="overlay-title">ວິທີການຊຳລະ ຈີນ🇨🇳 ສະແກນ ລາວ🇱🇦</h2>
            <p class="overlay-text">
              ນັກທ່ອງທ່ຽວໃຊ້ Mobile App ຂອງເຄືອຂ່າຍທີເຊື່ອມຕໍ່ກັບ UnionPay ຫຼື ຜູ້ໃຫ້ບໍລິການທີ່ກ່າວມາຂ້າງເທິງ
              ສະແກນ LAO QR ທີ່ຮ້ານຄ້າໃນລາວ.
            </p>
            <div class="flexicon">
              <div class="feature-icon" style="width: 150px; height: auto">
                <span>
                  <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/upi.png" alt="" />
                </span>
              </div>
              <span><i class="fa-solid fa-right-long" style="font-size: 3rem; margin-top: 20px; margin-right: 20px"></i></span>
              <div class="feature-icon" style="width: 150px; height: auto">
                <span>
                  <img style="border-radius: 5px; width: 100%; height: 100%" src="/product/product6/Lqr1.png" alt="" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /overlay-content -->

        <!-- ✅ Overlay Pagination + Prev/Next อยู่ด้านล่าง -->
        <div class="overlay-nav-row" aria-label="Overlay navigation">
          <button class="overlay-nav" :disabled="overlayAnimating" @click.stop="overlayPrev" aria-label="Previous" title="Previous">
            ‹
          </button>

          <div class="overlay-pager" aria-label="Overlay pagination">
            <div class="overlay-page-text">{{ overlayIndex + 1 }} / {{ overlayTotal }}</div>

            <div class="overlay-dots" aria-label="Overlay pages">
              <button
                v-for="(id, i) in overlayOrder"
                :key="id"
                type="button"
                class="overlay-dot"
                :class="{ 'is-active': overlayIndex === i }"
                @click.stop="overlayGo(i)"
                :aria-label="`Go to overlay page ${i + 1}`"
              />
            </div>
          </div>

          <button class="overlay-nav" :disabled="overlayAnimating" @click.stop="overlayNext" aria-label="Next" title="Next">
            ›
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue"
import { gsap } from "gsap"

const section = ref(null)
const overlayCard = ref(null)
const overlayContent = ref(null)

const currentPage = ref(0)
const totalPages = 3

// overlay state
const overlayVisible = ref(false)
const activeCardId = ref("")
const overlayAnimating = ref(false)

let autoTimer = null
let gsapCtx = null

// slider logic
const nextPage = () => {
  currentPage.value = (currentPage.value + 1) % totalPages
}
const prevPage = () => {
  currentPage.value = (currentPage.value - 1 + totalPages) % totalPages
}

const stopAuto = () => {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

const startAuto = () => {
  stopAuto()
  autoTimer = setInterval(() => {
    nextPage()
  }, 8000)
}

const handleNext = () => {
  nextPage()
  startAuto()
}

const handlePrev = () => {
  prevPage()
  startAuto()
}

// ✅ กดเลขเพื่อไปหน้าที่ต้องการ
const goToPage = (idx) => {
  currentPage.value = idx
  startAuto()
}

// ===== Overlay navigation order (ปรับลำดับได้) =====
const overlayOrder = [
  "qrUsed",
  "currency",
  "exchange",
  "khScanLaos",
  "laosScanKh",
  "thScanLaos",
  "laosScanTh",
  "vnScanLaos",
  "cnScanLaos"
]

// ✅ Overlay pagination state
const overlayTotal = computed(() => overlayOrder.length)
const overlayIndex = computed(() => {
  const i = overlayOrder.indexOf(activeCardId.value)
  return i === -1 ? 0 : i
})

// ===== overlay handlers =====
const openOverlay = (id) => {
  activeCardId.value = id
  overlayVisible.value = true
  stopAuto()

  nextTick(() => {
    if (overlayContent.value) {
      gsap.set(overlayContent.value, { opacity: 1, x: 0, y: 0, scale: 1 })
    }

    if (overlayCard.value) {
      gsap.fromTo(
        overlayCard.value,
        { opacity: 0, y: 30, scale: 0.93 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
      )
    }
  })
}

const closeOverlay = () => {
  overlayVisible.value = false
  activeCardId.value = ""
  overlayAnimating.value = false
  startAuto()
}

// ✅ เปลี่ยนหน้า overlay ไป index ที่เลือก (ใช้ animation เดียวกับ next/prev)
const changeOverlayToIndex = (targetIdx) => {
  if (!overlayVisible.value || overlayAnimating.value) return
  const el = overlayContent.value || overlayCard.value
  if (!el) return

  const currentIdx = overlayIndex.value
  if (targetIdx === currentIdx) return

  const dir = targetIdx > currentIdx ? 1 : -1
  const OUT_X = dir === 1 ? -28 : 28
  const IN_X = dir === 1 ? 28 : -28

  overlayAnimating.value = true
  gsap.killTweensOf(el)

  gsap.to(el, {
    opacity: 0,
    x: OUT_X,
    scale: 0.99,
    duration: 0.18,
    ease: "power2.in",
    onComplete: () => {
      activeCardId.value = overlayOrder[targetIdx]

      nextTick(() => {
        const el2 = overlayContent.value || overlayCard.value
        if (!el2) {
          overlayAnimating.value = false
          return
        }

        gsap.killTweensOf(el2)
        gsap.fromTo(
          el2,
          { opacity: 0, x: IN_X, scale: 0.99 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.32,
            ease: "power3.out",
            onComplete: () => (overlayAnimating.value = false)
          }
        )
      })
    }
  })
}

const navigateOverlay = (dir) => {
  const idx = overlayIndex.value
  const nextIdx = (idx + dir + overlayOrder.length) % overlayOrder.length
  changeOverlayToIndex(nextIdx)
}

const overlayNext = () => navigateOverlay(1)
const overlayPrev = () => navigateOverlay(-1)
const overlayGo = (i) => changeOverlayToIndex(i)

// ✅ SWIPE / DRAG สำหรับ slider
const isDragging = ref(false)
const dragOffset = ref(0)

const dragState = {
  active: false,
  engaged: false,
  startX: 0,
  startY: 0,
  pointerId: null
}

const swipeThreshold = () => Math.min(90, Math.round(window.innerWidth * 0.18))

const onSliderPointerDown = (e) => {
  if (overlayVisible.value) return
  if (e.pointerType === "mouse") return

  dragState.active = true
  dragState.engaged = false
  dragState.pointerId = e.pointerId
  dragState.startX = e.clientX
  dragState.startY = e.clientY

  isDragging.value = false
  dragOffset.value = 0
  stopAuto()
}

const onSliderPointerMove = (e) => {
  if (!dragState.active || e.pointerId !== dragState.pointerId) return

  const dx = e.clientX - dragState.startX
  const dy = e.clientY - dragState.startY

  if (!dragState.engaged) {
    if (Math.abs(dy) > Math.abs(dx) * 1.2 && Math.abs(dy) > 10) {
      dragState.active = false
      dragState.pointerId = null
      startAuto()
      return
    }
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      dragState.engaged = true
      isDragging.value = true
    } else return
  }

  dragOffset.value = dx
}

const onSliderPointerUp = (e) => {
  if (!dragState.active || e.pointerId !== dragState.pointerId) return

  const dx = e.clientX - dragState.startX
  const threshold = swipeThreshold()
  const engaged = dragState.engaged

  dragState.active = false
  dragState.engaged = false
  dragState.pointerId = null
  isDragging.value = false

  if (engaged) {
    if (dx <= -threshold) nextPage()
    else if (dx >= threshold) prevPage()
  }

  requestAnimationFrame(() => (dragOffset.value = 0))
  startAuto()
}

// ✅ SWIPE / DRAG สำหรับ overlay (ปาดซ้าย=next ปาดขวา=prev)
const overlaySwipe = {
  active: false,
  engaged: false,
  startX: 0,
  startY: 0,
  pointerId: null
}

const overlaySwipeThreshold = () => Math.min(75, Math.round(window.innerWidth * 0.16))

const onOverlayPointerDown = (e) => {
  if (!overlayVisible.value) return
  if (e.pointerType === "mouse") return

  overlaySwipe.active = true
  overlaySwipe.engaged = false
  overlaySwipe.pointerId = e.pointerId
  overlaySwipe.startX = e.clientX
  overlaySwipe.startY = e.clientY
}

const onOverlayPointerMove = (e) => {
  if (!overlaySwipe.active || e.pointerId !== overlaySwipe.pointerId) return

  const dx = e.clientX - overlaySwipe.startX
  const dy = e.clientY - overlaySwipe.startY

  if (!overlaySwipe.engaged) {
    if (Math.abs(dy) > Math.abs(dx) * 1.2 && Math.abs(dy) > 10) {
      overlaySwipe.active = false
      overlaySwipe.pointerId = null
      return
    }
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      overlaySwipe.engaged = true
    }
  }
}

const onOverlayPointerUp = (e) => {
  if (!overlaySwipe.active || e.pointerId !== overlaySwipe.pointerId) return

  const dx = e.clientX - overlaySwipe.startX
  const threshold = overlaySwipeThreshold()
  const engaged = overlaySwipe.engaged

  overlaySwipe.active = false
  overlaySwipe.engaged = false
  overlaySwipe.pointerId = null

  if (!engaged) return
  if (overlayAnimating.value) return

  if (dx <= -threshold) overlayNext()
  else if (dx >= threshold) overlayPrev()
}

const onKeyDown = (e) => {
  if (!overlayVisible.value) return
  if (e.key === "Escape") closeOverlay()
  if (e.key === "ArrowRight") overlayNext()
  if (e.key === "ArrowLeft") overlayPrev()
}

onMounted(() => {
  gsapCtx = gsap.context(() => {
    gsap.from(section.value, { opacity: 0, y: 40, duration: 1.1, ease: "power3.out" })

    const cards = gsap.utils.toArray(".card")
    gsap.from(cards, {
      opacity: 0,
      y: 35,
      scale: 0.96,
      duration: 0.9,
      stagger: 0.07,
      delay: 0.25,
      ease: "power3.out"
    })

    cards.forEach((card) => {
      const tl = gsap.timeline({ paused: true })
      tl.to(card, {
        y: -6,
        scale: 1.02,
        boxShadow: "0 26px 60px rgba(15,23,42,0.95)",
        duration: 0.22,
        ease: "power2.out"
      })
      card.addEventListener("mouseenter", () => tl.play())
      card.addEventListener("mouseleave", () => tl.reverse())
    })

    watch(
      currentPage,
      () => {
        const pageCards = document.querySelectorAll(`.slider-page:nth-child(${currentPage.value + 1}) .card`)
        gsap.from(pageCards, {
          opacity: 0,
          y: 30,
          scale: 0.96,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out"
        })
      },
      { flush: "post" }
    )
  }, section)

  window.addEventListener("keydown", onKeyDown)
  startAuto()
})

onBeforeUnmount(() => {
  stopAuto()
  window.removeEventListener("keydown", onKeyDown)
  if (gsapCtx) gsapCtx.revert()
})
</script>

<style scoped>
/* (ของเดิมทั้งหมดเหมือนเดิม) */
#chip img{
  width: 22px;
  margin-left: 4px;
  object-fit: contain;
}

.logocontainer img {
  width: 75px;
  height: 50px;
}
.logocontainer i {
  font-size: 23px;
}
.logocontainer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 60%;
  margin: 0 auto;
  height: auto;
}
.upitolaoqr {
  width: 100%;
  display: flex;
  align-items: center;
  height: 150px;
}
.flexicon {
  width: 100%;
  height: 160px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logolapnet {
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.logolapnet img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.landing-tech {
  width: 100%;
  height: 960px;
  overflow: hidden;
  background: radial-gradient(circle at top, #1871ff 0, #001261 55%, #000 100%);
  color: #e5edff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans Lao", sans-serif;
}

.glow {
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.75;
  pointer-events: none;
}
.glow-top {
  background: rgba(0, 62, 220, 0.9);
  top: -160px;
  left: 6%;
}
.glow-bottom {
  background: rgba(0, 81, 255, 0.85);
  bottom: -220px;
  right: 0;
}

.landing-inner {
  position: relative;
  width: 100%;
  max-width: 1180px;
  padding: 32px 32px 40px;
  z-index: 1;
}

.landing-header {
  text-align: center;
  margin-bottom: 22px;
}
.kicker {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 6px;
}
.landing-header h1 {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.slider {
  position: relative;
  margin-top: 8px;
}

.slider-window {
  overflow: hidden;
  touch-action: pan-y;
}
.slider-track {
  display: flex;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.slider-track.is-dragging {
  transition: none !important;
}
.slider-page {
  min-width: 100%;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.9);
  color: #e5edff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  z-index: 2;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
.nav-arrow--left {
  left: -10px;
}
.nav-arrow--right {
  right: -10px;
}
.nav-arrow:hover {
  background: rgba(37, 99, 235, 0.95);
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.8);
  transform: translateY(-50%) translateY(-1px);
}

/* ✅ Slider pagination */
.pager {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}
.pager-btn {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.85);
  color: #e5edff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}
.pager-btn:hover {
  background: rgba(37, 99, 235, 0.95);
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.65);
  transform: translateY(-1px);
}
.pager-btn.is-active {
  background: rgba(37, 99, 235, 0.95);
  border-color: rgba(59, 130, 246, 0.95);
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.8);
}
.pager-text {
  font-size: 13px;
  color: rgba(229, 237, 255, 0.85);
  padding-left: 6px;
}

/* BASE CARD */
.card {
  height: 360px;
  border-radius: 20px;
  padding: 20px 20px 22px;
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.35), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(148, 163, 184, 0.55);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(18px);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  will-change: transform, box-shadow;
}

.feature-card--qr::before,
.feature-card--fx::before,
.feature-card--exchange::before {
  content: "";
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  mix-blend-mode: screen;
  pointer-events: none;
}
.feature-card--qr::before {
  background-image: url("../../assets/landing/qr-bg.png");
  opacity: 0.18;
}
.feature-card--fx::before {
  background-image: url("../../assets/landing/currency-bg.png");
  opacity: 0.22;
}
.feature-card--exchange::before {
  background-image: url("../../assets/landing/exchange-bg.png");
  opacity: 0.2;
}

.feature-card h3 {
  font-size: 19px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}
.feature-card p {
  font-size: 14px;
  color: #cbd5f5;
  max-width: 280px;
  position: relative;
  z-index: 1;
}

.feature-icon {
  margin-top: 26px;
  width: 75px;
  height: 75px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #020617;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 0 25px #3b82f6e6;
  position: relative;
  z-index: 1;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.92);
}

.chip-row {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}
.chip {
  display: flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.7);
}

.chat-bubbles {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.bubble {
  font-size: 10px;
  padding: 7px 11px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(79, 70, 229, 0.6);
}
.bubble-secondary {
  background: rgba(56, 189, 248, 0.12);
  border-color: rgba(56, 189, 248, 0.7);
}

/* ===== OVERLAY ===== */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}
.overlay-card {
  width: min(820px, 94vw);
  max-height: 82vh;
  overflow-y: auto;
  border-radius: 24px;
  padding: 28px 28px 104px; /* เผื่อพื้นที่ให้ nav + pagination */
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.55), rgba(15, 23, 42, 0.98));
  border: 1px solid rgba(148, 163, 184, 0.7);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
  color: #e5edff;
  position: relative;
  touch-action: pan-y;
}

.overlay-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.95);
  color: #e5edff;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ overlay bottom nav + pagination */
.overlay-nav-row {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 6;
}
.overlay-nav {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.75);
  background: rgba(15, 23, 42, 0.92);
  color: #e5edff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}
.overlay-nav:hover {
  background: rgba(37, 99, 235, 0.95);
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.75);
  transform: translateY(-1px);
}
.overlay-nav:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.overlay-pager {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 140px;
}
.overlay-page-text {
  font-size: 13px;
  color: rgba(229, 237, 255, 0.85);
}
.overlay-dots {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  justify-content: center;
}
.overlay-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.75);
  background: rgba(15, 23, 42, 0.55);
  cursor: pointer;
}
.overlay-dot.is-active {
  background: rgba(37, 99, 235, 0.95);
  border-color: rgba(59, 130, 246, 0.95);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.7);
}

.overlay-body {
  padding-top: 10px;
}
.overlay-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}
.overlay-text {
  font-size: 15px;
  line-height: 1.7;
  color: #e5edff;
  margin-bottom: 12px;
}
.overlay-icon-row {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.overlay-main-img {
  width: 250px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 0 25px #3b82f6e6;
}
.overlay-chip-row .chip {
  font-size: 13px;
  padding: 8px 12px;
}
.overlay-bubbles .bubble {
  font-size: 11px;
  padding: 7px 12px;
}
.overlay-flexicon {
  margin-top: 16px;
  display: flex;
  gap: 18px;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .features {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .card {
    height: 340px;
  }
}

@media (max-width: 768px) {
  .landing-inner {
    padding: 24px 18px;
  }
  .landing-header h1 {
    font-size: 26px;
  }
  .features {
    grid-template-columns: 1fr;
  }
  .landing-tech {
    height: auto;
    padding: 32px 0 40px;
  }

  .slider {
    padding-bottom: 88px;
  }
  .nav-arrow {
    top: auto;
    bottom: 10px;
    transform: none;
  }
  .nav-arrow--left {
    left: calc(50% - 54px);
  }
  .nav-arrow--right {
    left: calc(50% + 16px);
    right: auto;
  }
  .nav-arrow:hover {
    transform: none;
  }

  .overlay-pager {
    min-width: 120px;
  }
  .overlay-dot {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .overlay-nav-row {
    bottom: 10px;
    gap: 10px;
  }
  .overlay-card {
    padding-bottom: 110px;
  }
}
</style>
