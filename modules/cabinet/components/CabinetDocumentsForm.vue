<template>
    <v-form @submit.prevent="save">
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import FileField from '~/components/forms/FileField';
import { urlRules } from '~/enums';

export default {
    components: { FileField },
    data: () => ({
        sourceLabels: [
            { value: 1, text: 'Ссылка' },
            { value: 2, text: 'Файл' },
        ],
        typeLabels: [
            { value: 1, text: 'Брошюра' },
            { value: 2, text: 'Сертификат РУ' },
            { value: 3, text: 'Сертификат ДС' },
            { value: 4, text: 'Технические характеристики' },
            { value: 5, text: 'Инструкция' },
            { value: 6, text: 'Каталог' },
            { value: 7, text: 'Стандарты оснащения' },
        ],
        tab: null,
        tabs: [
            { tab: 'О группе', key: 'information' },
            { tab: 'Документы', key: 'documents' },
        ],
        urlRules,
    }),
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
            form: 'forms/cabinet/form',
        }),
    },
    methods: {
        ...mapMutations({
            updateField: 'forms/cabinet/UPDATE_FIELD',
            fillErrors: 'forms/cabinet/FILL_ERRORS',
            closeAllPanels: 'helper/closeAllPanels',
            removeDocument: 'forms/cabinet/REMOVE_DOCUMENT',
            addDocument: 'forms/cabinet/ADD_DOCUMENT',
        }),
        ...mapActions({
            createDocuments: 'forms/cabinet/createDocuments',
        }),
        async save() {
            if (this.form.documents.length) {
                try {
                    await this.createDocuments(this.cabinet.id);
                    this.$snackbar(`Документы успешно обновлены`);
                    this.closeAllPanels();
                } catch (e) {
                    const errors = e?.response?.data?.errors;
                    if (errors) {
                        this.fillErrors(errors);
                    }
                    this.$snackbar(`Произошла ошибка при обновлении документов: ${e.message}`);
                }
            } else {
                this.$snackbar(`Документы должны заполнены`);
            }
        },
    },
};
</script>
