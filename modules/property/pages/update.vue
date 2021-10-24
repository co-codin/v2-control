<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Редактирование характеристики</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card :loading="isLoading" class="mb-3">
            <v-card-title> Основная информация </v-card-title>
            <v-card-text v-if="property">
                <property-form :property="property" is-updating @send="updateProperty" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import PropertyForm from '../components/PropertyForm';

export default {
    components: {
        PropertyForm,
    },
    data: () => ({
        property: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список характеристик', href: '/properties' },
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
