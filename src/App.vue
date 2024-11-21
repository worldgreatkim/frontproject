<template>
  <v-app>
    <!-- 앱바 -->
    <AppBar @openLogin="openLoginModal" />

    <!-- 메인 컨텐츠 -->
    <v-main>
      <!-- 로그인 모달 -->
      <v-dialog v-model="isLoginModalOpen" persistent max-width="400" overlay-opacity="0.8">
        <AppLogin @close="closeLoginModal" />
      </v-dialog>

      <!-- 라우터 뷰 -->
      <router-view></router-view>

      <!-- 스낵바 -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar.show = false"> 닫기 </v-btn>
        </template>
      </v-snackbar>
    </v-main>

    <!-- 푸터 -->
    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref, provide } from 'vue';
import AppBar from './components/AppBar.vue';
import AppLogin from './components/login/AppLogin.vue';
import AppFooter from './components/AppFooter.vue';

// 로그인 모달 상태
const isLoginModalOpen = ref(false);

// 스낵바 상태
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

// 메서드
const openLoginModal = () => {
  isLoginModalOpen.value = true;
};

const closeLoginModal = () => {
  isLoginModalOpen.value = false;
};

// 스낵바 표시 함수
const showSnackbar = ({ text, color = 'success', timeout = 3000 }) => {
  snackbar.value = {
    show: true,
    text,
    color,
    timeout,
  };
};

// provide를 사용하여 하위 컴포넌트에서 스낵바 사용 가능하게 함
provide('showSnackbar', showSnackbar);

// 라우트 변경 시 로그인 모달 닫기
import { useRouter } from 'vue-router';
const router = useRouter();

router.afterEach(() => {
  isLoginModalOpen.value = false;
});
</script>

<style>
/* 전역 스타일이 필요한 경우 여기에 추가 */
</style>
