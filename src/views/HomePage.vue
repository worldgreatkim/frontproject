<template>
  <v-app>
    <v-container fluid class="homepage pa-0">
      <!-- 히어로 섹션 -->
      <v-container fluid class="hero-section">
        <v-row align="center" justify="space-between" class="mx-auto" style="max-width: 1200px">
          <!-- 텍스트 컨텐츠 -->

          <v-col cols="12" md="6" class="text-content">
            <h1 class="text-h2 font-weight-bold mb-4">새로운 여행 플래너</h1>
            <p class="text-subtitle-1 mb-6 grey--text text--darken-1">전국의 다양한 둘레길을 둘러보세요</p>
            <v-btn size="x-large" color="primary" elevation="2" class="get-started-btn" @click="getStarted">
              <v-icon left>mdi-airplane</v-icon>
              둘레길 여행 시작하기
            </v-btn>
          </v-col>

          <!-- 이미지 섹션 -->
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <v-img
              src="../assets/길벗누리.png"
              alt="Travel Planning"
              max-width="100%"
              class="hero-image rounded-lg"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>

      <!-- 캐러셀 추가 -->
      <PostCarousel />

      <!-- 통계 섹션 -->
      <v-container class="stats-section py-12">
        <v-row justify="center" align="center" class="text-center">
          <v-col cols="12" md="4">
            <div class="text-h3 font-weight-bold primary--text mb-2">212,279</div>
            <div class="text-subtitle-1 grey--text">실시간 둘레길 완주자 수</div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-h3 font-weight-bold primary--text mb-2">96</div>
            <div class="text-subtitle-1 grey--text"></div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-h3 font-weight-bold primary--text mb-2">98%</div>
            <div class="text-subtitle-1 grey--text">사용자 만족도</div>
          </v-col>
        </v-row>
      </v-container>

      <!-- 특징 섹션 -->
      <v-container class="features-section py-12 grey lighten-4">
        <v-row justify="center" class="text-center mb-12">
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold mb-3">특별한 기능</h2>
            <p class="text-subtitle-1 grey--text">AI가 제안하는 최적의 여행 일정을 경험해보세요</p>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(feature, index) in features" :key="index" cols="12" md="4">
            <v-card class="feature-card mx-auto" flat>
              <v-icon size="48" color="primary" class="mb-4">
                {{ feature.icon }}
              </v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
              <p class="grey--text">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-app>
</template>

<script>
import PostCarousel from '@/components/board/PostCarousel.vue';

export default {
  name: 'HomePage',
  components: {
    PostCarousel,
  },
  data() {
    return {
      features: [
        {
          icon: 'mdi-rocket-launch',
          title: 'AI 기반 일정 생성',
          description: '인공지능이 당신의 선호도를 분석하여 최적의 여행 일정을 제안합니다.',
        },
        {
          icon: 'mdi-map-marker',
          title: '스마트 경로 추천',
          description: '효율적인 동선을 고려한 최적의 여행 경로를 제안합니다.',
        },
        {
          icon: 'mdi-account-group',
          title: '실시간 리뷰',
          description: '다른 여행자들의 실제 경험을 바탕으로 한 추천을 받아보세요.',
        },
      ],
    };
  },
  methods: {
    getStarted() {
      this.$router.push('/travel');
    },
  },
};
</script>

<style scoped>
.homepage {
  overflow-x: hidden;
}

.hero-section {
  padding: 64px 16px;
  background-color: #fff;
}

.text-content {
  padding-right: 32px;
}

.get-started-btn {
  padding: 0 32px;
  height: 48px;
  font-size: 1.1rem;
  text-transform: none;
}

.hero-image {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.hero-image:hover {
  transform: translateY(-10px);
}

.stats-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.feature-card {
  padding: 32px;
  text-align: center;
  transition: transform 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
}

@media (max-width: 600px) {
  .text-content {
    padding-right: 0;
    text-align: center;
  }

  .hero-section {
    padding: 32px 16px;
  }
}
</style>
