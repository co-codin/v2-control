<template>
    <div>
        <template v-if="search && searchResults">
            <page-header h1="Результаты поиска" :breadcrumbs="breadcrumbs" />
            <v-expansion-panels>
                <form-block v-for="(items, label) in searchResults" :title="`${label} (${items.length})`">
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th class="text-left">ID</th>
                                <th class="text-left">Название</th>
                                <th class="text-left">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="item.id + index">
                                <td>{{ item.id }}</td>
                                <td>{{ item.name }}</td>
                                <td>
                                    <v-btn target="_blank" icon link :href="item.public_url">
                                        <external-link-icon />
                                    </v-btn>
                                    <v-btn
                                        target="_blank"
                                        width="22"
                                        height="22"
                                        class="mx-1"
                                        icon
                                        :href="item.admin_url"
                                    >
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
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
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
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';
import PencilAltIcon from '~/components/heroicons/PencilAltIcon';
import CollectionIcon from '~/components/heroicons/CollectionIcon';

export default {
    components: { CollectionIcon, PencilAltIcon, ExternalLinkIcon, FormBlock, PageHeader },
    computed: {
        ...mapGetters({
            searchResults: 'search/searchResults',
        }),
        breadcrumbs() {
            return [{ text: `Результаты поиска по запросу ${this.search ?? ''}` }];
        },
    },
};
</script>
