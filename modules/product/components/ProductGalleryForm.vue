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
            />
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                </v-col>
            </v-row>
        </form-block>
        <form-block title="Дополнительные фотографии">
            <v-form @submit.prevent="$emit('send', form)">
                <v-input
                    label="Галерея"
                    dense
                    :error-messages="form.errors.get('images')"
                    :error="form.errors.has('images')"
                >
                    <file-uploader
                        v-model="form.images"
                        :multiple="true"
                        :max="10"
                        :object-format="true"
                    ></file-uploader>
                </v-input>
                <v-btn type="submit" color="green" class="white--text text-uppercase">
                    Сохранить
                </v-btn>
                <v-row class="expansion-panel-actions mt-3">
                    <v-col>
                        <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </form-block>
        <form-block title="Видеообзор">
            <v-text-field
                v-model="form.video"
                prepend-icon="mdi-youtube"
                label="Видеообзор"
                :error-messages="form.errors.get('video')"
                :error="form.errors.has('video')"
            />
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                </v-col>
            </v-row>
        </form-block>
    </v-expansion-panels>
</template>

<script>
import Form from 'form-backend-validation';
import FileUploader from '~/components/FileUploader';
import FormBlock from '~/components/forms/FormBlock';
import FileField from "~/components/forms/FileField";

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
            form: Form.create()
                .withData({ images: [...this.images] })
                .withOptions({
                    http: this.$axios,
                    resetOnSuccess: false,
                }),
        };
    },
    methods: {
        sendForm() {
            this.form.patch(`/products/${this.$route.params.id}/images`).then((resp) => {
                this.$snackbar.success(`Галерея товара успешно обновлена`);
                this.editing = false;
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
