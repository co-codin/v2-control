<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header class="title">Галерея</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <slot name="fields">
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
                    </slot>
                    <v-btn type="submit" color="green" class="white--text text-uppercase">
                        Сохранить
                    </v-btn>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-form>
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
