<template>
    <div class="image-uploader-wrap">
        <div class="col col-uploader">
            <div
                class="image-uploader"
                :class="{ dragging: isDragging }"
                @dragenter="onDragEnter"
                @dragleave="onDragLeave"
                @dragover.prevent
                @drop="onDrop"
            >
                <div class="image-uploader-empty-bg"></div>
                <div class="image-uploader-empty-text">
                    <p>
                        <label :for="uploaderId">Нажмите на ссылку</label>, чтобы выбрать файлы или просто перетащите их
                        сюда
                    </p>
                    <input :id="uploaderId" type="file" :multiple="multiple" @change="onInputChange" />
                </div>
            </div>
        </div>
        <div v-if="errors.length" class="errors">
            <p v-for="(error, i) in errors" :key="i">{{ error }}</p>
        </div>
    </div>
</template>

<script>
import mime from 'mime-types';

export default {
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
        maxSize: {
            type: Number,
        },
        ratio: {
            type: Number,
        },
        minWidth: {
            type: Number,
        },
        minHeight: {
            type: Number,
        },
        maxHeight: {
            type: Number,
        },
        maxWidth: {
            type: Number,
        },
        onlyImages: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        isDragging: false,
        dragCount: 0,
        id: null,
        errors: [],
        base64_images: [],
    }),
    computed: {
        uploaderId() {
            return `uploader_${this.id}`;
        },
        maxSizeConvert() {
            return this.maxSize * 1024;
        },
        rules() {
            const rules = {};
            const dimensions = {};
            this.onlyImages === true ? (rules.type = 'image') : (rules.type = 'file');
            this.maxSize && (rules.max = this.maxSize);
            this.ratio && (dimensions.ratio = this.ratio);
            this.minWidth && (dimensions.minWidth = this.minWidth);
            this.minHeight && (dimensions.minHeight = this.minHeight);
            this.maxHeight && (dimensions.maxHeight = this.maxHeight);
            this.maxWidth && (dimensions.maxWidth = this.maxWidth);
            rules.dimensions = dimensions;
            return rules;
        },
    },
    mounted() {
        this.id = Math.random().toString(36).substr(2, 10);
    },
    methods: {
        checkType(file) {
            return mime.lookup(file).match('image.*') ? 'image' : 'document';
        },
        checkName(file) {
            return file.replace(/^.*[\\\/]/, '');
        },
        async onInputChange(e) {
            const { files } = e.target;
            await this.uploadImages(files);
            e.target.value = null;
        },
        onDragEnter(e) {
            e.preventDefault();
            this.dragCount++;
            this.isDragging = true;
        },
        onDragLeave(e) {
            e.preventDefault();
            this.dragCount--;
            if (this.dragCount <= 0) {
                this.isDragging = false;
            }
        },
        async onDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = false;
            const { files } = e.dataTransfer;
            await this.uploadImages(files);
        },
        async addImage(file) {
            this.errors = [];
            const { rules } = this;
            if (this.onlyImages) {
                if (!file.type.match('image.*')) {
                    this.errors.push('Можно загружать только картинки');
                    return;
                }
            }
            if (this.maxSizeConvert) {
                if (file.size > this.maxSizeConvert) {
                    this.errors.push('Слишком большой файл');
                    return;
                }
            }
            const fd = new FormData();
            fd.append('file', file, file.name);
            fd.append('rules', JSON.stringify(rules));
            await this.$axios
                .post('/admin/upload/', fd, {
                    onUploadProgress: (uploadEvent) => {
                        console.log(Math.round((uploadEvent.loaded / uploadEvent.total) * 100));
                    },
                })
                .then(({ data }) => {
                    this.$emit('upload', {
                        file: data,
                    });
                })
                .catch((error) => {
                    this.errors.push(error.response.data.errors.file[0]);
                });
        },
        async uploadImages(files) {
            for (let i = 0; i < files.length; i++) {
                await this.addImage(files[i]);
            }
        },
        deleteImage(i) {
            this.files.splice(i, 1);
            this.files = [...this.sortedFiles];
        },
    },
};
</script>

<style lang="sass" scoped>
p
  margin-bottom: 0
.drag-wrap
  display: flex
  flex-wrap: wrap
.image-uploader-wrap
  min-height: 160px
  margin-left: -10px
  margin-right: -10px
  margin-bottom: 10px
  >.col
    padding-left: 10px
    padding-right: 10px
    >div
      margin-bottom: 10px
  >div
    padding-left: 10px
    padding-right: 10px
.col-uploader.fullsize
    flex: 1 0 100%
    max-width: 100%
