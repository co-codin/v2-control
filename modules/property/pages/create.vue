<template>
    <div>
        <page-header h1="Добавление характеристики" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <property-form @send="createProperty" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import PropertyForm from '../components/PropertyForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        PropertyForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список характиристик', to: { name: 'properties.index' } },
            { text: 'Добавление характиристик' },
        ],
    }),
    head: {
        title: 'Добавление характиристики',
    },
    methods: {
        async createProperty(form) {
            try {
                await form.post('/admin/properties');
                this.$snackbar(`Характеристика ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'properties.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании Характеристики: ${e.message}`);
            }
        },
    },
};
</script>
