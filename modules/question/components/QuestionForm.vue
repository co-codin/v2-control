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

        <v-text-field
            v-model="form.answer"
            label="Ответ"
            :error-messages="form.errors.get('answer')"
            :error="form.errors.has('answer')"
        />

        <entity-autocomplete-field
            v-model="form.question_category_id"
            url="/question-categories"
            item-value="id"
            item-text="name"
            :query-params="{ sort: 'name' }"
            :error-messages="form.errors.get('question_category_id')"
            :error="form.errors.has('question_category_id')"
            placeholder="Введите название категории"
            label="Категория"
            filter-column="id"
            search-column="name"
            hide-no-data
            cache-items
        />

        <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
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
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';

export default {
    components: {
        EntityAutocompleteField,
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
        },
        form: null,
        statusLabels,
    }),
    watch: {
        question(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.question || {});
    },
};
</script>
