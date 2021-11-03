<template>
    <div>
        <page-header h1="Редактирование атрибута" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="attribute">
            <attribute-form :attribute="attribute" is-updating @send="updateAttribute" />
        </v-expansion-panels>
    </div>
</template>

<script>
import AttributeForm from '~/modules/attribute/components/AttributeForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AttributeForm,
    },
    data: () => ({
        attribute: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список атрибутов', href: '/attributes' },
            { text: 'Редактирование атрибута' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/attributes/${this.$route.params.id}`);
        this.attribute = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование атрибута',
    },
    methods: {
        async updateAttribute(form) {
            try {
                await form.put(`/admin/attributes/${this.$route.params.id}`);
                this.$snackbar(`Атрибут успешно обновлен`);
                await this.$router.push({ name: 'attributes.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении атрибута: ${e.message}`);
            }
        },
    },
};
</script>