.image-uploader
  border: 1px dashed #c7ccd6
  padding: 0 20px
  height: 100%
  min-height: 160px
  width: 100%
  position: relative
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
  justify-content: center
  &.dragging
    border: 3px dashed #3b5998
.image-uploader-empty-bg
  width: 50px
  height: 44px
  margin-bottom: 13px
  background-size: cover
  background-position: center
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCAwIDUwIDQzIj4gIDxkZWZzPiAgICA8c3R5bGU+ICAgICAgLmNscy0xIHsgICAgICAgIGZpbGw6ICNjN2NjZDY7ICAgICAgICBmaWxsLXJ1bGU6IGV2ZW5vZGQ7ICAgICAgfSAgICA8L3N0eWxlPiAgPC9kZWZzPiAgPHBhdGggaWQ9IkZvcm1hXzFf0LrQvtC/0LjRj18yIiBkYXRhLW5hbWU9IkZvcm1hIDEg0LrQvtC/0LjRjyAyIiBjbGFzcz0iY2xzLTEiIGQ9Ik01ODguOTcyLDY0OC43ODljLTEuMy0xLjM2OC0yLjMtMS40NjgtNC4xMzctMS40NjhoLTYuMDg4bC0xLjYzLTQuMzA2QTQuOTU0LDQuOTU0LDAsMCwwLDU3NS4wOTQsNjQxYy0wLjgxMy4wNjQtMi43MzQsMC0zLjY1MywwSDU1Ni44MjlhNC45NDksNC45NDksMCwwLDAtMi4wMjEsMi4wMTlsLTEuNjMyLDQuMzA2aC02LjA4OGMtMS44MzgsMC0yLjgzNy4xLTQuMTM3LDEuNDY4YTYuOTM1LDYuOTM1LDAsMCwwLTEuOTUsNC45NTR2MjMuOTM5YzAsMS45MzQtLjA4MiwzLjY5MSwxLjIxNyw1LjA2czQuMjUxLDEuMjY1LDYuMDg5LDEuMjY1aDM1LjMxMmMxLjgzNywwLDQuNzg4LjEsNi4wODgtMS4yNjVzMS4yMTgtMy4xMjYsMS4yMTgtNS4wNmwwLTIzLjkzOUE2LjkzNSw2LjkzNSwwLDAsMCw1ODguOTcyLDY0OC43ODlabS0xNC43ODEsMjUuODc5YTExLjIwNywxMS4yMDcsMCwwLDEtMTYuNDU4LDAsMTIuNjgzLDEyLjY4MywwLDAsMSwwLTE3LjMyNSwxMS4yMDcsMTEuMjA3LDAsMCwxLDE2LjQ1OCwwQTEyLjY4MywxMi42ODMsMCwwLDEsNTc0LjE5MSw2NzQuNjY4Wm0tOC4yMjktMTYuNTQ2YTcuMDM1LDcuMDM1LDAsMCwwLTUuMjkxLDIuMzE0LDguMTU4LDguMTU4LDAsMCwwLDAsMTEuMTM5LDcuMjEsNy4yMSwwLDAsMCwxMC41ODIsMCw4LjE1OCw4LjE1OCwwLDAsMCwwLTExLjEzOUE3LjAzOCw3LjAzOCwwLDAsMCw1NjUuOTYyLDY1OC4xMjJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTQxIC02NDEpIi8+PC9zdmc+)
  &.file
    width: 55px
    height: 70px
    background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iaWMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUyIiBoZWlnaHQ9IjY2IiB2aWV3Qm94PSIwIDAgNTIgNjYiPiAgPGRlZnM+ICAgIDxzdHlsZT4gICAgICAuY2xzLTEsIC5jbHMtNCB7ICAgICAgICBmaWxsOiAjMmRhYmJlOyAgICAgIH0gICAgICAuY2xzLTIgeyAgICAgICAgZmlsbDogI2UwZWFlYzsgICAgICB9ICAgICAgLmNscy0yLCAuY2xzLTMsIC5jbHMtNCB7ICAgICAgICBmaWxsLXJ1bGU6IGV2ZW5vZGQ7ICAgICAgfSAgICAgIC5jbHMtMyB7ICAgICAgICBmaWxsOiAjYjNkMWQ2OyAgICAgIH0gICAgPC9zdHlsZT4gIDwvZGVmcz4gIDxyZWN0IGlkPSLQn9GA0Y/QvNC+0YPQs9C+0LvRjNC90LjQul8xMzcwX9C60L7Qv9C40Y9fMyIgZGF0YS1uYW1lPSLQn9GA0Y/QvNC+0YPQs9C+0LvRjNC90LjQuiAxMzcwINC60L7Qv9C40Y8gMyIgY2xhc3M9ImNscy0xIiB3aWR0aD0iNDYiIGhlaWdodD0iNjAiLz4gIDxwYXRoIGlkPSLQn9GA0Y/QvNC+0YPQs9C+0LvRjNC90LjQul8xMzcwIiBkYXRhLW5hbWU9ItCf0YDRj9C80L7Rg9Cz0L7Qu9GM0L3QuNC6IDEzNzAiIGNsYXNzPSJjbHMtMiIgZD0iTTkzOSw3NzRoMzAuOTI3TDk4NSw3ODkuMDE5VjgzNEg5MzlWNzc0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTkzMyAtNzY4KSIvPiAgPHBhdGggaWQ9ItCf0YDRj9C80L7Rg9Cz0L7Qu9GM0L3QuNC6XzEzNzIiIGRhdGEtbmFtZT0i0J/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LogMTM3MiIgY2xhc3M9ImNscy0zIiBkPSJNOTcwLDc3NGwxNSwxNUg5NzBWNzc0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTkzMyAtNzY4KSIvPiAgPHBhdGggaWQ9Il8xMTEiIGRhdGEtbmFtZT0iMTExIiBjbGFzcz0iY2xzLTQiIGQ9Ik05NzIsODEydi0zaC00di03aDExdjEwaC03Wm0tNi04aC0zdi03aDd2M2gtNHY0Wm0tOCw1aC01djdoLThWODAzaDEzdjZabTEyLDE3SDk1NVY4MTFoMTV2MTVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTMzIC03NjgpIi8+PC9zdmc+)
