<template>
    <div>
        <page-header h1="Редактирование валюты" :breadcrumbs="breadcrumbs" />
        <template v-if="currency && !$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <currency-form :currency="currency" is-updating @send="updateCurrency" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import CurrencyForm from '../components/CurrencyForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        CurrencyForm,
    },
    data: () => ({
        currency: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список валют', to: { name: 'currencies.index' } },
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
