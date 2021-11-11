<template>
    <div>
        <page-header h1="Добавление канонической ссылки" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <canonical-form @send="createCanonical" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import CanonicalForm from '../components/CanonicalForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        CanonicalForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список канонических ссылок', href: '/canonicals' },
            { text: 'Добавление канонической ссылки' },
        ],
    }),
    head: {
        title: 'Добавление канонической ссылки',
    },
    methods: {
        async createCanonical(form) {
            try {
                await form.post('/admin/canonicals');
                this.$snackbar(`Каноническая ссылка ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'canonicals.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при канонической ссылки: ${e.message}`);
            }
        },
    },
};
</script>
