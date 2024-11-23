<template>
  <v-container>
    <PostCarousel class="mb-8" />
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-6">둘레길 여행 후기</h2>

        <!-- 검색 및 필터링 -->
        <v-row class="mb-4">
          <v-col cols="12" sm="4">
            <v-select 
              v-model="param.searchType" 
              :items="searchTypes" 
              label="검색 유형" 
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="8" class="d-flex">
            <v-text-field
              v-model="param.searchQuery"
              label="검색어를 입력하세요"
              append-inner-icon="mdi-magnify"
              density="compact"
              hide-details
              @keyup.enter="handleSearch"
            ></v-text-field>
            <v-btn 
              color="primary" 
              class="ml-2" 
              @click="handleSearch"
              :disabled="!param.searchQuery"
            >
              검색
            </v-btn>
          </v-col>
        </v-row>

        <!-- 게시글 목록 -->
        <v-table>
          <thead>
            <tr>
              <th class="text-center">번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th class="text-center">조회수</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="article in articles"
              :key="article.id"
              @click="viewArticle(article.id)"
              style="cursor: pointer"
              class="post-row"
            >
              <td class="text-center">{{ article.id }}</td>
              <td>{{ article.title }}</td>
              <td>{{ article.nickname }}</td>
              <td>{{ article.created_at }}</td>
              <td class="text-center">{{ article.hit }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- 검색 결과가 없을 때 -->
        <v-alert
          v-if="articles.length === 0"
          type="info"
          class="mt-4"
        >
          검색 결과가 없습니다.
        </v-alert>

        <!-- 페이지네이션 -->
        <div class="d-flex justify-center mt-6">
          <v-pagination
            v-model="param.page"
            :length="totalPages"
            :total-visible="7"
            @update:model-value="getArticles"
            rounded="circle"
          ></v-pagination>
        </div>

        <!-- 글쓰기 버튼 -->
        <v-btn color="primary" class="mt-4" prepend-icon="mdi-pencil" @click="moveWrite">
          글쓰기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { listArticle } from '@/api/board';
import PostCarousel from './PostCarousel.vue';

const router = useRouter();
const articles = ref([]);
const totalPages = ref(1);

const param = ref({
  page: 0,
  size: 20,
  searchType: 'title',
  searchQuery: '',
});

const searchTypes = [
  { title: '제목', value: 'title' },
  { title: '작성자', value: 'nickname' },
  { title: '내용', value: 'content' },
];

const getArticles = () => {
  listArticle(
    param.value,
    ({ data }) => {
      if (data.isSuccess) {
        articles.value = data.result.articles;
        totalPages.value = data.result.totalPages;
      }
    },
    (error) => {
      console.error('게시글 목록 조회 실패:', error);
    }
  );
};

const handleSearch = () => {
  param.value.page = 0; // 검색 시 첫 페이지로 이동
  getArticles();
};

const viewArticle = (id) => {
  router.push({
    name: 'article-detail',
    params: { id: id },
  });
};

const moveWrite = () => {
  router.push({ name: 'article-write' });
};

// 검색 타입이 변경될 때 검색어 초기화
watch(() => param.value.searchType, () => {
  param.value.searchQuery = '';
});

onMounted(() => {
  getArticles();
});
</script>

<style scoped>
.post-row:hover {
  background-color: #f5f5f5;
}
</style>