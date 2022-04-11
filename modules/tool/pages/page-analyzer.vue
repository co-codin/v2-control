<template>
    <div>
        <page-header h1="Анализ страницы" :breadcrumbs="breadcrumbs" />
        <div>
            <v-text-field solo placeholder="Введите URL" />
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header class="title">Мета теги</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div class="mt-2">
                            <div><strong>Title: </strong> Медицинское оборудование MEDEQ</div>
                            <div><strong>Description: </strong> Медицинское оборудование MEDEQ</div>
                            <div><strong>H1: </strong> Медицинское оборудование MEDEQ</div>
                            <div><strong>H2: </strong> Медицинское оборудование MEDEQ</div>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header class="title">Изображения</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At corporis deserunt dolor dolore
                        eligendi enim in nobis nulla, obcaecati, officia, perspiciatis quis ratione recusandae repellat
                        sit sunt unde. Accusamus, aliquam, amet consectetur delectus expedita impedit, provident quaerat
                        quo similique sit soluta veritatis vitae voluptates. Dolor mollitia, nostrum? Aliquam aperiam,
                        harum ipsum minima mollitia neque nobis officia perspiciatis quam quisquam. Accusantium aliquid
                        aperiam architecto asperiores aut cumque distinctio dolore est et facere harum iste, iusto
                        laboriosam laborum magnam minus nam obcaecati optio quae, ratione reiciendis repellat
                        repellendus sunt suscipit unde velit veniam. Autem eaque et eveniet libero maxime natus saepe
                        totam?
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header class="title">Техническая информация</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div class="mt-2">
                            <div><strong>Время ответа от сервера: </strong> 1 сек.</div>
                            <div><strong>Время полной загрузки страницы: </strong> 10 сек.</div>
                            <div><strong>Вес страницы: </strong> 1249 Кб</div>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [{ text: 'Инструменты', to: { name: 'tools.index' } }, { text: 'Анализ страницы' }],
    }),
};
</script>
