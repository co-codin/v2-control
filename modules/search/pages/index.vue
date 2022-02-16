<template>
    <div>
        <template v-if="search && searchResults">
            <page-header h1="Результаты поиска" :breadcrumbs="breadcrumbs" />
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <div>info</div>
                </form-block>
            </v-expansion-panels>
        </template>
        <template v-else>
            <page-header h1="Результаты поиска" :breadcrumbs="breadcrumbs" />
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: { FormBlock, PageHeader },
    computed: {
        ...mapGetters({
            search: 'search/search',
            searchResults: 'search/searchResults',
        }),
        breadcrumbs() {
            return [{ text: `Результаты поиска по запросу ${this.search ?? ''}` }];
        },
    },
};
</script>
