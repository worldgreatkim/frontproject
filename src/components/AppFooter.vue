<template>
  <v-footer app color="primary" class="white--text">
    <v-container class="text-center">
      <v-row>
        <v-col> © 2024 My Awesome App </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn text href="https://github.com" target="_blank" class="white--text"> GitHub </v-btn>
          <v-btn text href="https://twitter.com" target="_blank" class="white--text"> Twitter </v-btn>
          <v-btn text href="https://facebook.com" target="_blank" class="white--text"> Facebook </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
