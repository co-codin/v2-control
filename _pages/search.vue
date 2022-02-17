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
                                    <v-btn
                                        icon
                                        target="_blank"
                                        link
                                        :href="`${$config.app.siteUrl}/brands/${item.slug}`"
                                    >
                                        <external-link-icon />
                                    </v-btn>
                                    <v-btn icon :to="{ name: 'brands.update', params: { id: item.id } }">
                                        <pencil-alt-icon />
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
import DotsHorizontalIcon from '@/components/heroicons/DotsHorizontalIcon';
import PencilAltIcon from '@/components/heroicons/PencilAltIcon';
import TrashIcon from '@/components/heroicons/TrashIcon';
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';

export default {
    components: {
        PageHeader,
        PencilAltIcon,
        TrashIcon,
        DotsHorizontalIcon,
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
