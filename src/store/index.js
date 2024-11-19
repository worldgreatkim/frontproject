import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        // 임시 로그인 검증
        if (credentials.email === 'ssafy' && credentials.password === '123456') {
          const user = {
            id: 1,
            email: 'ssafy',
            name: 'SSAFY',
          };
          commit('SET_USER', user);
          // 로그인 정보 저장
          localStorage.setItem('user', JSON.stringify(user));
          return Promise.resolve({ data: { user } });
        } else {
          return Promise.reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.'));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    logout({ commit }) {
      commit('SET_USER', null);
      localStorage.removeItem('user');
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  },
});
