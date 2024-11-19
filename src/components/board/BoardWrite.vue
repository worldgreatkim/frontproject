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

          <!-- 에디터 툴바 -->
          <div class="editor-toolbar mb-2">
            <v-btn-group>
              <v-btn density="comfortable" icon @click="insertImage">
                <v-icon>mdi-image</v-icon>
              </v-btn>
              <v-btn density="comfortable" icon @click="formatText('bold')">
                <v-icon>mdi-format-bold</v-icon>
              </v-btn>
              <v-btn density="comfortable" icon @click="formatText('italic')">
                <v-icon>mdi-format-italic</v-icon>
              </v-btn>
            </v-btn-group>
          </div>

          <!-- 내용 에디터 -->
          <div
            ref="editor"
            class="editor-content mb-4"
            contenteditable="true"
            @input="handleEditorInput"
            @paste="handlePaste"
          ></div>

          <!-- 숨겨진 파일 입력 -->
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleImageSelect"
            multiple
          />

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
        tags: [],
      },
      locations: ['제주 올레길', '지리산 둘레길', '북한산 둘레길', '설악산 둘레길', '남한산성 둘레길'],
    };
  },
  methods: {
    insertImage() {
      this.$refs.imageInput.click();
    },
    handleImageSelect(event) {
      const files = event.target.files;
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.marginBottom = '1rem';
          this.$refs.editor.appendChild(img);
          this.updateContent();
        };
        reader.readAsDataURL(file);
      }
      event.target.value = ''; // 입력 초기화
    },
    formatText(command) {
      document.execCommand(command, false, null);
      this.$refs.editor.focus();
    },
    handleEditorInput() {
      this.updateContent();
    },
    handlePaste(e) {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    },
    updateContent() {
      this.form.content = this.$refs.editor.innerHTML;
    },
    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      this.isSubmitting = true;

      try {
        // API 호출 로직
        await new Promise((resolve) => setTimeout(resolve, 1000));

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

.editor-toolbar {
  border: 1px solid #e0e0e0;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 8px;
  background-color: #f5f5f5;
}

.editor-content {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 300px;
  padding: 16px;
  overflow-y: auto;
  background-color: white;
}

.editor-content:focus {
  outline: none;
  border-color: var(--v-primary-base);
}

:deep(.v-text-field .v-input__details) {
  padding-inline-start: 16px;
}
</style>
