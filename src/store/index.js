import { createStore } from 'vuex';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
  },
  actions: {
    login({ commit }, credentials) {
      // 테스트용 하드코딩된 로그인
      if (credentials.loginId === 'ssafy' && credentials.password === '123456') {
        const user = {
          loginId: 'ssafy',
          name: 'SSAFY User',
        };
        localStorage.setItem('user', JSON.stringify(user));
        commit('SET_USER', user);
        return Promise.resolve(user);
      }
      return Promise.reject('Invalid credentials');
    },

    logout({ commit }) {
      return new Promise((resolve) => {
        localStorage.removeItem('user');
        commit('SET_USER', null);
        resolve();
      });
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  },
});
