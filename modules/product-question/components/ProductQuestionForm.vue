<template>
    <v-form @submit.prevent="$emit('send', form)">

        <entity-autocomplete-field
            v-model="form.product_id"
            url="/products"
            item-value="id"
            item-text="name"
            :query-params="{ sort: 'name' }"
            :error-messages="form.errors.get('product_id')"
            :error="form.errors.has('product_id')"
            placeholder="Введите название товара"
            label="Товар"
            filter-column="id"
            search-column="live"
            hide-no-data
            cache-items
            clearable
        />

        <v-select
            v-model="form.status"
            label="Статус"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
            :items="productQuestionStatusLabels"
        />

        <template v-if="isOwnQuestionForm">
            <v-card outlined>
                <v-card-title>
                    Автор
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="form.first_name"
                        label="Имя"
                        :error-messages="form.errors.get('first_name')"
                        :error="form.errors.has('first_name')"
                    />

                    <v-text-field
                        v-model="form.last_name"
                        label="Фамилия"
                        :error-messages="form.errors.get('last_name')"
                        :error="form.errors.has('last_name')"
                    />
                    <v-btn
                        @click="generateRandomPerson()"
                        :loading="isLoadingRandomPerson"
                        :disabled="isLoadingRandomPerson"
                    >
                        Сгенерировать новые данные
                    </v-btn>
                </v-card-text>
            </v-card>
        </template>

        <v-textarea
            v-model="form.text"
            label="Вопрос"
            :error-messages="form.errors.get('text')"
            :error="form.errors.has('text')"
        />

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import WysiwygField from '~/components/forms/WysiwygField';
import FileField from '~/components/forms/FileField';
import EntityAutocompleteField from "~/components/forms/EntityAutocompleteField";
import ProductQuestion from "~/modules/product-question/models/ProductQuestion";
import { productQuestionStatusLabels } from "~/enums";

export default {
    components: { FileField, WysiwygField, EntityAutocompleteField },
    props: {
        question: {
            type: ProductQuestion,
            default: () => ({}),
        },
        isUpdating: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        clientQuestionFormDefaults: {
            product_id: null,
            text: null,
            status: 1,
            client_id: null,
        },
        ownQuestionFormDefaults: {
            product_id: null,
            first_name: null,
            last_name: null,
            text: null,
            status: 1,
        },
        form: null,
        productQuestionStatusLabels,
        isLoadingRandomPerson: false,
    }),
    watch: {
        question(value) {
            this.form.populate(value);
        },
    },
    computed: {
        isOwnQuestionForm() {
            return !this.isUpdating || !this.question?.client_id;
        },
    },
    created() {
        let defaults = !this.isOwnQuestionForm
            ? this.clientQuestionFormDefaults
            : this.ownQuestionFormDefaults;

        this.form = Form.create(defaults)
            .withOptions({ http: this.$axios })
            .populate(this.question || {});

        this.generateRandomPerson();
    },
    methods: {
        async generateRandomPerson() {
            this.isLoadingRandomPerson = true;
            try {
                const { data } = await this.$randomPerson.get('/api/person?fields=name');
                if (!data.result) {
                    throw new Error('Проблема с API генерации имен и фамилий');
                }
                this.form.first_name = data.result?.[0]?.name?.first;
                this.form.last_name = data.result?.[0]?.name?.second;
            }
            catch (e) {
                this.$snackbar(e.message);
            }
            this.isLoadingRandomPerson = false;
        },
    },
};
</script>
