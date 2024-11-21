<template>
  <v-app-bar app fixed flat color="white" elevation="1">
    <v-container class="d-flex align-center">
      <router-link to="/" class="text-decoration-none">
        <v-toolbar-title class="logo" src>길벗누리</v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <!-- 메인 네비게이션 -->
      <div class="d-none d-md-flex">
        <v-btn text class="mx-2" to="/travel">
          <v-icon left>mdi-airplane</v-icon>
          여행지
        </v-btn>

        <v-btn v-if="!isAuthenticated" text class="mx-2" to="/support">
          <v-icon left>mdi-help-circle</v-icon>
          고객지원
        </v-btn>

        <v-btn v-if="isAuthenticated" text class="mx-2" to="/plan">
          <v-icon left>mdi-calendar</v-icon>
          여행계획하기
        </v-btn>

        <v-btn text class="mx-2" to="/board">
          <v-icon left>mdi-post</v-icon>
          게시판
        </v-btn>
      </div>

      <!-- 비로그인 상태 -->
      <template v-if="!isAuthenticated">
        <v-btn text class="mx-2" @click="$emit('openLogin')">
          <v-icon left>mdi-login</v-icon>
          로그인
        </v-btn>
      </template>

      <!-- 로그인 상태 -->
      <template v-else>
        <v-menu v-model="menu" :close-on-content-click="false" location="bottom end" offset="5">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" size="large">
              <v-avatar color="primary" size="32">
                <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="User"></v-img>
              </v-avatar>
            </v-btn>
          </template>

          <v-list width="200">
            <v-list-item to="/profile" prepend-icon="mdi-account">
              <v-list-item-title>마이페이지</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="handleLogout" prepend-icon="mdi-logout">
              <v-list-item-title>로그아웃</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-container>
  </v-app-bar>
</template>

<script>
import { ref, inject } from 'vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'AppBar',
  setup() {
    const store = useStore();
    const showSnackbar = inject('showSnackbar');
    const menu = ref(false);

    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const currentUser = computed(() => store.getters.currentUser);

    return {
      showSnackbar,
      menu,
      isAuthenticated,
      currentUser,
    };
  },
  methods: {
    async handleLogout() {
      try {
        await this.$store.dispatch('logout');
        this.menu = false;
        this.$router.push('/');
        this.showSnackbar({
          text: '로그아웃되었습니다.',
          color: 'success',
        });
      } catch (error) {
        console.error('Logout failed:', error);
        this.showSnackbar({
          text: '로그아웃 중 오류가 발생했습니다.',
          color: 'error',
        });
      }
    },
  },
};
</script>

<style scoped>
.logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: black;
}

.v-btn {
  text-transform: none;
  letter-spacing: 0;
}

@media (max-width: 960px) {
  .logo {
    font-size: 1.25rem;
  }
}
</style>
