<template>
    <v-form @submit.prevent="saveVideo">
        <template v-if="form">
            <v-text-field
                v-model="form.video"
                prepend-icon="mdi-youtube"
                label="Видеообзор"
                :error-messages="form.errors.get('video')"
                :error="form.errors.has('video')"
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
            video: null,
        },
        form: null,
    }),
    methods: {
        async saveVideo() {
            try {
                await this.form.patch(`admin/products/${this.product.id}`);
                this.$snackbar(`Видео товара успешно обновлено`);
                this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
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
};
</script>
