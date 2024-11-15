<template>
  <v-container fluid class="main-container">
    <!-- 제목 -->
    <v-row justify="center" class="mb-6">
      <h2 class="text-center font-weight-bold">어디로 여행을 떠나시나요?</h2>
    </v-row>

    <!-- 검색 필드 -->
    <v-row justify="center" class="mb-6">
      <v-text-field
        placeholder="국가명이나 도시명으로 검색해보세요."
        append-icon="mdi-magnify"
        outlined
        dense
        class="search-field"
      ></v-text-field>
    </v-row>

    <!-- 카테고리 버튼 -->
    <v-row justify="center" class="mb-8">
      <v-btn-toggle v-model="category" class="category-toggle" color="primary">
        <v-btn value="all">전체</v-btn>
        <v-btn value="domestic">국내</v-btn>
        <v-btn value="international">해외</v-btn>
      </v-btn-toggle>
    </v-row>

    <!-- 여행지 카드 (v-for로 반복 생성) -->
    <v-row justify="center" align="start" class="card-row">
      <v-col v-for="(place, index) in filteredPlaces" :key="index" cols="12" sm="6" md="3" lg="2" class="d-flex">
        <v-card max-width="300" class="place-card">
          <v-img :src="place.image" height="220px" class="place-image"></v-img>
          <v-card-text class="text-center">
            <h3 class="font-weight-bold mb-1">{{ place.name }}</h3>
            <p class="grey--text">{{ place.country }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      category: 'domestic', // 기본 선택된 카테고리
      places: [
        {
          name: 'JEJU',
          country: '대한민국 제주',
          image: 'https://picsum.photos/300/200?image=10',
          category: 'domestic',
        },
        {
          name: 'BUSAN',
          country: '대한민국 부산',
          image: 'https://picsum.photos/300/200?image=20',
          category: 'domestic',
        },
        {
          name: 'SEOUL',
          country: '대한민국 서울',
          image: 'https://picsum.photos/300/200?image=30',
          category: 'domestic',
        },
        {
          name: 'GYEONGJU',
          country: '대한민국 경주',
          image: 'https://picsum.photos/300/200?image=40',
          category: 'domestic',
        },
        {
          name: 'NEW YORK',
          country: '미국 뉴욕',
          image: 'https://picsum.photos/300/200?image=50',
          category: 'international',
        },
        {
          name: 'PARIS',
          country: '프랑스 파리',
          image: 'https://picsum.photos/300/200?image=60',
          category: 'international',
        },
      ],
    };
  },
  computed: {
    filteredPlaces() {
      if (this.category === 'all') {
        return this.places;
      }
      return this.places.filter((place) => place.category === this.category);
    },
  },
};
</script>

<style scoped>
.main-container {
  max-width: 1200px;
  padding: 20px;
  margin: auto;
}

.text-center {
  text-align: center;
}

.search-field {
  max-width: 500px;
}

.category-toggle {
  background-color: #f5f5f5;
  border-radius: 10px;
}

.card-row {
  gap: 8px; /* 카드 사이의 간격을 줄이기 위해 gap 사용 */
}

.place-card {
  width: 100%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.place-image {
  border-radius: 8px; /* 이미지의 모서리를 둥글게 설정 */
}
</style>
