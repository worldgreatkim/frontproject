<template>
  <v-app>
    <v-main>
      <!-- 최상단 앱바 -->
      <AppBarVue />
      <!-- 메인 컴포넌트 -->
      <AppCarousel />
      <AppFile />
      <StoreValueListVue />
      <AppTravel />

      <!-- 최하단 푸터 -->
    </v-main>
  </v-app>
</template>

<script>
import AppBarVue from './components/AppBar.vue';
import StoreValueListVue from './components/StoreValueList.vue';

import AppFile from './components/AppFile.vue';
import AppCarousel from './components/AppCarousel.vue';
import AppTravel from './components/AppTravel.vue';

export default {
  name: 'App',

  components: {
    AppBarVue,
    StoreValueListVue,
    AppTravel,
    AppFile,
    AppCarousel,
  },

  data: () => ({
    //
  }),
};
</script>
