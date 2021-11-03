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
            { text: 'Список атрибутов', href: '/attributes' },
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
