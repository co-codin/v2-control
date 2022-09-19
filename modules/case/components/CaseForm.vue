<template>
    <v-form @submit.prevent="sendForm">
        <entity-autocomplete-field
            v-model="form.city_id"
            url="/cities"
            item-value="id"
            item-text="name"
            :query-params="{ sort: 'name' }"
            :error-messages="form.errors.get('city_id')"
            :error="form.errors.has('city_id')"
            placeholder="Введите название города"
            label="Город"
            filter-column="id"
            search-column="name"
            hide-no-data
            cache-items
            hide-details="auto"
        />

        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
            @input="updateSlug"
        />

        <v-text-field
            v-model="form.slug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
            append-icon="mdi-refresh"
            @click:append="
                form.slug = null;
                updateSlug();
            "
        />

        <wysiwyg-field
            v-model="form.short_description"
            label="Короткое описание"
            :error-messages="form.errors.get('short_description')"
            :error="form.errors.has('short_description')"
        />

        <wysiwyg-field
            v-model="form.full_description"
            label="Подробное описание"
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
        />

        <div>
            <label class="v-label theme--light" :class="[form.errors.has('body') ? 'error--text' : '']" style="left: 0px; right: auto; position: relative;">Текст страницы</label>
            <div ref="editor" class="mt-2" style="width: 800px; height: 300px;"></div>
            <span v-if="form.errors.has('body')" style="color: red;">
                {{form.errors.get('body')}}
            </span>
        </div>

<!--        <wysiwyg-field-->
<!--            v-model="form.body"-->
<!--            label="Текст страницы"-->
<!--            :error-messages="form.errors.get('body')"-->
<!--            :error="form.errors.has('body')"-->
<!--        />-->

        <v-textarea
            v-model="form.summary"
            label="Что оснащено?"
            :error-messages="form.errors.get('summary')"
            :error="form.errors.has('summary')"
        />

        <v-textarea
            v-model="form.note"
            label="Заметка"
            :error-messages="form.errors.get('note')"
            :error="form.errors.has('note')"
            hint="Например: Поставка через дилера"
        />

        <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
        />

        <file-uploader
            v-if="!form.image"
            @upload="
                    form.image = $event.file;
                "
        />
        <file-field
            v-else
            v-model="form.image"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            prepend-icon="mdi-image"
            @delete="
                    form.image = null;
                "
        />

        <v-text-field
            v-model="form.released_year"
            type="number"
            label="Год реализации"
            :error-messages="form.errors.get('released_year')"
            :error="form.errors.has('released_year')"
        />

        <v-select
            v-model="form.released_quarter"
            label="Квартал реализации"
            :error-messages="form.errors.get(`released_quarter`)"
            :error="form.errors.has(`released_quarter`)"
            dense
            :items="quarters"
        />

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import { debounce } from 'lodash';
import slugify from 'slugify';
import WysiwygField from '~/components/forms/WysiwygField';
import DatePickerField from '~/components/forms/DatePickerField';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import FileField from '~/components/forms/FileField';
import FileUploader from '~/components/FileUploader'
import { statusLabels } from '~/enums';
import AutocompleteSearchField from '~/components/search/fields/AutocompleteSearchField'
import * as monaco from 'monaco-editor';

export default {
    components: {
        AutocompleteSearchField,
        FileUploader,
        FileField,
        EntityAutocompleteField,
        DatePickerField,
        WysiwygField,
    },
    props: {
        caseItem: {
            type: Object | null,
            default: () => ({}),
        },
        isUpdating: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        formDefaults: {
            name: null,
            slug: null,
            image: null,
            status: 1,
            short_description: null,
            full_description: null,
            body: null,
            summary: null,
            note: null,
            city_id: null,
            released_year: null,
            released_quarter: null,
        },
        editor: null,
        form: null,
        statusLabels,
        quarters: [
            {text: 'Первый квартал', value: 1},
            {text: 'Второй квартал', value: 2},
            {text: 'Третий квартал', value: 3},
            {text: 'четвертый квартал', value: 4},
        ]
    }),
    watch: {
        caseItem(value) {
            this.form.populate(value);
        },
    },
    async created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.caseItem || {});
    },
    async mounted() {
        const el = this.$refs.editor;
        const text = this.form.body ?? "<h1>Текст страницы</h1>"
        this.editor = monaco.editor.create(el, {
            value: text,
            language: "html",
            lineNumbers: 'off',
            minimap: {
                enabled: false
            }
        });
    },
    methods: {
        sendForm() {
            this.form.body = this.editor.getValue()
            this.$emit('send', this.form)
        },
        updateSlug: debounce(async function () {
            if (this.isUpdating && this.form.slug) {
                return;
            }
            this.isUpdatingSlug = true;
            let slug = slugify(this.form.name, { lower: true }).replace(/[^a-z0-9-]/gi, '');
            slug = slug.replace(/[^a-z0-9-]/gi, '');

            this.form.slug = slug;

            this.isUpdatingSlug = false;
        }, 200),
    },
};
</script>
