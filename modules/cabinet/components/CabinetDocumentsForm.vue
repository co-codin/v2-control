<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels>
            <v-expansion-panel v-for="(document, index) in form.documents" :key="'document-' + index">
                <v-expansion-panel-header class="title">
                    #{{ index + 1 }}. {{ document.group_name || '(без названия)' }}
                </v-expansion-panel-header>
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
                                            <v-text-field
                                                label="Название"
                                                dense
                                                :value="document.group_name"
                                                :error-messages="form.errors.get(`documents.${index}.group_name`)"
                                                :error="form.errors.has(`documents.${index}.group_name`)"
                                                @input="
                                                    (value) =>
                                                        updateField({
                                                            field: `documents.${index}.group_name`,
                                                            value,
                                                        })
                                                "
                                            />
                                            <v-divider class="my-2" />
                                            <div class="text-center">
                                                <v-btn small class="white--text" color="red" @click="removeDocument">
                                                    Удалить группу
                                                </v-btn>
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
                                                        {{ document.name || '(без названия)' }}
                                                    </v-expansion-panel-header>
                                                    <v-expansion-panel-content>
                                                        <v-select
                                                            label="Тип"
                                                            :items="typeLabels"
                                                            :value="document.type"
                                                            dense
                                                            :error-messages="form.errors.get(`documents.${index}.type`)"
                                                            :error="form.errors.has(`documents.${index}.type`)"
                                                            @change="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `documents.${index}.type`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <v-text-field
                                                            label="Название"
                                                            :value="document.name"
                                                            dense
                                                            :error-messages="form.errors.get(`documents.${index}.name`)"
                                                            :error="form.errors.has(`documents.${index}.name`)"
                                                            @input="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `documents.${index}.name`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <v-select
                                                            label="Источник"
                                                            :items="sourceLabels"
                                                            :value="document.source"
                                                            dense
                                                            :error-messages="
                                                                form.errors.get(`documents.${index}.source`)
                                                            "
                                                            :error="form.errors.has(`documents.${index}.source`)"
                                                            @change="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `documents.${index}.source`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <v-text-field
                                                            v-if="document.source === 1"
                                                            label="Ссылка"
                                                            :value="document.link"
                                                            dense
                                                            :error-messages="form.errors.get(`documents.${index}.link`)"
                                                            :error="form.errors.has(`documents.${index}.link`)"
                                                            @input="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `documents.${index}.link`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <file-field
                                                            v-if="document.source === 2"
                                                            :is-image="false"
                                                            :value="document.file"
                                                            label="Файл"
                                                            :error-messages="form.errors.get('image')"
                                                            :error="form.errors.has('image')"
                                                            @input="
                                                                (value) => {
                                                                    updateField({
                                                                        field: `documents.${index}.file`,
                                                                        value,
                                                                    });
                                                                }
                                                            "
                                                        />
                                                        <v-divider class="my-2" />
                                                        <div class="text-center">
                                                            <v-btn
                                                                small
                                                                class="white--text"
                                                                color="red"
                                                                @click="removeDocument(index)"
                                                            >
                                                                Удалить документ
                                                            </v-btn>
                                                        </div>
                                                    </v-expansion-panel-content>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
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
            <v-btn link small color="primary" outlined @click="addDocument"> Добавить документ </v-btn>
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
        },
    },
};
</script>
