<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels v-if="form" v-model="documentPanels">
            <draggable v-model="form.documents" class="width-full">
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
                                                    v-model="document.name"
                                                    label="Название группы"
                                                    dense
                                                    :error-messages="form.errors.get(`documents.${index}.name`)"
                                                    :error="form.errors.has(`documents.${index}.name`)"
                                                />
                                                <v-divider class="my-2" />
                                                <div class="text-center">
                                                    <v-btn
                                                        small
                                                        class="white--text"
                                                        color="red"
                                                        @click="
                                                            form.documents.splice(index, 1);
                                                            documentPanels = null;
                                                        "
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
                                                    <draggable v-model="document.docs" class="width-full">
                                                        <v-expansion-panel
                                                            v-for="(doc, i) in document.docs"
                                                            :key="'doc-' + i"
                                                        >
                                                            <v-expansion-panel-header class="title">
                                                                {{ doc.name || getDocName(doc) || '(без названия)' }}
                                                            </v-expansion-panel-header>
                                                            <v-expansion-panel-content>
                                                                <v-select
                                                                    v-model="doc.type"
                                                                    label="Тип"
                                                                    :items="typeLabels"
                                                                    dense
                                                                    :error-messages="
                                                                        form.errors.get(
                                                                            `documents.${index}.docs.${i}.type`
                                                                        )
                                                                    "
                                                                    :error="
                                                                        form.errors.has(
                                                                            `documents.${index}.docs.${i}.type`
                                                                        )
                                                                    "
                                                                />
                                                                <v-text-field
                                                                    v-model="doc.name"
                                                                    label="Название"
                                                                    dense
                                                                    :error-messages="
                                                                        form.errors.get(
                                                                            `documents.${index}.docs.${i}.name`
                                                                        )
                                                                    "
                                                                    :error="
                                                                        form.errors.has(
                                                                            `documents.${index}.docs.${i}.name`
                                                                        )
                                                                    "
                                                                />
                                                                <v-select
                                                                    v-model="doc.source"
                                                                    label="Источник"
                                                                    :items="sourceLabels"
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
                                                                />
                                                                <v-text-field
                                                                    v-if="doc.source === 1"
                                                                    v-model="doc.link"
                                                                    label="Ссылка"
                                                                    dense
                                                                    :error-messages="
                                                                        form.errors.get(
                                                                            `documents.${index}.docs.${i}.link`
                                                                        )
                                                                    "
                                                                    :error="
                                                                        form.errors.has(
                                                                            `documents.${index}.docs.${i}.link`
                                                                        )
                                                                    "
                                                                />

                                                                <template v-if="doc.source === 2">
                                                                    <v-row v-if="doc.file">
                                                                        <v-col class="pt-2">
                                                                            <v-card>
                                                                                <v-card-title>{{
                                                                                    doc.file
                                                                                }}</v-card-title>
                                                                                <v-card-actions>
                                                                                    <v-btn
                                                                                        icon
                                                                                        @click="openFile(doc.file)"
                                                                                    >
                                                                                        <external-link-icon />
                                                                                    </v-btn>
                                                                                    <v-spacer />
                                                                                    <v-btn
                                                                                        icon
                                                                                        @click="copyFileLink(doc.file)"
                                                                                    >
                                                                                        <copy-icon />
                                                                                    </v-btn>
                                                                                    <v-spacer />
                                                                                    <v-btn
                                                                                        icon
                                                                                        @click="doc.file = null"
                                                                                    >
                                                                                        <trash-icon width="26" />
                                                                                    </v-btn>
                                                                                </v-card-actions>
                                                                            </v-card>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <file-uploader
                                                                        v-else
                                                                        :only-images="false"
                                                                        @upload="doc.file = $event.file"
                                                                    />
                                                                </template>
                                                                <v-divider class="my-2" />
                                                                <div class="text-center">
                                                                    <v-btn
                                                                        small
                                                                        class="white--text"
                                                                        color="red"
                                                                        @click="document.docs.splice(i, 1)"
                                                                    >
                                                                        Удалить документ
                                                                    </v-btn>
                                                                </div>
                                                            </v-expansion-panel-content>
                                                        </v-expansion-panel>
                                                    </draggable>
                                                </v-expansion-panels>
                                                <div class="mt-2">
                                                    <v-btn
                                                        link
                                                        small
                                                        color="primary"
                                                        outlined
                                                        @click="addDoc(document)"
                                                    >
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
            </draggable>
        </v-expansion-panels>
        <div class="mt-2">
            <v-btn link small color="primary" outlined @click="addGroup"> Добавить группу</v-btn>
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
import { mapGetters, mapMutations } from 'vuex';
import Form from 'form-backend-validation';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import DocumentGroupForm from '~/components/forms/DocumentGroupForm';
import FileUploader from '~/components/FileUploader';
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
        documentPanels: null,
        formDefaults: {
            documents: [],
        },
        form: null,
        sourceLabels: [
            { value: 1, text: 'Ссылка' },
            { value: 2, text: 'Файл' },
        ],
        typeLabels: [
            { value: 1, text: 'Брошюра' },
            { value: 5, text: 'Инструкция' },
            { value: 6, text: 'Каталог' },
            { value: 7, text: 'Стандарты оснащения' },
            { value: 4, text: 'Технические характеристики' },
            { value: 3, text: 'Сертификат ДС' },
            { value: 2, text: 'Сертификат РУ' },
        ],
        tab: 'information',
        tabs: [
            { tab: 'О группе', key: 'information' },
            { tab: 'Документы', key: 'documents' },
        ],
    }),
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
        }),
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.cabinet || {});
    },
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        async save() {
            try {
                await this.form.put(`/admin/cabinets/${this.cabinet.id}/documents`);
                this.$snackbar(`Документы успешно обновлены`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обновлении документов: ${e.message}`);
            }
        },
        addGroup() {
            if (!this.form.documents || !Array.isArray(this.form.documents)) {
                this.form.documents = [];
            }
            this.form.documents.push({
                name: null,
                docs: [],
            });
        },
        addDoc(document) {
            if (!document.docs || !Array.isArray(document.docs)) {
                document.docs = [];
            }
            document.docs.push({
                link: null,
                file: null,
                source: null,
                type: null,
                name: null,
            });
        },
        openFile(file) {
            window.open(`${this.$config.app.storageUrl}/${file}`);
        },
        async copyFileLink(file) {
            await navigator.clipboard.writeText(file);
        },
        getDocName(doc) {
            if (doc.name) {
                return doc.name;
            }
            if (!doc.type) {
                return null;
            }
            return `${this.typeLabels.find((type) => type.value === doc.type)?.text ?? ''}`;
        },
    },
};
</script>
