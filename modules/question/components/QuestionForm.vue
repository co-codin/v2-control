<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.question"
            label="Название"
            :error-messages="form.errors.get('question')"
            :error="form.errors.has('question')"
            @input="updateSlug"
        />
        <v-text-field
            v-model="form.slug"
            append-icon="mdi-refresh"
            :loading="isUpdatingSlug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
            @click:append="
                form.slug = null;
                updateSlug();
            "
        />

        <wysiwyg-field
            v-model="form.answer"
            label="Ответ"
            :error-messages="form.errors.get('answer')"
            :error="form.errors.has('answer')"
        />

        <v-select
            v-model="form.question_category_id"
            label="Введите название категории"
            :items="questionCategories"
            :error-messages="form.errors.get('question_category_id')"
            :error="form.errors.has('question_category_id')"
            item-text="name"
            item-value="id"
        />

        <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
        />

        <v-text-field
            v-if="isUpdating"
            v-model="form.position"
            type="number"
            label="Позиция"
            :error-messages="form.errors.get('position')"
            :error="form.errors.has('position')"
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
import slugify from 'slugify';
import { debounce } from 'lodash';
import { statusLabels } from '~/enums';
import WysiwygField from '~/components/forms/WysiwygField';
import DatePickerField from '~/components/forms/DatePickerField';

export default {
    components: {
        DatePickerField,
        WysiwygField,
    },
    props: {
        question: {
            type: Object | null,
            default: () => ({}),
        },
        isUpdating: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        formDefaults: {
            question: null,
            slug: null,
            answer: null,
            status: 1,
            question_category_id: null,
            position: null,
        },
        questionCategories: [],
        form: null,
        statusLabels,
        isUpdatingSlug: false,
    }),
    watch: {
        question(value) {
            this.form.populate(value);
        },
    },
    async created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.question || {});

        const { data } = await this.$axios.get('/question-categories/all');
        this.questionCategories = data.data;
    },
    methods: {
        updateSlug: debounce(function () {
            if (this.isUpdating && this.form.slug) {
                return;
            }
            this.isUpdatingSlug = true;
            let slug = slugify(this.form.question, { lower: true }).replace(/[^a-z0-9-]/gi, '');
            slug = slug.replace(/[^a-z0-9-]/gi, '');

            this.form.slug = slug;

            this.isUpdatingSlug = false;
        }, 200),
    },
};
</script>
