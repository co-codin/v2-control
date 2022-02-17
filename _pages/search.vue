<template>
    <div>
        <page-header h1="Результаты поиска" :breadcrumbs="breadcrumbs" />

        <v-expansion-panels :multiple="true" :value="[]">
            <v-expansion-panel v-for="(items, label) in searchResults">
                <v-expansion-panel-header class="title"> {{ label }} ({{ items.length }}) </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-alert v-if="!items.length" dense type="info">Ничего не найдено</v-alert>
                    <v-card v-else>
                        <v-data-table
                            :headers="headers"
                            :items="items"
                            :loading="isLoading"
                            loading-text="Идет загрузка..."
                            hide-default-footer
                        >
                            <template #item.id="{ item }">
                                <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
                            </template>

                            <template #item.action="{ item }">
                                <div class="table-actions">
                                    <v-btn icon target="_blank" link :href="item.public_url">
                                        <external-link-icon />
                                    </v-btn>
                                    <v-btn icon target="_blank" :href="item.admin_url">
                                        <pencil-alt-icon />
                                    </v-btn>
                                    <v-btn
                                        target="_blank"
                                        width="22"
                                        height="22"
                                        class="mx-1"
                                        icon
                                        :href="`${$config.app.url}/${item.type}?filter=id=${item.id}`"
                                    >
                                        <collection-icon />
                                    </v-btn>
                                </div>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageHeader from '~/components/common/PageHeader';
import PencilAltIcon from '@/components/heroicons/PencilAltIcon';
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';
import CollectionIcon from '~/components/heroicons/CollectionIcon';

export default {
    components: {
        CollectionIcon,
        PageHeader,
        PencilAltIcon,
        ExternalLinkIcon,
    },
    data: () => ({
        isLoading: false,
        results: {
            news: [],
            products: [{ name: 'Mindray DC-10', id: 1 }],
            brands: [],
        },
        headers: [
            { text: 'ID', sortable: false, align: 'left', value: 'id' },
            { text: 'Название', sortable: false, align: 'left', value: 'name' },
            { text: 'Действия', sortable: false, align: 'right', value: 'action' },
        ],
    }),
    computed: {
        ...mapGetters({
            searchResults: 'search/searchResults',
        }),
        breadcrumbs() {
            return [{ text: `Результаты поиска по запросу ${this.$route.query.term ?? ''}` }];
        },
    },
};
</script>
