<template>
  <v-container fluid class="carousel-container">
    <v-carousel :cycle="true" :interval="5000" hide-delimiters height="100vh">
      <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" class="carousel-item"></v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
export default {
  name: 'AppCarousel',
  data() {
    return {
      items: [
        { src: 'https://picsum.photos/1920/1080?image=10' },
        { src: 'https://picsum.photos/1920/1080?image=20' },
        { src: 'https://picsum.photos/1920/1080?image=30' },
      ],
    };
  },
};
</script>

<style scoped>
.carousel-container {
  width: 100%;
  padding: 0;
  margin: 0;
}

.carousel-item {
  height: 100vh;
  background-size: cover;
  background-position: center;
}
</style>
