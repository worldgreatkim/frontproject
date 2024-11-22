<template>
  <div class="editor-container">
    <!-- 지역 선택 섹션 -->
    <div class="location-section">
      <div class="select-group">
        <select v-model="selectedCity" class="select-input" @change="handleCityChange">
          <option value="">시/도 선택</option>
          <option v-for="city in cities" :key="city.code" :value="city.code">
            {{ city.name }}
          </option>
        </select>

        <select v-model="selectedDistrict" class="select-input" @change="handleDistrictChange">
          <option value="">구/군 선택</option>
          <option v-for="district in districts" :key="district.code" :value="district.code">
            {{ district.name }}
          </option>
        </select>

        <select v-model="selectedTrail" class="select-input">
          <option value="">둘레길/관광지 선택</option>
          <option v-for="trail in trails" :key="trail.id" :value="trail.id">
            {{ trail.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 선택된 관광지 정보 표시 영역 -->
    <div v-if="selectedTrailInfo" class="trail-info">
      <div class="trail-image-container">
        <img
          v-if="selectedTrailInfo.imageUrl"
          :src="selectedTrailInfo.imageUrl"
          :alt="selectedTrailInfo.name"
          class="trail-image"
          @error="handleImageError"
        />
        <div v-else class="image-placeholder">이미지 없음</div>
      </div>
      <div class="trail-description">
        <h3>{{ selectedTrailInfo.name }}</h3>
        <p>{{ selectedTrailInfo.description }}</p>
      </div>
    </div>

    <!-- 여행 일정 선택 -->
    <div class="date-section">
      <div class="date-input">
        <label>여행 시작일</label>
        <input type="date" v-model="travelDate" class="date-picker" />
      </div>
    </div>

    <!-- 제목 입력 -->
    <div class="board-header">
      <input v-model="title" type="text" placeholder="후기 제목을 입력해주세요" class="title-input" />
    </div>

    <!-- 별점 선택 -->
    <div class="rating-section">
      <span class="rating-text">별점을 선택해주세요</span>
      <div class="stars">
        <span v-for="n in 5" :key="n" class="star" :class="{ 'star-filled': rating >= n }" @click="setRating(n)"
          >★</span
        >
      </div>
    </div>

    <!-- 에디터 -->
    <div
      ref="editor"
      class="editor"
      contenteditable="true"
      @input="handleEditorInput"
      :placeholder="'둘레길 후기를 작성해주세요...'"
    ></div>

    <!-- 드래그 앤 드롭 영역 -->
    <div
      class="dropzone"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      :class="{ 'dropzone-active': isDragging }"
    >
      <div class="dropzone-content">
        <span class="dropzone-text">이미지를 여기에 드래그하세요</span>
        <span class="dropzone-subtext">또는</span>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          @change="handleImageUpload"
          style="display: none"
        />
        <button @click="triggerFileInput" class="upload-button">이미지 추가 ({{ imageCount }}/5)</button>
      </div>
    </div>

    <!-- 버튼 그룹 -->
    <div class="button-group">
      <button @click="handleCancel" class="cancel-btn">취소</button>
      <button @click="handleSubmit" :disabled="!isValid || isSubmitting" class="submit-btn">
        {{ isSubmitting ? '등록 중...' : '등록하기' }}
      </button>
    </div>
  </div>
</template>

<script>
import trailData from '@/data/trailData';

export default {
  name: 'TrailReview',

  data() {
    return {
      title: '',
      content: '',
      imageCount: 0,
      isSubmitting: false,
      rating: 0,
      isDragging: false,
      maxImageSize: 800,
      selectedCity: '',
      selectedDistrict: '',
      selectedTrail: '',
      travelDate: '',
      imageTestUrl: '/images/test.jpg', // 테스트용 이미지 경로 추가

      cities: [{ code: 'jeju', name: '제주특별자치도' }],

      cityDistrictMap: {
        jeju: [
          { code: 'jeju-si', name: '제주시' },
          { code: 'seogwipo', name: '서귀포시' },
          { code: 'east-jeju', name: '제주 동부' },
          { code: 'west-jeju', name: '제주 서부' },
        ],
      },

      districts: [],
      trails: [],

      trailMap: {
        'jeju-si': trailData
          .filter((trail) => trail.lat >= 33.4 && trail.lat <= 33.56 && trail.lng >= 126.4 && trail.lng <= 126.8)
          .map((trail) => ({
            id: `jeju-${trail.name}`,
            name: trail.name,
            description: trail.description,
            imageUrl:
              trail.name === '성산 일출봉'
                ? '/images/seongsan-sunrise.jpg'
                : trail.name === '섭지코지'
                ? '/images/seopjikoji.jpg'
                : '/images/default-trail.jpg',
          })),
        seogwipo: trailData
          .filter((trail) => trail.lat >= 33.2 && trail.lat <= 33.3999 && trail.lng >= 126.4 && trail.lng <= 126.8)
          .map((trail) => ({
            id: `seogwipo-${trail.name}`,
            name: trail.name,
            description: trail.description,
            imageUrl:
              trail.name === '성산 일출봉'
                ? '/images/seongsan-sunrise.jpg'
                : trail.name === '섭지코지'
                ? '/images/seopjikoji.jpg'
                : '/images/default-trail.jpg',
          })),
        'east-jeju': trailData
          .filter((trail) => trail.lng > 126.8)
          .map((trail) => ({
            id: `east-${trail.name}`,
            name: trail.name,
            description: trail.description,
            imageUrl:
              trail.name === '성산 일출봉'
                ? '/images/seongsan-sunrise.jpg'
                : trail.name === '섭지코지'
                ? '/images/seopjikoji.jpg'
                : '/images/default-trail.jpg',
          })),
        'west-jeju': trailData
          .filter((trail) => trail.lng < 126.4)
          .map((trail) => ({
            id: `west-${trail.name}`,
            name: trail.name,
            description: trail.description,
            imageUrl:
              trail.name === '성산 일출봉'
                ? '/images/seongsan-sunrise.jpg'
                : trail.name === '섭지코지'
                ? '/images/seopjikoji.jpg'
                : '/images/default-trail.jpg',
          })),
      },
    };
  },

  mounted() {
    // 이미지 로드 테스트
    const testImg = new Image();
    testImg.onload = () => console.log('테스트 이미지 로드 성공');
    testImg.onerror = () => console.error('테스트 이미지 로드 실패');
    testImg.src = this.imageTestUrl;
  },

  computed: {
    isValid() {
      return (
        this.title.trim() &&
        this.content.trim() &&
        this.rating > 0 &&
        this.selectedCity &&
        this.selectedDistrict &&
        this.selectedTrail &&
        this.travelDate
      );
    },

    selectedTrailInfo() {
      if (!this.selectedTrail || !this.selectedDistrict) return null;
      return this.trailMap[this.selectedDistrict]?.find((trail) => trail.id === this.selectedTrail);
    },
  },

  methods: {
    handleImageError(e) {
      // 이미지 로드 실패시 기본 이미지로 대체
      e.target.src = 'https://via.placeholder.com/400x300?text=이미지+없음';
    },

    getResizeHandlers(imgContainer, editor) {
      let isResizing = false;
      let currentResizer;
      let originalWidth;
      let originalHeight;
      let originalMouseX;
      let originalMouseY;

      const startResize = (e) => {
        if (e.target.className.includes('resize-handle')) {
          isResizing = true;
          currentResizer = e.target;

          const rect = imgContainer.getBoundingClientRect();
          originalWidth = rect.width;
          originalHeight = rect.height;
          originalMouseX = e.pageX;
          originalMouseY = e.pageY;

          document.addEventListener('mousemove', resize);
          document.addEventListener('mouseup', stopResize);
          e.preventDefault();
        }
      };

      const resize = (e) => {
        if (!isResizing) return;

        const minSize = 100;
        const maxWidth = editor.clientWidth - 40;

        if (currentResizer.classList.contains('resize-se')) {
          const width = originalWidth + (e.pageX - originalMouseX);
          const height = originalHeight + (e.pageY - originalMouseY);

          if (width > minSize && width <= maxWidth) {
            imgContainer.style.width = `${width}px`;
          }
          if (height > minSize) {
            imgContainer.style.height = `${height}px`;
          }
        }
      };

      const stopResize = () => {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
      };

      return { startResize };
    },

    setRating(value) {
      this.rating = value;
    },

    handleEditorInput(e) {
      this.content = e.target.innerHTML;
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleDragOver() {
      this.isDragging = true;
    },

    handleDragLeave() {
      this.isDragging = false;
    },

    handleDrop(e) {
      this.isDragging = false;
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
      this.processImageFiles(files);
    },

    processImageFiles(files) {
      if (this.imageCount + files.length > 5) {
        alert('이미지는 최대 5개까지만 첨부 가능합니다.');
        return;
      }

      files.forEach((file) => this.processImage(file));
    },

    processImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const resizedImage = this.resizeImage(img);
          this.addImageToEditor(resizedImage);
        };
        img.onerror = () => {
          console.error('이미지 로드 실패');
          alert('이미지를 로드할 수 없습니다.');
        };
        img.src = e.target.result;
      };
      reader.onerror = () => {
        console.error('파일 읽기 실패');
        alert('파일을 읽을 수 없습니다.');
      };
      reader.readAsDataURL(file);
    },

    resizeImage(img) {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > this.maxImageSize || height > this.maxImageSize) {
        if (width > height) {
          height = (height / width) * this.maxImageSize;
          width = this.maxImageSize;
        } else {
          width = (width / height) * this.maxImageSize;
          height = this.maxImageSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg', 0.9);
    },

    addImageToEditor(imageData) {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'image-container';

      const img = document.createElement('img');
      img.src = imageData;
      img.className = 'uploaded-image';

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '×';
      deleteBtn.className = 'delete-button';
      deleteBtn.onclick = () => {
        imgContainer.remove();
        this.imageCount--;
      };

      imgContainer.appendChild(img);
      imgContainer.appendChild(deleteBtn);

      const editor = this.$refs.editor;
      const p = document.createElement('p');
      p.appendChild(imgContainer);
      editor.appendChild(p);
      this.initializeResizable(imgContainer);
      this.imageCount++;
      this.content = editor.innerHTML;
    },

    initializeResizable(imgContainer) {
      const resizers = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];

      resizers.forEach((pos) => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-${pos}`;
        imgContainer.appendChild(handle);
      });

      const { startResize } = this.getResizeHandlers(imgContainer, this.$refs.editor);
      imgContainer.addEventListener('mousedown', startResize);
    },

    handleImageUpload(e) {
      const files = Array.from(e.target.files);
      this.processImageFiles(files);
      e.target.value = null;
    },

    handleCityChange() {
      this.selectedDistrict = '';
      this.selectedTrail = '';
      this.districts = this.cityDistrictMap[this.selectedCity] || [];
      this.trails = [];
    },

    handleDistrictChange() {
      this.selectedTrail = '';
      this.trails = this.trailMap[this.selectedDistrict] || [];
    },

    async handleSubmit() {
      if (!this.isValid) return;

      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('content', this.content);
        formData.append('rating', this.rating);
        formData.append('city', this.selectedCity);
        formData.append('district', this.selectedDistrict);
        formData.append('trail', this.selectedTrail);
        formData.append('travelDate', this.travelDate);

        // 서버 전송 로직을 추가하세요
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 지연
        this.$router.push('/reviews');
      } catch (error) {
        console.error('Error:', error);
        alert('후기 등록에 실패했습니다');
      } finally {
        this.isSubmitting = false;
      }
    },

    handleCancel() {
      if (confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
        this.$router.back();
      }
    },
  },
};
</script>

<style scoped>
.editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.select-group {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.select-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  background-color: white;
  cursor: pointer;
}

.select-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.date-section {
  margin-bottom: 20px;
}

.date-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date-input label {
  font-size: 14px;
  color: #666;
}

.date-picker {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  width: 200px;
}

.date-picker:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-text {
  font-size: 16px;
  color: #666;
}

.stars {
  display: flex;
  gap: 5px;
}

.star {
  font-size: 24px;
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}

.star:hover,
.star-filled {
  color: #ffd700;
}

.editor {
  min-height: 500px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1.6;
  overflow-y: auto;
}

.editor:empty:before {
  content: attr(placeholder);
  color: #999;
}

.dropzone {
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  background: #f8f8f8;
}

.dropzone-active {
  border-color: #007bff;
  background: #f0f7ff;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.dropzone-text {
  font-size: 16px;
  color: #666;
}

.dropzone-subtext {
  font-size: 14px;
  color: #999;
}

.image-container {
  position: relative;
  display: block;
  margin: 10px 0;
  width: calc(100% - 40px);
  max-width: 100%;
  resize: both;
  overflow: hidden;
}

.uploaded-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: contain;
}

.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background-color: #ff4444;
  color: white;
  border: none;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  border-radius: 4px;
}

.delete-button:hover {
  background-color: #ff0000;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #007bff;
  border-radius: 50%;
}

.resize-nw {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}
.resize-ne {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}
.resize-sw {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}
.resize-se {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}
.resize-n {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}
.resize-s {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}
.resize-e {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}
.resize-w {
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}

.upload-button {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #e5e5e5;
}

.trail-info {
  margin: 15px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  display: flex;
  gap: 20px;
}

.trail-image-container {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
}

.trail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trail-description {
  flex-grow: 1;
}

.trail-description h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.trail-description p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
}
</style>
