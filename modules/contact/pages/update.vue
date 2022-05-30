<template>
    <div>
        <page-header h1="Редактирование конакта" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <contact-form :contact="contact" is-updating @send="updateContact" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import ContactForm from '../components/ContactForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        ContactForm,
    },
    data: () => ({
        contact: null,
        isLoading: true,
        breadcrumbs: [{ text: 'Список контактов', to: { name: 'contacts.index' } }, { text: 'Редактирование контакта' }],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/contacts/${this.$route.params.id}`);
        this.contact = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование контакта',
    },
    methods: {
        async updateContact(form) {
            try {
                await form.put(`/admin/contacts/${this.$route.params.id}`);
                this.$snackbar(`Контакт успешно обновлен`);
                await this.$router.push({ name: 'contacts.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении контакта: ${e.message}`);
            }
        },
    },
};
</script>
