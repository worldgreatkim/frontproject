<template>
  <div class="login-container">
    <v-card class="pa-4">
      <v-card-title class="text-h5 text-center position-relative">
        <span class="title">길벗누리</span>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="close"
          class="close-button"
        ></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="handleLogin">
          <v-text-field
            v-model="formData.loginId"
            label="아이디"
            variant="outlined"
            density="compact"
            class="mb-2"
            required
            :disabled="loading"
            :rules="loginIdRules"
          ></v-text-field>

          <v-text-field
            v-model="formData.password"
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

          <v-btn
            type="submit"
            block
            color="primary"
            :loading="loading"
            :disabled="loading"
            class="mb-4"
          >
            로그인
          </v-btn>

          <div class="text-center text-body-2">
            <div class="mb-2">
              계정이 없으신가요?
              <v-btn
                variant="text"
                color="primary"
                size="small"
                @click="goToSignup"
                :disabled="loading"
              >
                회원가입
              </v-btn>
            </div>
            <v-btn
              variant="text"
              color="primary"
              size="small"
              @click="goToForgotPassword"
              :disabled="loading"
            >
              비밀번호 찾기
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "AppLogin",
  setup() {
    const form = ref(null);
    const router = useRouter();
    const store = useStore();
    const showSnackbar = inject("showSnackbar");

    // 데이터 초기화
    const formData = ref({
      loginId: "",
      password: "",
    });
    const loading = ref(false);
    const error = ref(null);

    // 유효성 검사 규칙
    const loginIdRules = [(v) => !!v || "아이디를 입력해주세요."];
    const passwordRules = [
      (v) => !!v || "비밀번호를 입력해주세요.",
      (v) => v.length >= 6 || "비밀번호는 최소 6자 이상이어야 합니다.",
    ];

    // 메서드 정의
    const handleLogin = async () => {
      if (!form.value?.validate()) return;

      loading.value = true;
      error.value = null;

      try {
        await store.dispatch("login", {
          loginId: formData.value.loginId,
          password: formData.value.password,
        });

        showSnackbar({
          text: "로그인되었습니다.",
          color: "success",
        });

        router.push("/");
      } catch (err) {
        error.value = "아이디 또는 비밀번호가 올바르지 않습니다.";
      } finally {
        loading.value = false;
      }
    };

    const close = () => {
      router.push("/");
    };

    const goToSignup = () => {
      router.push("/signup");
    };

    const goToForgotPassword = () => {
      router.push("/forgot-password");
    };

    return {
      form,
      formData,
      loading,
      error,
      loginIdRules,
      passwordRules,
      handleLogin,
      close,
      goToSignup,
      goToForgotPassword,
    };
  },
};
</script>

<style scoped>
.v-card {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-text-field {
  margin-bottom: 15px;
}

.v-btn {
  text-transform: none;
  letter-spacing: 0;
}

.close-button {
  position: absolute;
  right: 8px;
  top: 8px;
}

.position-relative {
  position: relative;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 모달 컨테이너 스타일 수정 */
.v-dialog {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 모바일 대응 */
@media (max-width: 600px) {
  .v-card {
    margin: 10px;
    max-height: 90vh;
    overflow-y: auto;
  }
}
</style>
