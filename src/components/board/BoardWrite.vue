<template>
  <div class="editor-container">
    <!-- 제목 -->
    <div class="board-header">
      <input
        v-model="title"
        type="text"
        placeholder="후기 제목을 입력해주세요"
        class="title-input"
      />
    </div>

    <!-- 별점 -->
    <div class="rating-section">
      <span class="rating-text">별점을 선택해주세요</span>
      <div class="stars">
        <span
          v-for="n in 5"
          :key="n"
          class="star"
          :class="{ 'star-filled': rating >= n }"
          @click="setRating(n)"
        >
          ★
        </span>
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
        <button @click="triggerFileInput" class="upload-button">
          이미지 추가 ({{ imageCount }}/5)
        </button>
      </div>
    </div>

    <!-- 버튼 그룹 -->
    <div class="button-group">
      <button @click="handleCancel" class="cancel-btn">취소</button>
      <button
        @click="handleSubmit"
        :disabled="!isValid || isSubmitting"
        class="submit-btn"
      >
        {{ isSubmitting ? "등록 중..." : "등록하기" }}
      </button>
    </div>
  </div>
</template>

<script>
const getResizeHandlers = (imgContainer, editor) => {
  let isResizing = false;
  let currentResizer;
  let originalWidth;
  let originalHeight;
  let originalMouseX;
  let originalMouseY;

  const startResize = (e) => {
    if (e.target.className.includes("resize-handle")) {
      isResizing = true;
      currentResizer = e.target;

      const rect = imgContainer.getBoundingClientRect();
      originalWidth = rect.width;
      originalHeight = rect.height;
      originalMouseX = e.pageX;
      originalMouseY = e.pageY;

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
      e.preventDefault();
    }
  };

  const resize = (e) => {
    if (!isResizing) return;

    const minSize = 100;
    const maxWidth = editor.clientWidth - 40;

    if (currentResizer.classList.contains("resize-se")) {
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
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };

  return { startResize };
};

export default {
  name: "TrailReview",

  data() {
    return {
      title: "",
      content: "",
      imageCount: 0,
      isSubmitting: false,
      rating: 0,
      isDragging: false,
      maxImageSize: 800,
    };
  },

  computed: {
    isValid() {
      return this.title.trim() && this.content.trim() && this.rating > 0;
    },
  },

  methods: {
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
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      this.processImageFiles(files);
    },

    processImageFiles(files) {
      if (this.imageCount + files.length > 5) {
        alert("이미지는 최대 5개까지만 첨부 가능합니다.");
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
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    resizeImage(img) {
      const canvas = document.createElement("canvas");
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
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      return canvas.toDataURL("image/jpeg", 0.9);
    },

    addImageToEditor(imageData) {
      const imgContainer = document.createElement("div");
      imgContainer.className = "image-container";

      const img = document.createElement("img");
      img.src = imageData;
      img.className = "uploaded-image";

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "×";
      deleteBtn.className = "delete-button";
      deleteBtn.onclick = () => {
        imgContainer.remove();
        this.imageCount--;
      };

      imgContainer.appendChild(img);
      imgContainer.appendChild(deleteBtn);

      const editor = this.$refs.editor;
      const p = document.createElement("p");
      p.appendChild(imgContainer);
      editor.appendChild(p);
      this.initializeResizable(imgContainer);
      this.imageCount++;
      this.content = editor.innerHTML;
    },

    initializeResizable(imgContainer) {
      const resizers = ["nw", "ne", "sw", "se", "n", "s", "e", "w"];

      resizers.forEach((pos) => {
        const handle = document.createElement("div");
        handle.className = `resize-handle resize-${pos}`;
        imgContainer.appendChild(handle);
      });

      const { startResize } = getResizeHandlers(
        imgContainer,
        this.$refs.editor
      );
      imgContainer.addEventListener("mousedown", startResize);
    },

    handleImageUpload(e) {
      const files = Array.from(e.target.files);
      this.processImageFiles(files);
      e.target.value = null;
    },

    async handleSubmit() {
      if (!this.isValid) return;

      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append("title", this.title);
        formData.append("content", this.content);
        formData.append("rating", this.rating);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.$router.push("/reviews");
      } catch (error) {
        console.error("Error:", error);
        alert("후기 등록에 실패했습니다");
      } finally {
        this.isSubmitting = false;
      }
    },

    handleCancel() {
      if (confirm("작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?")) {
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
</style>
