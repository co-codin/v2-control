<template>
    <div>
        <page-header h1="Добавление валюты" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <currency-form @send="createCurrency" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import CurrencyForm from '../components/CurrencyForm';
import FormBlock from '~/components/forms/FormBlock';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        FormBlock,
        CurrencyForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список валют', to: { name: 'currencies.index' } },
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
