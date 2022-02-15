<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-card outlined flat tile class="mb-1">
            <v-card-title> Дата и время написания вопроса </v-card-title>
            <v-card-text>
                <date-picker-field
                    :value="dateTime.date"
                    label="Дата"
                    :error-messages="form.errors.get('created_at')"
                    :error="form.errors.has('created_at')"
                    @input="updateDate"
                />
                <v-text-field
                    ref="time"
                    :value="dateTime.time"
                    label="Время"
                    prepend-icon="mdi-clock"
                    :error-messages="form.errors.get('created_at')"
                    :error="form.errors.has('created_at')"
                    maxlength="5"
                    @change="updateTime"
                />
            </v-card-text>
        </v-card>

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

        <template v-if="isOwnQuestionForm">
            <v-card outlined class="mb-2">
                <v-card-title> Автор </v-card-title>
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
                        :loading="isLoadingRandomPerson"
                        :disabled="isLoadingRandomPerson"
                        @click="generateRandomPerson()"
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

        <date-picker-field
            v-model="form.questioned_at"
            label="Дата написания вопроса"
            :error-messages="form.errors.get('questioned_at')"
            :error="form.errors.has('questioned_at')"
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
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import ProductQuestion from '~/modules/product-question/models/ProductQuestion';
import DatePickerField from '~/components/forms/DatePickerField';

export default {
    components: { FileField, WysiwygField, EntityAutocompleteField, DatePickerField },
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
            date: null,
            product_id: null,
            text: null,
            client_id: null,
            questioned_at: null,
        },
        ownQuestionFormDefaults: {
            date: null,
            product_id: null,
            first_name: null,
            last_name: null,
            text: null,
            questioned_at: null,
        },
        form: null,
        isLoadingRandomPerson: false,
    }),
    computed: {
        isOwnQuestionForm() {
            return !this.isUpdating || !this.question?.client_id;
        },
        dateTime() {
            const now = this.$dayjs(this.form.created_at || undefined);
            return {
                date: now.format('YYYY-MM-DD'),
                time: `${now.format('HH')}:${now.format('mm')}`,
            };
        },
    },
    watch: {
        question(value) {
            this.form.populate(value);
        },
    },
    created() {
        const defaults = !this.isOwnQuestionForm ? this.clientQuestionFormDefaults : this.ownQuestionFormDefaults;

        this.form = Form.create(defaults)
            .withOptions({ http: this.$axios })
            .populate({ date: this.$dayjs().format('YYYY-MM-DD HH:mm') })
            .populate(this.question || {});

        if (!this.isUpdating) {
            this.generateRandomPerson();
        }
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
            } catch (e) {
                this.$snackbar(e.message);
            }
            this.isLoadingRandomPerson = false;
        },
        updateDate(date) {
            const now = this.$dayjs(this.form.date ?? undefined);
            this.form.date = `${date || now.format('YYYY-MM-DD')} ${now.format('HH:mm')}`;
        },
        updateTime(time) {
            if (!/[0-9]{2}:[0-9]{2}/.test(time)) {
                time = null;
            }
            const now = this.$dayjs(this.form.date);
            this.form.date = `${now.format('YYYY-MM-DD')} ${time || now.format('HH:mm')}`;
        },
    },
};
</script>
