<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 text-center position-relative">
      로그인
      <v-btn icon="mdi-close" size="small" variant="text" @click="close" class="close-button"></v-btn>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="아이디"
          type="user-id"
          variant="outlined"
          density="compact"
          class="mb-2"
          required
          :disabled="loading"
          :rules="emailRules"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="비밀번호"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-4"
          required
          :disabled="loading"
          :rules="passwordRules"
        ></v-text-field>

        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>

        <v-btn type="submit" block color="primary" :loading="loading" :disabled="loading" class="mb-4"> 로그인 </v-btn>

        <div class="text-center text-body-2">
          <div class="mb-2">
            계정이 없으신가요?
            <v-btn variant="text" color="primary" size="small" @click="goToSignup" :disabled="loading">
              회원가입
            </v-btn>
          </div>
          <v-btn variant="text" color="primary" size="small" @click="goToForgotPassword" :disabled="loading">
            비밀번호 찾기
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, inject } from 'vue';
import { mapActions } from 'vuex';

export default {
  setup() {
    const form = ref(null);
    const showSnackbar = inject('showSnackbar');

    return {
      form,
      showSnackbar,
    };
  },

  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null,
      emailRules: [(v) => !!v || '아이디를 입력해주세요.'],
      passwordRules: [
        (v) => !!v || '비밀번호를 입력해주세요.',
        (v) => v.length >= 6 || '비밀번호는 최소 6자 이상이어야 합니다.',
      ],
    };
  },

  methods: {
    ...mapActions(['login']),

    close() {
      this.$emit('close');
    },

    async handleLogin() {
      if (!this.form?.validate()) return;

      this.loading = true;
      this.error = null;

      try {
        await this.login({
          email: this.email,
          password: this.password,
        });

        this.close();
        this.showSnackbar({
          text: '로그인되었습니다.',
          color: 'success',
        });
      } catch (err) {
        this.error = '아이디 또는 비밀번호가 올바르지 않습니다.';
        this.showSnackbar({
          text: '로그인 중 오류가 발생했습니다.',
          color: 'error',
        });
      } finally {
        this.loading = false;
      }
    },

    goToSignup() {
      this.$emit('switch-to-signup');
    },

    goToForgotPassword() {
      this.$router.push('/forgot-password');
      this.close();
    },
  },
};
</script>
<style scoped>
.close-button {
  position: absolute;
  right: 8px;
  top: 8px;
}

.position-relative {
  position: relative;
}
</style>
