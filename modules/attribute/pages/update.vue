<template>
    <div>
        <page-header h1="Редактирование товара" :breadcrumbs="breadcrumbs" />
        <template v-if="attribute && !$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <attribute-form :attribute="attribute" is-updating @send="updateAttribute" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import AttributeForm from '~/modules/attribute/components/AttributeForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        AttributeForm,
    },
    data: () => ({
        attribute: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список атрибутов', to: { name: 'attributes.index' } },
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
