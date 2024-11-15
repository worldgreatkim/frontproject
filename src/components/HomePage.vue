<template>
  <v-app>
    <v-container fluid class="homepage">
      <!-- 네비게이션 바 -->
      <v-app-bar flat color="white">
        <v-toolbar-title class="logo">MYRO</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text class="mx-4">여행지</v-btn>
        <v-btn text class="mx-4">고객지원</v-btn>
        <v-btn text class="mx-4">이용방법</v-btn>
        <v-btn icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- 메인 컨텐츠 -->
      <v-row align="center" justify="space-between" class="mt-12">
        <!-- 텍스트 컨텐츠 -->
        <v-col cols="12" md="6">
          <h1 class="display-2 font-weight-bold">기존에 경험하지 못한 새로운 여행 플래너</h1>
          <p class="subtitle-1 mt-4">고민만 하던 여행 계획을 마이로를 통해 몇 분 만에 스케줄링 해보세요.</p>
          <v-btn color="black" class="mt-4" dark> 마이로 시작하기 </v-btn>
        </v-col>

        <!-- 이미지 섹션 -->
        <v-col cols="12" md="6">
          <v-img src="@/assets/sample-map.png" alt="Map Preview" max-width="100%" class="shadow-lg"></v-img>
        </v-col>
      </v-row>

      <!-- 푸터 -->
      <v-footer color="white" padless>
        <v-col class="text-center grey--text text--darken-1">
          AI로 생성된 일정 수 <span class="font-weight-bold">212,279</span> 여행지 수
          <span class="font-weight-bold">96</span>
        </v-col>
      </v-footer>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.homepage {
  padding-top: 20px;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
}

.display-2 {
  font-size: 2.5rem;
}

.subtitle-1 {
  color: #666;
}

.shadow-lg {
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
}
</style>
