<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Галерея</v-expansion-panel-header>
        <v-expansion-panel-content>
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
                <v-btn type="submit" color="green" class="white--text text-uppercase"> Сохранить </v-btn>
            </v-form>
        </v-expansion-panel-content>
    </v-expansion-panel>
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
};
</script>

<style lang="scss" scoped></style>
