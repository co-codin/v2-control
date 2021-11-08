<template>
    <div>
        <page-header h1="Редактирование канонической ссылки" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels v-if="canonical">
                <form-block title="Основная информация">
                    <canonical-form :canonical="canonical" is-updating @send="updateCanonical" />
                </form-block>
            </v-expansion-panels>
        </template>
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
        canonical: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список канонических ссылок', href: '/canonicals' },
            { text: 'Редактирование канонической ссылки' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/canonicals/${this.$route.params.id}`);
        this.canonical = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование канонической ссылки',
    },
    methods: {
        async updateCanonical(form) {
            try {
                await form.put(`/admin/canonicals/${this.$route.params.id}`);
                this.$snackbar(`Каноническая ссылка успешно обновлена`);
                await this.$router.push({ name: 'canonicals.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении канонической ссылки: ${e.message}`);
            }
        },
    },
};
</script>
