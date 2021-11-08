<template>
    <div>
        <page-header h1="Редактирование канонической ссылки" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="canonical">
            <canonical-form :canonical="canonical" is-updating @send="updateCanonical" />
        </v-expansion-panels>
    </div>
</template>

<script>
import CanonicalForm from '../components/CanonicalForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
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
                await form.put(`/admin/achievements/${this.$route.params.id}`);
                this.$snackbar(`Достижение успешно обновлено`);
                await this.$router.push({ name: 'achievements.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении достижения: ${e.message}`);
            }
        },
    },
};
</script>
