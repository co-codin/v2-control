<template>
    <div>
        <page-header h1="Баннеры" :breadcrumbs="breadcrumbs"></page-header>
        <div>
            <v-select
                label="Страница"
                :items="$enum('BannerPage', true)"
                :value="page"
                @input="changePage"
            />
            <v-alert v-if="!page" type="info" dense class="mt-2">
                Выберите страницу для сортировки баннеров
            </v-alert>
            <v-alert v-else-if="!loading && !banners.length" type="info" dense class="mt-2">
                На выбранной странице нет баннеров
            </v-alert>
            <div v-else class="mt-2">
                <v-simple-table class="elevation-3">
                    <template v-slot:default>
                        <draggable tag="tbody" @update="update" v-model="banners">
                            <tr v-for="banner in banners" :key="banner.id">
                                <td>
                                    <v-img :src="`${$config.app.storageUrl}/${banner.images.desktop}`" />
                                </td>
                                <td>{{ banner.name }}</td>
                            </tr>
                        </draggable>
                    </template>
                </v-simple-table>
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from "~/components/common/PageHeader";
import Banner from "@/modules/banner/models/Banner";
import draggable from "vuedraggable";

export default {
    components: {
        PageHeader,
        draggable,
    },
    data() {
        return {
            page: null,
            banners: [],
            loading: false,
            breadcrumbs: [
                { text: 'Список баннеров', to: { name: 'banners.index' } },
                { text: 'Сортировка' },
            ],
        };
    },
    computed: {
        bannerIds() {
            return this.banners.map(banner => banner.id);
        }
    },
    created() {
        if(this.$route.query.page) {
            this.changePage(this.$route.query.page);
        }
    },
    methods: {
        async changePage(page) {
            this.loading = true;
            this.page = page;
            this.banners = await Banner.select('id', 'name', 'images')
                .where('page', page)
                .orderBy('position')
                .params({
                    'page[size]': 100,
                })
                .$get();
            this.loading = false;
        },
        async update() {
            try {
                let position = 0;
                await this.$axios.post(`/admin/banners/sort`, {
                    banners: this.banners.map(banner => ({
                        id: banner.id,
                        position: ++position,
                    })),
                });
                this.$snackbar(`Позиции баннеров успешно сохранены`);
            }
            catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
    },
};
</script>
