<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление валюты</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <currency-form @send="createCurrency">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </currency-form>
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
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список валют', href: '/currencies' },
            { text: 'Добавление валюты' },
        ],
    }),
    head: {
        title: 'Добавление валюты',
    },
    methods: {
        async createCurrency(form) {
            try {
                await form.post('/admin/currencies');
                this.$snackbar(`Валюта ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'currencies.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании валюты: ${e.message}`);
            }
        },
    },
};
</script>
