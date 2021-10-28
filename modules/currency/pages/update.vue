<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Редактирование валюты</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card :loading="isLoading" class="mb-3">
            <v-card-title> Основная информация </v-card-title>
            <v-card-text v-if="currency">
                <currency-form :currency="currency" is-updating @send="updateCurrency" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import CurrencyForm from '../components/CurrencyForm';

export default {
    components: {
        CurrencyForm,
    },
    data: () => ({
        currency: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список валют', href: '/currencies' },
            { text: 'Редактирование валюты' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/currencies/${this.$route.params.id}`);
        this.currency = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование валюты',
    },
    methods: {
        async updateCurrency(form) {
            try {
                await form.put(`/admin/currencies/${this.$route.params.id}`);
                this.$snackbar(`Валюта успешно обновлена`);
                await this.$router.push({ name: 'currencies.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении валюты: ${e.message}`);
            }
        },
    },
};
</script>
