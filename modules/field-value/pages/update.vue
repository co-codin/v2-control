<template>
    <div>
        <page-header h1="Редактирование значения" :breadcrumbs="breadcrumbs" />
        <template v-if="fieldValue && !$fetchState.pending">
            <v-expansion-panels :value="0">
                <form-block title="Основная информация">
                    <field-value-form :field-value="fieldValue" is-updating @send="updateFieldValue" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import FieldValueForm from "~/modules/field-value/components/FieldValueForm";
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import FieldValue from "~/modules/field-value/models/FieldValue";

export default {
    components: {
        FormBlock,
        PageHeader,
        FieldValueForm,
    },
    data: () => ({
        fieldValue: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Значения характеристик', to: { name: 'field-values.index' } },
            { text: 'Редактирование значения характеристики' },
        ],
    }),
    async fetch() {
        this.fieldValue = await FieldValue.$find(this.$route.params.id);;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование значения характеристики',
    },
    methods: {
        async updateFieldValue(form) {
            try {
                await form.put(`/admin/field-values/${this.$route.params.id}`);
                this.$snackbar(`Значение характеристики успешно обновлено`);
                await this.$router.push({ name: 'field-values.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении: ${e.message}`);
            }
        },
    },
};
</script>
