<template>
  <v-container>
    <!-- 캐러셀 추가 -->
    <PostCarousel class="mb-8" />
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-6">둘레길 여행 후기</h2>

        <!-- 검색 및 필터링 -->
        <v-row class="mb-4">
          <v-col cols="12" sm="4">
            <v-select v-model="searchType" :items="searchTypes" label="검색 유형" density="compact"></v-select>
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="searchQuery"
              label="검색어를 입력하세요"
              append-inner-icon="mdi-magnify"
              density="compact"
              @keyup.enter="search"
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
              v-for="post in displayedPosts"
              :key="post.id"
              @click="viewPost(post.id)"
              style="cursor: pointer"
              class="post-row"
            >
              <td class="text-center">{{ post.id }}</td>
              <td>
                {{ post.title }}
                <span v-if="post.commentCount > 0" class="text-primary"> [{{ post.commentCount }}] </span>
              </td>
              <td>{{ post.author }}</td>
              <td>{{ formatDate(post.createdAt) }}</td>
              <td class="text-center">{{ post.views }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- 페이지네이션 -->
        <div class="d-flex justify-center mt-6">
          <v-pagination v-model="page" :length="totalPages" :total-visible="7" rounded="circle"></v-pagination>
        </div>

        <!-- 글쓰기 버튼 -->
        <v-btn color="primary" class="mt-4" prepend-icon="mdi-pencil" @click="writePost"> 글쓰기 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PostCarousel from '@/components/board/PostCarousel.vue';
export default {
  name: 'BoardList',
  components: {
    PostCarousel,
  },
  data() {
    return {
      posts: [
        {
          id: 1,
          title: '제주 올레길 7코스 후기',
          author: '올레꾼',
          createdAt: '2024-03-19',
          views: 245,
          commentCount: 15,
        },
        {
          id: 2,
          title: '지리산 둘레길 2일차 - 아름다운 풍경',
          author: '산돌이',
          createdAt: '2024-03-18',
          views: 182,
          commentCount: 8,
        },
      ],
      page: 1,
      itemsPerPage: 10,
      searchQuery: '',
      searchType: 'title',
      searchTypes: [
        { title: '제목', value: 'title' },
        { title: '작성자', value: 'author' },
        { title: '내용', value: 'content' },
      ],
    };
  },
  computed: {
    filteredPosts() {
      if (!this.searchQuery) return this.posts;

      const query = this.searchQuery.toLowerCase();
      return this.posts.filter((post) => {
        if (this.searchType === 'title') {
          return post.title.toLowerCase().includes(query);
        } else if (this.searchType === 'author') {
          return post.author.toLowerCase().includes(query);
        }
        return true;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredPosts.length / this.itemsPerPage);
    },
    displayedPosts() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPosts.slice(start, end);
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('ko-KR');
    },
    search() {
      this.page = 1;
    },
    viewPost(id) {
      this.$router.push(`/board/${id}`);
    },
    writePost() {
      this.$router.push('/board/write');
    },
  },
};
</script>

<style scoped>
.post-row:hover {
  background-color: #f5f5f5;
}
</style>
