<template>
  <v-container class="py-8">
    <v-card class="mx-auto" max-width="900px" elevation="3">
      <v-card-title class="text-h5 font-weight-bold pa-6 pb-0">
        여행 후기 작성
        <v-divider class="mt-4"></v-divider>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="form" v-model="isFormValid">
          <!-- 여행지 선택 -->
          <v-select
            v-model="form.location"
            :items="locations"
            label="여행지 선택"
            variant="outlined"
            class="mb-4"
            required
            :rules="[(v) => !!v || '여행지를 선택해주세요']"
          ></v-select>

          <!-- 제목 -->
          <v-text-field
            v-model="form.title"
            label="제목"
            variant="outlined"
            class="mb-4"
            placeholder="제목을 입력해주세요"
            required
            :rules="[(v) => !!v || '제목을 입력해주세요']"
            counter="100"
            maxlength="100"
          ></v-text-field>

          <!-- 여행 날짜 -->
          <div class="d-flex gap-4 mb-4">
            <v-text-field
              v-model="form.startDate"
              label="여행 시작일"
              type="date"
              variant="outlined"
              required
              :rules="[(v) => !!v || '여행 시작일을 선택해주세요']"
            ></v-text-field>
            <v-text-field
              v-model="form.endDate"
              label="여행 종료일"
              type="date"
              variant="outlined"
              required
              :rules="[(v) => !!v || '여행 종료일을 선택해주세요']"
            ></v-text-field>
          </div>

          <!-- 후기 내용 -->
          <v-textarea
            v-model="form.content"
            label="여행 후기"
            variant="outlined"
            class="mb-4"
            placeholder="여행하면서 느낀 점, 추천하고 싶은 장소, 주의사항 등을 자유롭게 작성해주세요."
            required
            :rules="[(v) => !!v || '내용을 입력해주세요']"
            rows="12"
            counter
            maxlength="2000"
          ></v-textarea>

          <!-- 사진 업로드 -->
          <v-file-input
            v-model="form.images"
            label="사진 첨부"
            variant="outlined"
            class="mb-6"
            multiple
            accept="image/*"
            prepend-icon="mdi-camera"
            :rules="[(files) => !files || files.length <= 5 || '최대 5장까지 업로드 가능합니다']"
            hint="여행 사진을 최대 5장까지 첨부할 수 있습니다"
            persistent-hint
            show-size
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="fileName in fileNames" :key="fileName">
                <v-chip label size="small" class="me-2" color="primary" variant="outlined">
                  {{ fileName }}
                </v-chip>
              </template>
            </template>
          </v-file-input>

          <!-- 태그 입력 -->
          <v-combobox
            v-model="form.tags"
            label="태그 입력"
            variant="outlined"
            class="mb-6"
            multiple
            chips
            hint="엔터를 눌러 태그를 추가할 수 있습니다 (최대 5개)"
            persistent-hint
            :rules="[(tags) => tags.length <= 5 || '태그는 최대 5개까지 입력 가능합니다']"
          ></v-combobox>

          <!-- 버튼 그룹 -->
          <v-card-actions class="px-0 pb-0">
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="outlined" @click="goBack" class="mr-2"> 취소 </v-btn>
            <v-btn color="primary" @click="handleSubmit" :disabled="!isFormValid" :loading="isSubmitting">
              등록하기
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'BoardWrite',
  data() {
    return {
      isFormValid: false,
      isSubmitting: false,
      form: {
        location: null,
        title: '',
        startDate: '',
        endDate: '',
        content: '',
        images: [],
        tags: [],
      },
      locations: ['제주 올레길', '지리산 둘레길', '북한산 둘레길', '설악산 둘레길', '남한산성 둘레길'],
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      this.isSubmitting = true;

      try {
        // API 호출 로직
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 딜레이

        // 성공 처리
        this.$router.push('/board');
      } catch (error) {
        console.error('Error submitting post:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

:deep(.v-text-field .v-input__details) {
  padding-inline-start: 16px;
}
</style>
