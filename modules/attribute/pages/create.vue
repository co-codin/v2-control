<template>
    <div>
        <page-header h1="Добавление атрибута" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <attribute-form @send="createAttribute" />
        </v-expansion-panels>
    </div>
</template>

<script>
import AttributeForm from '../components/AttributeForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AttributeForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список атрибутов', href: '/brands' },
            { text: 'Добавление производителя' },
        ],
    }),
    head: {
        title: 'Добавление производителя',
    },
    methods: {
        async createBrand(form) {
            try {
                await form.post('/admin/brands');
                this.$snackbar(`Производитель ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'brands.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании производителя: ${e.message}`);
            }
        },
    },
};
</script>
