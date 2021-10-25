<template>
    <v-card tile class="mt-5 block-wrap">
        <v-card-title>
            Галерея
            <v-btn text small color="info" class="ml-3" @click="editing = !editing">
                {{ editing ? 'Свернуть' : 'Развернуть' }}
            </v-btn>
        </v-card-title>
        <v-card-text v-show="editing">
            <v-form class="mt-3" @submit.prevent="sendForm">
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
                <div class="mt-5">
                    <v-btn type="submit" dark color="green">Сохранить</v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import Form from 'form-backend-validation';
import FileUploader from '~/components/FileUploader';

export default {
    components: {
        FileUploader,
    },
    props: {
        images: {
            type: Array,
            default: () => {
                return [];
            },
        },
        productName: {},
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
                this.$snackbar.success(`Галерея товара ${this.productName} успешно обновлена`);
                this.editing = false;
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
