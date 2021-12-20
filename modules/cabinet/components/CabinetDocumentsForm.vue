<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels v-if="form">
            <v-expansion-panel v-for="(document, index) in form.documents" :key="'document-' + index">
                <v-expansion-panel-header class="title">
                    #{{ index + 1 }}. {{ document.name || '(без названия)' }}
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
                                                label="Название группы"
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
                                            <v-divider class="my-2"/>
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
                                                <draggable style="width: 100%">
                                                    <v-expansion-panel
                                                        v-for="(doc, i) in document.docs"
                                                        :key="'doc-' + i"
                                                    >
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
                                                                    form.errors.get(
                                                                        `documents.${index}.docs.${i}.source`
                                                                    )
                                                                "
                                                                :error="
                                                                    form.errors.has(
                                                                        `documents.${index}.docs.${i}.source`
                                                                    )
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

                                                            <template v-if="doc.source === 2">
                                                                <v-row v-if="doc.file">
                                                                    <v-col class="pt-2">
                                                                        <v-card>
                                                                            <v-card-title>{{ doc.file }}</v-card-title>
                                                                            <v-card-actions>
                                                                                <v-btn icon @click="openFile(doc.file)">
                                                                                    <external-link-icon />
                                                                                </v-btn>
                                                                                <v-spacer />
                                                                                <v-btn icon @click="copyFileLink(doc.file)">
                                                                                    <copy-icon />
                                                                                </v-btn>
                                                                                <v-spacer />
                                                                                <v-btn
                                                                                    icon
                                                                                    @click="updateField({ field: `documents.${index}.docs.${i}.file`, value: null})"
                                                                                >
                                                                                    <trash-icon width="26" />
                                                                                </v-btn>
                                                                            </v-card-actions>
                                                                        </v-card>
                                                                    </v-col>
                                                                </v-row>
                                                                <file-uploader v-else :only-images="false" @upload="updateField({ field: `documents.${index}.docs.${i}.file`, value: $event.file})" />
                                                            </template>

<!--                                                            <file-field-->
<!--                                                                v-if="doc.source === 2"-->
<!--                                                                :is-image="false"-->
<!--                                                                :value="doc.file"-->
<!--                                                                label="Файл"-->
<!--                                                                :error-messages="-->
<!--                                                                    form.errors.get(`documents.${index}.docs.${i}.file`)-->
<!--                                                                "-->
<!--                                                                :error="-->
<!--                                                                    form.errors.has(`documents.${index}.docs.${i}.file`)-->
<!--                                                                "-->
<!--                                                                @delete="-->
<!--                                                                    (value) => {-->
<!--                                                                        updateField({-->
<!--                                                                            field: `documents.${index}.docs.${i}.file`,-->
<!--                                                                            value: null,-->
<!--                                                                        });-->
<!--                                                                    }-->
<!--                                                                "-->
<!--                                                                @input="-->
<!--                                                                    (value) => {-->
<!--                                                                        updateField({-->
<!--                                                                            field: `documents.${index}.docs.${i}.file`,-->
<!--                                                                            value,-->
<!--                                                                        });-->
<!--                                                                    }-->
<!--                                                                "-->
<!--                                                            />-->
                                                            <v-divider class="my-2"/>
                                                            <div class="text-center">
                                                                <v-btn
                                                                    small
                                                                    class="white--text"
                                                                    color="red"
                                                                    @click="removeDocument({ index, i })"
                                                                >
                                                                    Удалить документ
                                                                </v-btn>
                                                            </div>
                                                        </v-expansion-panel-content>
                                                    </v-expansion-panel>
                                                </draggable>
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
            <v-btn link small color="primary" outlined @click="addDocumentGroup"> Добавить группу</v-btn>
        </div>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import draggable from 'vuedraggable';
import {mapActions, mapGetters, mapMutations} from 'vuex';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import DocumentGroupForm from '~/components/forms/DocumentGroupForm';
import FileUploader from "~/components/FileUploader";
import TrashIcon from '~/components/heroicons/TrashIcon';
import EyeIcon from '~/components/heroicons/EyeIcon';
import CopyIcon from '~/components/heroicons/CopyIcon';
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';

export default {
    components: {
        DocumentGroupForm,
        EntityAutocompleteField,
        draggable,
        FileUploader,
        EyeIcon,
        ExternalLinkIcon,
        CopyIcon,
        TrashIcon,
    },
    data: () => ({
        sourceLabels: [
            {value: 1, text: 'Ссылка'},
            {value: 2, text: 'Файл'},
        ],
        typeLabels: [
            {value: 1, text: 'Брошюра'},
            {value: 5, text: 'Инструкция'},
            {value: 6, text: 'Каталог'},
            {value: 7, text: 'Стандарты оснащения'},
            {value: 4, text: 'Технические характеристики'},
            {value: 3, text: 'Сертификат ДС'},
            {value: 2, text: 'Сертификат РУ'},
        ],
        tab: 'information',
        tabs: [
            {tab: 'О группе', key: 'information'},
            {tab: 'Документы', key: 'documents'},
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
            removeDocumentGroup: 'forms/cabinet/REMOVE_DOCUMENT_GROUP',
            addDocumentGroup: 'forms/cabinet/ADD_DOCUMENT_GROUP',
            removeDocument: 'forms/cabinet/REMOVE_DOCUMENT',
            addDocument: 'forms/cabinet/ADD_DOCUMENT',
        }),
        ...mapActions({
            updateCabinetDocuments: 'forms/cabinet/updateCabinetDocuments',
        }),
        async save() {
            try {
                await this.updateCabinetDocuments(this.cabinet.id);
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
        openFile(file) {
            window.open(`${this.$config.app.storageUrl}/${file}`);
        },
        async copyFileLink(file) {
            await navigator.clipboard.writeText(file);
        },
    },
};
</script>
