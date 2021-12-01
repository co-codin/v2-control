<template>
    <v-expansion-panels>
        <form-block title="Основная фотография">
            <file-field
                v-model="form.image"
                label="Главная фотография"
                :error-messages="form.errors.get('image')"
                :error="form.errors.has('image')"
                prepend-icon="mdi-image"
                @input="form.is_image_changed = true"
                @delete="form.image = null"
            />
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase" @click.prevent="sendForm"
                        >Сохранить</v-btn
                    >
                </v-col>
            </v-row>
        </form-block>
        <form-block title="Дополнительные фотографии">
            <v-form class="gallery-form">
                <file-field
                    v-for="(image, index) in form.images"
                    :key="'image-' + index"
                    v-model="form.images[index].image"
                    @delete="removeImage"
                />
            </v-form>
            <file-uploader v-model="newImages" :multiple="true" :max="10" :object-format="true" />
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase" @click.prevent="sendForm"
                        >Сохранить</v-btn
                    >
                </v-col>
            </v-row>
        </form-block>
        <form-block title="Видеообзор">
            <v-text-field
                v-model="form.video"
                prepend-icon="mdi-youtube"
                label="Видеообзор"
                :error-messages="form.errors.get('video')"
                :error="form.errors.has('video')"
                :rules="urlRules"
            />
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase" @click.prevent="sendForm"
                        >Сохранить</v-btn
                    >
                </v-col>
            </v-row>
        </form-block>
    </v-expansion-panels>
</template>

<script>
import { mapGetters } from 'vuex';
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
            form: null,
            formDefaults: {
                image: null,
                video: null,
                images: [],
                is_image_changed: false,
            },
            newImages: [],
            urlRules,
        };
    },
    computed: {
        ...mapGetters({
            product: 'product/product',
        }),
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.product || {});
    },
    methods: {
        async sendForm() {
            this.form.images = this.form.images.concat(this.newImages);
            try {
                await this.form.patch(`admin/products/${this.product.id}`);
                this.$snackbar(`Галерея товара успешно обновлена`);
                this.editing = false;
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        removeImage(value) {
            this.form.images = this.form.images.filter((image) => image.image !== value);
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
