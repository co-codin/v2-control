<template>
    <v-expansion-panels>
        <form-block title="Основная фотография">
            <file-field
                v-model="imageForm.image"
                label="Главная фотография"
                :error-messages="imageForm.errors.get('image')"
                :error="imageForm.errors.has('image')"
                prepend-icon="mdi-image"
                @input="imageForm.is_main_image_changed = true"
                @delete="imageForm.image = null"
            />
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase" @click.prevent="saveMainImage"
                        >Сохранить</v-btn
                    >
                </v-col>
            </v-row>
        </form-block>
        <form-block title="Дополнительные фотографии">
            <v-expansion-panels>
                <v-expansion-panel v-for="(item, index) in galleryForm.images" :key="index">
                    <v-expansion-panel-header class="title">
                        <div>
                            <div class="d-flex align-center">
                                <div>
                                    <v-img
                                        max-height="70"
                                        max-width="70"
                                        :src="`http://localhost:8000/storage/${item.image}`"
                                    />
                                </div>
                                <div class="ml-2">
                                    Фотография {{ index + 1 }}
                                </div>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-img
                            max-height="200"
                            max-width="200"
                            :src="`http://localhost:8000/storage/${item.image}`"
                            class="mb-3"
                        />
                        <v-text-field
                            v-model="galleryForm.images[index].caption"
                            label="Описание"
                            dense
                        />
                        <v-text-field
                            v-model="galleryForm.images[index].alt"
                            label="Alt"
                            dense
                        /><v-divider class="my-2" />
                        <div class="text-center">
                            <v-btn
                                small
                                class="white--text"
                                color="red"
                                @click="deleteImage(1)"
                            >
                                Удалить фотографию
                            </v-btn>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <file-uploader
                :multiple="true"
                :max="10"
                :object-format="true"
                @upload="addImage"
            />
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase" @click.prevent="saveGallery"
                        >Сохранить</v-btn
                    >
                </v-col>
            </v-row>
        </form-block>
        <form-block title="Видеообзор">
            <v-text-field
                v-model="videoForm.video"
                prepend-icon="mdi-youtube"
                label="Видеообзор"
                :error-messages="videoForm.errors.get('video')"
                :error="videoForm.errors.has('video')"
            />
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase" @click.prevent="saveVideo"
                        >Сохранить</v-btn
                    >
                </v-col>
            </v-row>
        </form-block>
    </v-expansion-panels>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Form from 'form-backend-validation';
import FileUploader from '~/components/FileUploader';
import FormBlock from '~/components/forms/FormBlock';
import FileField from '~/components/forms/FileField';
import { urlRules } from '~/enums';

export default {
    components: {
        FormBlock,
        FileUploader,
        FileField,
    },
    props: {
        images: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    data() {
        return {
            editing: false,
            imageFormDefaults: {
                is_main_image_changed: false,
                image: null,
            },
            videoFormDefaults: {
                video: null,
            },
            galleryFormDefaults: {
                images: [],
            },
            urlRules,
            imageForm: null,
            galleryForm: null,
            videoForm: null,
        };
    },
    computed: {
        ...mapGetters({
            product: 'product/product',
        }),
    },
    created() {
        this.imageForm = Form.create(this.imageFormDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.product || {});

        this.videoForm = Form.create(this.videoFormDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.product || {});

        this.galleryForm = Form.create(this.galleryFormDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.product || {});
    },
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        async saveMainImage() {
            try {
                await this.imageForm.patch(`admin/products/${this.product.id}`);
                this.$snackbar(`Основная фотография товара успешно обновлена`);
                this.editing = false;
                this.$nuxt.refresh();
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async saveVideo() {
            try {
                await this.videoForm.patch(`admin/products/${this.product.id}`);
                this.$snackbar(`Видео товара успешно обновлено`);
                this.editing = false;
                this.$nuxt.refresh();
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async saveGallery() {
            this.galleryForm.images = this.form.images.concat(this.newImages);
            try {
                await this.galleryForm.patch(`/admin/products/${this.product.id}/images`);
                this.$snackbar(`Галерея товара успешно обновлена`);
                this.editing = false;
                this.$nuxt.refresh();
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        removeImage(value) {
            this.galleryForm.is_images_changed = true;
            this.galleryForm.images = this.galleryForm.images.filter((image) => image.image !== value);
        },
        deleteImage(index) {
            this.galleryForm.images.splice(index, 1);
        },
        addImage(e) {
            this.galleryForm.images.push({
                image: e.file,
                position: null,
                caption: null,
                alt: null,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.gallery-form {
    display: flex;
    flex-wrap: wrap;
    margin-left: -15px;
    margin-right: -15px;
}
</style>
