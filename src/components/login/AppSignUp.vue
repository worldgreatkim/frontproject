<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 text-center position-relative">
      회원가입
      <v-btn icon="mdi-close" size="small" variant="text" @click="close" class="close-button"></v-btn>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" @submit.prevent="handleSignup">
        <v-text-field
          v-model="formData.loginId"
          label="아이디"
          variant="outlined"
          density="compact"
          class="mb-2"
          required
          :disabled="loading"
          :rules="[
            (v) => !!v || '아이디를 입력해주세요.',
            (v) => v.length >= 4 || '아이디는 최소 4자 이상이어야 합니다.',
            (v) => /^[a-zA-Z0-9]+$/.test(v) || '영문과 숫자만 사용 가능합니다.',
          ]"
        ></v-text-field>

        <v-text-field
          v-model="formData.password"
          label="비밀번호"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-2"
          required
          :disabled="loading"
          :rules="[
            (v) => !!v || '비밀번호를 입력해주세요.',
            (v) => v.length >= 6 || '비밀번호는 최소 6자 이상이어야 합니다.',
            (v) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v) || '영문과 숫자를 포함해야 합니다.',
          ]"
        ></v-text-field>

        <v-text-field
          v-model="passwordConfirm"
          label="비밀번호 확인"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-2"
          required
          :disabled="loading"
          :rules="[
            (v) => !!v || '비밀번호를 다시 입력해주세요.',
            (v) => v === formData.password || '비밀번호가 일치하지 않습니다.',
          ]"
        ></v-text-field>

        <v-text-field
          v-model="formData.email"
          label="이메일"
          type="email"
          variant="outlined"
          density="compact"
          class="mb-2"
          required
          :disabled="loading"
          :rules="[
            (v) => !!v || '이메일을 입력해주세요.',
            (v) => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다.',
          ]"
        ></v-text-field>

        <v-text-field
          v-model="formData.nickname"
          label="닉네임"
          variant="outlined"
          density="compact"
          class="mb-4"
          required
          :disabled="loading"
          :rules="[
            (v) => !!v || '닉네임을 입력해주세요.',
            (v) => v.length >= 2 || '닉네임은 최소 2자 이상이어야 합니다.',
          ]"
        ></v-text-field>

        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>

        <v-btn type="submit" block color="primary" :loading="loading" :disabled="loading" class="mb-4">
          회원가입
        </v-btn>

        <div class="text-center text-body-2">
          이미 계정이 있으신가요?
          <v-btn variant="text" color="primary" size="small" @click="goToLogin" :disabled="loading"> 로그인 </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const form = ref(null);
    const showSnackbar = inject('showSnackbar');
    const router = useRouter();
    const store = useStore();

    return {
      form,
      showSnackbar,
      router,
      store,
    };
  },

  data() {
    return {
      formData: {
        id: '',
        loginId: '',
        password: '',
        email: '',
        nickname: '',
      },
      passwordConfirm: '',
      loading: false,
      error: null,
    };
  },

  methods: {
    close() {
      this.$emit('close');
    },

    async handleSignup() {
      if (!this.form?.validate()) return;

      this.loading = true;
      this.error = null;

      try {
        await this.store.dispatch('signup', this.formData);

        // 회원가입 성공 후 자동 로그인
        await this.store.dispatch('login', {
          loginId: this.formData.loginId,
          password: this.formData.password,
        });

        this.showSnackbar({
          text: '회원가입이 완료되었습니다.',
          color: 'success',
        });

        this.router.push('/');
      } catch (err) {
        this.error = '회원가입 중 오류가 발생했습니다.';
        this.showSnackbar({
          text: '회원가입 중 오류가 발생했습니다.',
          color: 'error',
        });
      } finally {
        this.loading = false;
      }
    },

    goToLogin() {
      this.router.push('/login');
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
