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
      class="full-width-carousel"
    >
      <v-carousel-item v-for="(item, i) in carouselItems" :key="i" cover class="carousel-image">
        <div class="carousel-content">
          <v-img :src="item.image" height="500" width="100%" cover class="image-fade">
            <template v-slot:default>
              <div class="overlay"></div>
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
            </template>
          </v-img>
        </div>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
export default {
  name: 'PostCarousel',
  data() {
    return {
      carouselItems: [
        {
          title: '제주 올레길 7코스',
          description: '아름다운 제주 올레길을 따라서...',
          image: 'https://picsum.photos/id/11/1920/500',
        },
        {
          title: '지리산 둘레길',
          description: '지리산의 숨겨진 아름다움을 찾아서...',
          image: 'https://picsum.photos/id/12/1920/500',
        },
        {
          title: '북한산 둘레길',
          description: '도심 속 자연을 만나다...',
          image: 'https://picsum.photos/id/13/1920/500',
        },
      ],
    };
  },
};
</script>

<style scoped>
.full-width-carousel {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}

.carousel-content {
  height: 100%;
  width: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

:deep(.v-carousel) {
  width: 100%;
}

:deep(.v-window__container) {
  transition: all 0.8s ease-in-out !important;
}

:deep(.v-window-item) {
  transition: opacity 0.8s ease-in-out !important;
}

:deep(.v-window-item--active) {
  opacity: 1;
  transition: opacity 0.8s ease-in-out !important;
}

:deep(.text-white) {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

:deep(.image-fade) {
  transition: opacity 0.8s ease-in-out;
}

.bg-transparent {
  background: transparent !important;
}
</style>
