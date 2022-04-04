<template>
    <div>
        <page-header h1="Инструменты" :breadcrumbs="[{text: 'Инструменты'}]" />
        <v-list two-line subheader>
            <v-subheader inset>Выберите инструмент</v-subheader>

            <v-list-item v-for="item in items" :key="item.title" :to="item.route">
                <v-list-item-avatar>
                    <v-icon :class="[item.iconClass]" v-text="item.icon"></v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
    },
    data: () => ({
        items: [
            {
                icon: 'mdi-search',
                iconClass: 'blue white--text',
                title: 'Анализ страницы',
                subtitle: 'Анализ данных и SEO страницы',
                route: { name: 'tools.page-analyzer' },
            },
        ],
    }),
};
</script>
