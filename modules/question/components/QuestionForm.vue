<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.question"
            label="Название"
            :error-messages="form.errors.get('question')"
            :error="form.errors.has('question')"
        />
        <v-text-field
            v-model="form.slug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
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
import { statusLabels } from '~/enums';
import WysiwygField from '~/components/forms/WysiwygField';

export default {
    components: {
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
};
</script>
