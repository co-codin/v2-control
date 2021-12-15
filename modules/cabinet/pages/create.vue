<template>
    <div>
        <page-header h1="Добавление кабинета" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <cabinet-form />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import CabinetForm from '~/modules/cabinet/components/CabinetForm';

export default {
    components: {
        CabinetForm,
        FormBlock,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список кабинетов', to: { name: 'cabinets.index' } },
            { text: 'Добавление кабинетов' },
        ],
    }),
    head: {
        title: 'Добавление кабинетов',
    },
    computed: {
        ...mapGetters({
            form: 'forms/cabinet/form',
        }),
    },
    created() {
        this.initForm();
    },
    methods: {
        ...mapMutations({
            initForm: 'forms/cabinet/INIT_FORM',
        }),
    },
};
</script>
