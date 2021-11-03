<template>
    <v-form @submit.prevent="save">
        <v-alert dense type="info" outlined>
            В скором времени здесь появится возможность подгрузки сертификатов и прочей документации
        </v-alert>
        <file-field v-model="form.booklet" :is-image="false" label="Брошюра" />
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapGetters } from 'vuex';
import Form from 'form-backend-validation';
import FileField from '~/components/forms/FileField';

export default {
    components: {
        FileField,
    },
    data: () => ({
        form: null,
        formDefaults: {
            booklet: null,
        },
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
        async save() {
            try {
                await this.form.patch(`admin/products/${this.product.id}`);
                this.$snackbar(`Брошюра товара успешно обновлена`);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
