<template>
  <v-container>
    <PostCarousel class="mb-8" />
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-6">둘레길 여행 후기</h2>

        <!-- 검색 및 필터링 -->
        <v-row class="mb-4">
          <v-col cols="12" sm="4">
            <v-select v-model="param.searchType" :items="searchTypes" label="검색 유형" density="compact"></v-select>
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="param.searchQuery"
              label="검색어를 입력하세요"
              append-inner-icon="mdi-magnify"
              density="compact"
              @keyup.enter="getArticles"
            ></v-text-field>
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
              :key="article.articleNo"
              @click="viewArticle(article.articleNo)"
              style="cursor: pointer"
              class="post-row"
            >
              <td class="text-center">{{ article.articleNo }}</td>
              <td>{{ article.subject }}</td>
              <td>{{ article.userName }}</td>
              <td>{{ formatDate(article.registerTime) }}</td>
              <td class="text-center">{{ article.hit }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- 페이지네이션 -->
        <div class="d-flex justify-center mt-6">
          <v-pagination
            v-model="param.pgno"
            :length="totalPages"
            :total-visible="7"
            @update:model-value="getArticles"
            rounded="circle"
          ></v-pagination>
        </div>

        <!-- 글쓰기 버튼 -->
        <v-btn color="primary" class="mt-4" prepend-icon="mdi-pencil" @click="moveWrite"> 글쓰기 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listArticle } from '@/api/board';
import PostCarousel from './PostCarousel.vue';

const router = useRouter();
const articles = ref([]);

const param = ref({
  pgno: 1,
  spp: 20,
  searchType: 'subject',
  searchQuery: '',
});

const searchTypes = [
  { title: '제목', value: 'subject' },
  { title: '작성자', value: 'userName' },
  { title: '내용', value: 'content' },
];

const totalPages = ref(1);

const getArticles = () => {
  listArticle(
    param.value,
    ({ data }) => {
      articles.value = data;
      // 백엔드에서 총 페이지 수를 받아온다고 가정
      // totalPages.value = data.totalPages
    },
    (error) => {
      console.error('게시글 목록 조회 실패:', error);
    }
  );
};

const viewArticle = (articleNo) => {
  router.push({
    name: 'article-detail',
    params: { articleno: articleNo },
  });
};

const moveWrite = () => {
  router.push({ name: 'article-write' });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
};

onMounted(() => {
  getArticles();
});
</script>

<style scoped>
.post-row:hover {
  background-color: #f5f5f5;
}
</style>
