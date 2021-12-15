<template>
    <div>
        <page-header h1="Добавление значения" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <field-value-form @send="createFieldValue" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import FieldValueForm from "~/modules/field-value/components/FieldValueForm";
import FormBlock from '~/components/forms/FormBlock';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        FormBlock,
        FieldValueForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Значения характеристик', to: { name: 'field-values.index' } },
            { text: 'Добавление значения' },
        ],
    }),
    head: {
        title: 'Добавление значения характеристики',
    },
    methods: {
        async createFieldValue(form) {
            try {
                await form.post('/admin/field-values');
                this.$snackbar(`Значение успешно добавлено`);
                await this.$router.push({ name: 'field-values.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании значения: ${e.message}`);
            }
        },
    },
};
</script>
