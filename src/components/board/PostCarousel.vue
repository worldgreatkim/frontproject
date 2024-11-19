<template>
  <v-container fluid class="pa-0">
    <v-carousel
      ref="carousel"
      :show-arrows="false"
      hide-delimiter-background
      delimiter-icon="mdi-circle"
      :interval="5000"
      cycle
      hide-delimiters
      height="500"
      :touch="true"
      continuous
      v-model="currentSlide"
      class="full-width-carousel"
      transition="fade"
    >
      <v-carousel-item
        v-for="(item, i) in carouselItems"
        :key="i"
        :src="item.image"
        @click="goToNextSlide"
        style="cursor: pointer"
        cover
      >
        <div class="overlay"></div>
        <!-- 오버레이 추가 -->
        <v-row class="fill-height" align="center" justify="center">
          <v-col cols="12" md="8">
            <v-card class="mx-auto bg-transparent" flat>
              <v-card-title class="text-h4 text-white text-center font-weight-bold">
                {{ item.title }}
              </v-card-title>
              <v-card-text class="text-white text-center text-h6">
                {{ item.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
// script 부분은 동일하게 유지
</script>

<style scoped>
.v-container {
  max-width: none !important;
}

.full-width-carousel {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

.bg-transparent {
  background: transparent !important;
}

.text-white {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* overlay 스타일 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* 캐러셀 아이템 스타일 */
:deep(.v-carousel-item) {
  width: 100%;
}

:deep(.v-carousel-item img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* fade 트랜지션 효과 */
:deep(.v-carousel .v-window-item) {
  transition: opacity 1s ease-in-out !important;
}

:deep(.v-window__prev),
:deep(.v-window__next) {
  transform: none !important;
}

:deep(.v-window-item--active) {
  opacity: 1;
  z-index: 1;
}

:deep(.v-window-item:not(.v-window-item--active)) {
  opacity: 0;
  z-index: 0;
}

/* fade 애니메이션 */
:deep(.fade-enter-active),
:deep(.fade-leave-active) {
  transition: opacity 1s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

:deep(.fade-enter-from),
:deep(.fade-leave-to) {
  opacity: 0;
}

:deep(.fade-enter-to),
:deep(.fade-leave-from) {
  opacity: 1;
}

/* 캐러셀 컨테이너 스타일 */
:deep(.v-carousel .v-window__container) {
  position: relative;
}
</style>
