<template>
    <v-form @submit.prevent="saveDocuments">
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header class="title"> Регулирующие документы </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-tabs v-model="tab" grow background-color="transparent">
                            <v-tab v-for="item in tabs" :key="item.key">
                                {{ item.tab }}
                            </v-tab>

                            <v-tabs-items v-model="tab" style="width: 100%">
                                <v-tab-item key="information">
                                    <v-card flat>
                                        <v-card-text>
                                            <v-text-field label="Название" dense />
                                            <v-divider class="my-2" />
                                            <div class="text-center">
                                                <v-btn small class="white--text" color="red"> Удалить группу </v-btn>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab-item key="documents">
                                    <v-card flat>
                                        <v-card-text>
                                            <v-expansion-panels>
                                                <v-expansion-panel>
                                                    <v-expansion-panel-header class="title">
                                                        Постановление Правительства РФ от 16 апреля 2012 г. N 291
                                                    </v-expansion-panel-header>
                                                    <v-expansion-panel-content>
                                                        <v-select label="Тип" :items="typeLabels" dense />
                                                        <v-text-field label="Название" dense />
                                                        <v-select
                                                            label="Источник"
                                                            :items="sourceLabels"
                                                            :value="2"
                                                            dense
                                                        />
                                                        <v-text-field label="Ссылка" dense />
                                                        <v-divider class="my-2" />
                                                        <div class="text-center">
                                                            <v-btn small class="white--text" color="red">
                                                                Удалить документ
                                                            </v-btn>
                                                        </div>
                                                    </v-expansion-panel-content>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                            <div class="mt-2">
                                                <v-btn link small color="primary" outlined> Добавить документ </v-btn>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-tabs>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div class="mt-2">
            <v-btn link small color="primary" outlined> Добавить группу </v-btn>
        </div>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
export default {
    data: () => ({
        documents: [
            {
                name: null,
                type: 1, // File
                value: 'documents/document1.pdf', // or link, eg "https://yandex.ru"
            },
        ],
        sourceLabels: [
            { id: 1, text: 'Файл' },
            { id: 2, text: 'Ссылка' },
        ],
        typeLabels: [
            { id: 1, text: 'Брошюра' },
            { id: 2, text: 'Сертификат РУ' },
            { id: 3, text: 'Сертификат ДС' },
            { id: 4, text: 'Технические характеристики' },
            { id: 5, text: 'Инструкция' },
            { id: 6, text: 'Каталог' },
            { id: 7, text: 'Стандарты оснащения' },
        ],
        tab: null,
        tabs: [
            { tab: 'О группе', key: 'information' },
            { tab: 'Документы', key: 'documents' },
        ],
    }),
    methods: {
        saveDocuments() {
            alert('saving');
        },
    },
};
</script>
