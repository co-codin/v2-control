<template>
    <v-form @submit.prevent="saveMainImage">
        <template v-if="form">
            <span>Главная фотография</span>
            <file-uploader
                v-if="!form.image"
                @upload="
                    form.image = $event.file;
                    form.is_image_changed = true;
                "
            />

            <file-field
                v-else
                v-model="form.image"
                :error-messages="form.errors.get('image')"
                :error="form.errors.has('image')"
                prepend-icon="mdi-image"
                @input="form.is_image_changed = true"
                @delete="
                    form.image = null;
                    form.is_image_changed = true;
                "
            />
        </template>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import Form from 'form-backend-validation';
import { mapGetters } from 'vuex';
import FileField from '~/components/forms/FileField';
import FileUploader from '~/components/FileUploader';

export default {
    components: {
        FileUploader,
        FileField,
    },
    data: () => ({
        formDefaults: {
            image: null,
            is_image_changed: false,
        },
        form: null,
    }),
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
        async saveMainImage() {
            try {
                await this.form.patch(`admin/products/${this.product.id}`);
                this.$snackbar(`Основная фотография товара успешно обновлена`);
                this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
