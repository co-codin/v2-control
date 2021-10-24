<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление характеристики</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <property-form @send="createProperty">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </property-form>
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
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список характиристик', href: '/properties' },
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
