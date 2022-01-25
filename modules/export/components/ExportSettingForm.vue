<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-expansion-panels v-if="form">
            <form-block title="Выбор категории">
                <category-tree-search-field
                    v-model="form.filter.category.ids"
                    label="Категории"
                    :error-messages="form.errors.get('filter.category.ids')"
                    :error="form.errors.has('filter.category.ids')"
                    name="categoryIds"
                />
                <v-switch
                    v-model="form.filter.category.selected"
                    label="Исключение"
                    :error-messages="form.errors.get('filter.category.selected')"
                    :error="form.errors.has('filter.category.selected')"
                    inset
                />
            </form-block>
        </v-expansion-panels>

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: { FormBlock, CategoryTreeSearchField },
    props: {
        export: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            filter: {
                category: {
                    ids: [],
                },
                selected: false,
            },
        },
        form: null,
    }),
    watch: {
        export(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.export || {});
    },
};
</script>
