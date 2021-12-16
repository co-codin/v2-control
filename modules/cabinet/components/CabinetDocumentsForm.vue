<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels>
            <v-expansion-panel v-for="(document, index) in form.documents" :key="'document-' + index">
                <v-expansion-panel-header class="title">
                    #{{ index + 1 }}. {{ document.document_group_name || '(без названия)' }}
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
                                            <entity-autocomplete-field
                                                :value="document.document_group_id"
                                                url="/document-groups"
                                                item-value="id"
                                                item-text="name"
                                                :query-params="{ sort: 'name' }"
                                                :error-messages="
                                                    form.errors.get(`documents.${index}.document_group_id`)
                                                "
                                                :error="form.errors.has(`documents.${index}.document_group_id`)"
                                                placeholder="Введите название группу документа"
                                                label="Группа документа"
                                                filter-column="id"
                                                search-column="name"
                                                hide-no-data
                                                cache-items
                                                @input="
                                                    (value) =>
                                                        updateField({
                                                            field: `documents.${index}.document_group_id`,
                                                            value,
                                                        })
                                                "
                                            />
                                            <v-btn small @click="openDocumentGroupPopup"
                                                >Создать новую группу документа</v-btn
                                            >
                                            <v-divider class="my-2" />
                                            <div class="text-center">
                                                <v-btn
                                                    small
                                                    class="white--text"
                                                    color="red"
                                                    @click="removeDocumentGroup"
                                                >
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
                                                <v-expansion-panel v-for="(doc, i) in document.docs" :key="'doc-' + i">
                                                    <v-expansion-panel-header class="title">
                                                        {{ doc.name || '(без названия)' }}
                                                    </v-expansion-panel-header>
                                                    <v-expansion-panel-content>
                                                        <v-select
                                                            label="Тип"
                                                            :items="typeLabels"
                                                            :value="doc.type"
                                                            dense
                                                            :error-messages="
                                                                form.errors.get(`documents.${index}.docs.${i}.type`)
                                                            "
                                                            :error="
                                                                form.errors.has(`documents.${index}.docs.${i}.type`)
                                                            "
                                                            @change="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `documents.${index}.docs.${i}.type`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <v-text-field
                                                            label="Название"
                                                            :value="doc.name"
                                                            dense
                                                            :error-messages="
                                                                form.errors.get(`documents.${index}.docs.${i}.name`)
                                                            "
                                                            :error="
                                                                form.errors.has(`documents.${index}.docs.${i}.name`)
                                                            "
                                                            @input="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `documents.${index}.docs.${i}.name`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <v-select
                                                            label="Источник"
                                                            :items="sourceLabels"
                                                            :value="doc.source"
                                                            dense
                                                            :error-messages="
                                                                form.errors.get(`documents.${index}.docs.${i}.source`)
                                                            "
                                                            :error="
                                                                form.errors.has(`documents.${index}.docs.${i}.source`)
                                                            "
                                                            @change="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `documents.${index}.docs.${i}.source`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <v-text-field
                                                            v-if="doc.source === 1"
                                                            label="Ссылка"
                                                            :value="doc.link"
                                                            dense
                                                            :rules="urlRules"
                                                            :error-messages="
                                                                form.errors.get(`documents.${index}.docs.${i}.link`)
                                                            "
                                                            :error="
                                                                form.errors.has(`documents.${index}.docs.${i}.link`)
                                                            "
                                                            @input="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `documents.${index}.docs.${i}.link`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <file-field
                                                            v-if="doc.source === 2"
                                                            :is-image="false"
                                                            :value="doc.file"
                                                            label="Файл"
                                                            :error-messages="`documents.${index}.docs.${i}.file`"
                                                            :error="`documents.${index}.docs.${i}.file`"
                                                            @input="
                                                                (value) => {
                                                                    updateField({
                                                                        field: `documents.${index}.docs.${i}.file`,
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
                                                                @click="removeDocument(index, i)"
                                                            >
                                                                Удалить документ
                                                            </v-btn>
                                                        </div>
                                                    </v-expansion-panel-content>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                            <div class="mt-2">
                                                <v-btn link small color="primary" outlined @click="addDocument(index)">
                                                    Добавить документ
                                                </v-btn>
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
            <v-btn link small color="primary" outlined @click="addDocumentGroup"> Добавить группу </v-btn>
        </div>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
        <v-dialog v-model="newDocumentGroupPopup" max-width="600" width="600">
            <v-card tile outlined>
                <v-card-title> Создание группу документа </v-card-title>
                <v-card-text>
                    <document-group-form @send="createDocumentGroup" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import FileField from '~/components/forms/FileField';
import { urlRules } from '~/enums';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import DocumentGroupForm from '~/components/forms/DocumentGroupForm';

export default {
    components: { DocumentGroupForm, EntityAutocompleteField, FileField },
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
        newDocumentGroupPopup: false,
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
            removeDocumentGroup: 'forms/cabinet/REMOVE_DOCUMENT_GROUP',
            addDocumentGroup: 'forms/cabinet/ADD_DOCUMENT_GROUP',
            removeDocument: 'forms/cabinet/REMOVE_DOCUMENT',
            addDocument: 'forms/cabinet/ADD_DOCUMENT',
        }),
        ...mapActions({
            createDocuments: 'forms/cabinet/createDocuments',
        }),
        openDocumentGroupPopup() {
            this.newDocumentGroupPopup = true;
        },
        async createDocumentGroup(form) {
            try {
                await form.post('/admin/document-groups');
                this.newDocumentGroupPopup = false;
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании характеристики: ${e.message}`);
            }
        },
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
