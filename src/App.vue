<template>
  <v-app>
    <!-- 앱바 -->
    <AppBar @openLogin="openLoginModal" />

    <!-- 메인 컨텐츠 -->
    <v-main>
      <!-- 로그인 모달 -->
      <v-dialog v-model="isLoginModalOpen" persistent max-width="400" overlay-opacity="0.8">
        <AppLogin @close="closeLoginModal" @switch-to-signup="switchToSignup" />
      </v-dialog>

      <!-- 회원가입 모달 -->
      <v-dialog v-model="isSignupModalOpen" persistent max-width="400" overlay-opacity="0.8">
        <AppSignup @close="closeSignupModal" @switch-to-login="switchToLogin" />
      </v-dialog>

      <!-- 홈페이지 컨텐츠 -->
      <HomePage v-if="$route.path === '/'" />
      <router-view v-else></router-view>

      <!-- 스낵바 -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top right">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar.show = false"> 닫기 </v-btn>
        </template>
      </v-snackbar>
    </v-main>

    <!-- 푸터 -->
    <AppFooter />
  </v-app>
</template>

<script>
import { ref, provide } from 'vue';
import AppBar from './components/AppBar.vue';
import AppLogin from './components/login/AppLogin.vue';
import AppFooter from './components/AppFooter.vue';
import AppSignup from './components/signup/AppSignup.vue';
import HomePage from './views/HomePage.vue'; // HomePage import 추가

export default {
  name: 'App',
  components: {
    AppBar,
    AppLogin,
    AppFooter,
    AppSignup,
    HomePage, // HomePage 컴포넌트 등록
  },

  setup() {
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success',
    });

    const showSnackbar = ({ text, color = 'success' }) => {
      snackbar.value = {
        show: true,
        text,
        color,
      };
    };

    provide('showSnackbar', showSnackbar);

    return {
      snackbar,
      showSnackbar,
    };
  },

  data() {
    return {
      isLoginModalOpen: false,
      isSignupModalOpen: false,
    };
  },

  methods: {
    openLoginModal() {
      this.isLoginModalOpen = true;
      this.isSignupModalOpen = false;
    },

    closeLoginModal() {
      this.isLoginModalOpen = false;
    },

    openSignupModal() {
      this.isSignupModalOpen = true;
      this.isLoginModalOpen = false;
    },

    closeSignupModal() {
      this.isSignupModalOpen = false;
    },

    switchToSignup() {
      this.isLoginModalOpen = false;
      this.isSignupModalOpen = true;
    },

    switchToLogin() {
      this.isSignupModalOpen = false;
      this.isLoginModalOpen = true;
    },
  },

  watch: {
    $route() {
      this.isLoginModalOpen = false;
      this.isSignupModalOpen = false;
    },
  },
};
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
