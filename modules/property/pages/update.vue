<template>
    <div>
        <page-header h1="Редактирование характеристики" :breadcrumbs="breadcrumbs" />
        <template v-if="property && !$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <property-form :property="property" is-updating @send="updateProperty" />
                </form-block>
            </v-expansion-panels>
        </template>
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
        property: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список характеристик', to: { name: 'properties.index' } },
            { text: 'Редактирование характеристики' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/properties/${this.$route.params.id}`);
        this.property = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование характеристики',
    },
    methods: {
        async updateProperty(form) {
            try {
                await form.put(`/admin/properties/${this.$route.params.id}`);
                this.$snackbar(`Характеристика успешно обновлена`);
                await this.$router.push({ name: 'properties.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении характеристики: ${e.message}`);
            }
        },
    },
};
</script>
