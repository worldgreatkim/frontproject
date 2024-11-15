<template>
  <v-app-bar app fixed flat color="white">
    <v-toolbar-title class="logo">두루누비</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text class="mx-4">여행계획</v-btn>
    <v-btn text class="mx-4">게시판</v-btn>
    <v-btn text class="mx-4">로그인</v-btn>
    <v-btn icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
};
</script>

<style scoped>
.logo {
  font-weight: bold;
  font-size: 1.5rem;
}
</style>
