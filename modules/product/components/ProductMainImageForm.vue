<template>
    <v-form @submit.prevent="saveMainImage">
        <template v-if="form">
            <file-field
                v-model="form.image"
                label="Главная фотография"
                :error-messages="form.errors.get('image')"
                :error="form.errors.has('image')"
                prepend-icon="mdi-image"
                @input="form.is_image_changed = true"
                @delete="form.image = null; form.is_image_changed = true"
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
import FileField from "~/components/forms/FileField";
import Form from "form-backend-validation";
import {mapGetters} from "vuex";

export default {
    components: {
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
