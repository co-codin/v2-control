<template>
    <v-form @submit.prevent="$emit('send', form)">
        <category-tree-search-field
            v-model="form.filter.category.ids"
            label="Категории"
            :error-messages="form.errors.get('filter.category.ids')"
            :error="form.errors.has('filter.category.ids')"
            name="categoryIds"
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
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';

export default {
    components: { CategoryTreeSearchField },
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
