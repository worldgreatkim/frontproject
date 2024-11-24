import { ref } from "vue";
import { useRouter } from "vue-router"; // useRouter import 추가
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode"; // jwtDecode import 추가
import { localAxios } from "@/util/http-commons";
import { TOKEN_TYPE, setToken, removeAllTokens, getToken } from "@/util/auth"; // getToken import 추가
import { httpStatusCode } from "@/util/http-status";
export const useMemberStore = defineStore("memberStore", () => {
  const router = useRouter();
  const local = localAxios();

  const isLogin = ref(false);
  const isLoginError = ref(false);
  const userInfo = ref(null);
  const isValidToken = ref(false);

  const userSignup = async (signupUser) => {
    try {
      const response = await local.post(`/user/signup`, signupUser);
      if (response.status === httpStatusCode.CREATE) {
        console.log("회원가입 성공!!!!");
        router.push({ name: "Login" });
      }
      return response;
    } catch (error) {
      console.log("회원가입 실패!!!!");
      console.error(error);
      throw error;
    }
  };

  const userLogin = async (loginUser) => {
    try {
      const response = await local.post(`/user/login`, loginUser);
      if (response.status === httpStatusCode.OK || response.status === httpStatusCode.CREATE) {
        const { data } = response;
        setToken(TOKEN_TYPE.ACCESS, data["access-token"]);
        setToken(TOKEN_TYPE.REFRESH, data["refresh-token"]);
        isLogin.value = true;
        isLoginError.value = false;
        isValidToken.value = true;
        return true;
      }
      return false;
    } catch (error) {
      console.log("로그인 실패!!!!");
      isLogin.value = false;
      isLoginError.value = true;
      isValidToken.value = false;
      throw error;
    }
  };

  const getUserInfo = async (token) => {
    try {
      const decodeToken = jwtDecode(token);
      const response = await local.get(`/user/info/${decodeToken.userId}`);
      if (response.status === httpStatusCode.OK) {
        userInfo.value = response.data.userInfo;
      }
    } catch (error) {
      console.error("토큰 만료되어 사용 불가능.", error);
      isValidToken.value = false;
      await tokenRegenerate();
    }
  };

  const tokenRegenerate = async () => {
    try {
      const response = await local.post(`/user/refresh`, 
        JSON.stringify(userInfo.value),
        {
          headers: {
            "refreshToken": getToken(TOKEN_TYPE.REFRESH)
          }
        }
      );

      if (response.status === httpStatusCode.CREATE) {
        setToken(TOKEN_TYPE.ACCESS, response.data["access-token"]);
        isValidToken.value = true;
      }
    } catch (error) {
      if (error.response?.status === httpStatusCode.UNAUTHORIZED) {
        try {
          await userLogout();
        } finally {
          alert("RefreshToken 기간 만료!!! 다시 로그인해 주세요.");
          isLogin.value = false;
          userInfo.value = null;
          isValidToken.value = false;
          router.push({ name: "Login" });
        }
      }
    }
  };

 // userLogout 함수 내에서 사용
 const userLogout = async () => {
  try {
    if (!userInfo.value?.userId) {
      // 사용자 정보가 없어도 로그아웃 처리
      removeAllTokens();
      isLogin.value = false;
      userInfo.value = null;
      isValidToken.value = false;
      return true;
    }
    
    const response = await local.get(`/user/logout/${userInfo.value.userId}`);
    if (response.status === httpStatusCode.OK) {
      removeAllTokens();
      isLogin.value = false;
      userInfo.value = null;
      isValidToken.value = false;
      return true;
    }
    return false;
  } catch (error) {
    // 에러가 발생해도 로그아웃 처리
    removeAllTokens();
    isLogin.value = false;
    userInfo.value = null;
    isValidToken.value = false;
    console.error(error);
    return true;
  }
};

  return {
    isLogin,
    isLoginError,
    userInfo,
    isValidToken,
    userSignup,
    userLogin,
    getUserInfo,
    tokenRegenerate,
    userLogout,
  };
});