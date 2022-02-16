<template>
    <div>
        <page-header h1="Результаты поиска" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels>
            <form-block title="Основная информация">
                <div>info</div>
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: { FormBlock, PageHeader },
    data: () => ({
        breadcrumbs: [{ text: 'Результаты поиска по запросу  ' }],
    }),
};
</script>
