<template>
    <v-form @submit.prevent="$emit('send', form)">
        <date-picker-field
            v-model="form.published_at"
            label="Дата публикации"
            :error-messages="form.errors.get('published_at')"
            :error="form.errors.has('published_at')"
        />

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

        <AutocompleteSearchField
            v-if="isUpdating"
            v-model="form.products"
            :error-messages="form.errors.get('form.products')"
            :error="form.errors.has('form.products')"
            url="/products"
            name="products"
            label="Товар"
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
            published_at: null,
            short_description: null,
            full_description: null,
            city_id: null,
            products: null,
        },
        form: null,
        statusLabels,
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
    methods: {
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
