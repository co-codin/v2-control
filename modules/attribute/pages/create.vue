<template>
    <div>
        <page-header h1="Добавление атрибута" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <attribute-form @send="createAttribute" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import AttributeForm from '../components/AttributeForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        AttributeForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список атрибутов', to: { name: 'attributes.index' } },
            { text: 'Добавление атрибутов' },
        ],
    }),
    head: {
        title: 'Добавление атрибутов',
    },
    methods: {
        async createAttribute(form) {
            try {
                await form.post('/admin/attributes');
                this.$snackbar(`Атрибут ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'attributes.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании атрибута: ${e.message}`);
            }
        },
    },
};
</script>
