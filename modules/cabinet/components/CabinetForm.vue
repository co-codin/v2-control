<template>
    <v-form @submit.prevent="save">
        <category-tree-search-field
            :value="form.category_id"
            label="Категория"
            :error-messages="form.errors.get('category_id')"
            :error="form.errors.has('category_id')"
            name="category_id"
            :multiple="false"
            class="mb-1"
            @input="(value) => updateField({ field: 'category_id', value })"
        />
        <v-text-field
            :value="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
            @input="
                (value) => {
                    updateField({ field: 'name', value });
                    updateSlug();
                }
            "
        />
        <v-text-field
            :value="form.slug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
            :rules="slugRules"
            :loading="isUpdatingSlug"
            append-icon="mdi-refresh"
            @input="(value) => updateField({ field: 'slug', value })"
            @click:append="
                (value) => {
                    updateField({ field: 'slug', value: null });
                    updateSlug();
                }
            "
        />

        <wysiwyg-field
            :value="form.welcome_text"
            class="mt-2"
            label="Приветственный текст"
            :error-messages="form.errors.get('welcome_text')"
            :error="form.errors.has('welcome_text')"
            @input="(value) => updateField({ field: 'welcome_text', value })"
        />

        <wysiwyg-field
            :value="form.full_description"
            class="mt-2"
            label="Подробное описание"
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
            @input="(value) => updateField({ field: 'full_description', value })"
        />

        <file-field
            :value="form.image"
            label="Фотография"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            prepend-icon="mdi-image"
            @input="
                (value) => {
                    updateField({ field: 'image', value });
                    updateField({ field: 'is_image_changed', value: true });
                }
            "
            @delete="
                () => {
                    updateField({ field: 'is_image_changed', value: true });
                    updateField({ field: 'image', value: null });
                }
            "
        />

        <v-text-field
            type="number"
            :value="form.view_num"
            label="Количество просмотров"
            :error-messages="form.errors.get('view_num')"
            :error="form.errors.has('view_num')"
            @input="(value) => updateField({ field: 'view_num', value })"
        />

        <v-select
            v-if="isUpdating"
            :value="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
            @change="(value) => updateField({ field: 'status', value })"
        />

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { debounce } from 'lodash';
import slugify from 'slugify';
import WysiwygField from '~/components/forms/WysiwygField';
import FileField from '~/components/forms/FileField';
import { statusLabels } from '~/enums';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';

export default {
    components: { CategoryTreeSearchField, FileField, WysiwygField },
    props: {
        isUpdating: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        statusLabels,
        slugRules: [
            (v) => {
                if (v && /^[a-zA-Z0-9\-\_]$/.test(v)) {
                    return true;
                }
                return false;
            },
        ],
        isUpdatingSlug: false,
    }),
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
            form: 'forms/cabinet/form',
        }),
    },
    methods: {
        ...mapActions({
            updateCabinet: 'forms/cabinet/updateCabinet',
            createCabinet: 'forms/cabinet/createCabinet',
        }),
        ...mapMutations({
            updateField: 'forms/cabinet/UPDATE_FIELD',
            closeAllPanels: 'helper/closeAllPanels',
            fillErrors: 'forms/cabinet/FILL_ERRORS',
        }),
        updateSlug: debounce(async function () {
            if (this.isUpdating && this.form.slug) {
                return;
            }
            this.isUpdatingSlug = true;

            let slug = slugify(this.form.name, { lower: true });
            slug = slug.replace(/[^a-z0-9-]/gi, '');

            await this.updateField({ field: 'slug', value: slug });

            this.isUpdatingSlug = false;
        }, 200),
        async save() {
            try {
                if (this.isUpdating) {
                    await this.updateCabinet(this.cabinet.id);
                    this.$snackbar(`Кабинет успешно обновлен`);
                    this.closeAllPanels();
                    this.$nuxt.refresh();
                } else {
                    await this.createCabinet();
                    this.$snackbar(`Кабинет успешно создан`);
                    await this.$router.push({ name: 'cabinets.index' });
                }
            } catch (e) {
                const errors = e?.response?.data?.errors;
                if (errors) {
                    this.fillErrors(errors);
                }
                this.$snackbar(`Произошла ошибка при обновлении категорий: ${e.message}`);
            }
        },
    },
};
</script>
