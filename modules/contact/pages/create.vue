<template>
    <div>
        <page-header h1="Добавление проекта" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <contact-form @send="createContact" />
            </form-block>
        </v-expansion-panels>
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
        breadcrumbs: [{ text: 'Список контактов', to: { name: 'contacts.index' } }, { text: 'Добавление контакта' }],
    }),
    head: {
        title: 'Добавление контакта',
    },
    methods: {
        async createContact(form) {
            try {
                await form.post('/admin/contacts');
                this.$snackbar(`Контакт ${form.last_name} успешно добавлен`);
                await this.$router.push({ name: 'contacts.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании контакта: ${e.message}`);
            }
        },
    },
};
</script>