.image-uploader-empty-text
  color: #6c6c6c
  font-size: 14px
  font-weight: 400
  width: 100%
  label
    color: #3b5998
    cursor: pointer
    display: inline-block
    border-bottom: 1px solid #3b5998
  input
    opacity: 0
    z-index: -2
    display: none
.image-preview-wrap
  display: flex
  flex-direction: column
  align-items: center
  position: relative
  height: 100%
  img
    vertical-align: top
    max-width: 100%
    max-height: 160px
  .delete
    position: absolute
    top: 5px
    right: 5px
    width: 12px
    height: 12px
    cursor: pointer
    background-size: contain
    background-repeat: no-repeat
    background-position: center
    background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM2NXB0IiB2aWV3Qm94PSIwIDAgMzY1LjcxNzMzIDM2NSIgd2lkdGg9IjM2NXB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNmNDQzMzYiPjxwYXRoIGQ9Im0zNTYuMzM5ODQ0IDI5Ni4zNDc2NTYtMjg2LjYxMzI4Mi0yODYuNjEzMjgxYy0xMi41LTEyLjUtMzIuNzY1NjI0LTEyLjUtNDUuMjQ2MDkzIDBsLTE1LjEwNTQ2OSAxNS4wODIwMzFjLTEyLjUgMTIuNTAzOTA2LTEyLjUgMzIuNzY5NTMyIDAgNDUuMjVsMjg2LjYxMzI4MSAyODYuNjEzMjgyYzEyLjUwMzkwNyAxMi41IDMyLjc2OTUzMSAxMi41IDQ1LjI1IDBsMTUuMDgyMDMxLTE1LjA4MjAzMmMxMi41MjM0MzgtMTIuNDgwNDY4IDEyLjUyMzQzOC0zMi43NS4wMTk1MzItNDUuMjV6bTAgMCIvPjxwYXRoIGQ9Im0yOTUuOTg4MjgxIDkuNzM0Mzc1LTI4Ni42MTMyODEgMjg2LjYxMzI4MWMtMTIuNSAxMi41LTEyLjUgMzIuNzY5NTMyIDAgNDUuMjVsMTUuMDgyMDMxIDE1LjA4MjAzMmMxMi41MDM5MDcgMTIuNSAzMi43Njk1MzEgMTIuNSA0NS4yNSAwbDI4Ni42MzI4MTMtMjg2LjU5Mzc1YzEyLjUwMzkwNi0xMi41IDEyLjUwMzkwNi0zMi43NjU2MjYgMC00NS4yNDYwOTRsLTE1LjA4MjAzMi0xNS4wODIwMzJjLTEyLjUtMTIuNTIzNDM3LTMyLjc2NTYyNC0xMi41MjM0MzctNDUuMjY5NTMxLS4wMjM0Mzd6bTAgMCIvPjwvZz48L3N2Zz4=)
.errors
  p
    font-size: 15px
    color: red
    margin-bottom: 5px
.file-name
  margin-top: 5px
  display: inline-block
  p
    text-align: center
    max-width: 100%
    width: 150px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    margin-bottom: 0
</style>
