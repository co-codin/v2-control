<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Основная информация</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-form @submit.prevent="$emit('send', form)">
                <v-text-field
                    v-model="form.name"
                    label="Название"
                    :error-messages="form.errors.get('name')"
                    :error="form.errors.has('name')"
                />

                <v-text-field
                    v-model="form.slug"
                    label="Ссылка"
                    :error-messages="form.errors.get('slug')"
                    :error="form.errors.has('slug')"
                />

                <v-text-field
                    v-model="form.website"
                    label="Сайт"
                    :error-messages="form.errors.get('website')"
                    :error="form.errors.has('website')"
                />

                <v-textarea
                    v-model="form.short_description"
                    label="Краткое описание"
                    :error-messages="form.errors.get('short_description')"
                    :error="form.errors.has('short_description')"
                />

                <v-input
                    label="Подробное описание"
                    :error-messages="form.errors.get('full_description')"
                    :error="form.errors.has('full_description')"
                >
                    <content-editor v-model="form.full_description" />
                </v-input>

                <v-switch
                    v-model="form.is_in_home"
                    label="Отображать на главной"
                    :error-messages="form.errors.get('is_in_home')"
                    :error="form.errors.has('is_in_home')"
                />

                <file-field
                    v-model="form.image"
                    label="Логотип"
                    :error-messages="form.errors.get('image')"
                    :error="form.errors.has('image')"
                    prepend-icon="mdi-image"
                    @input="form.is_image_changed = true"
                />

                <field-value-autocomplete
                    v-model="form.country_id"
                    label="Страна"
                    :error-messages="form.errors.get('country_id')"
                    :error="form.errors.has('country_id')"
                />

                <v-select
                    v-model="form.status"
                    label="Статус"
                    :items="statusLabels"
                    :error-messages="form.errors.get('status')"
                    :error="form.errors.has('status')"
                />

                <v-row class="expansion-panel-actions mt-5">
                    <v-col>
                        <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
import { Form } from 'form-backend-validation';
import FileField from '../../../components/forms/FileField';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';
import ContentEditor from '~/components/editors/ContentEditor';
import { statusLabels } from '~/enums';

export default {
    components: {
        FileField,
        FieldValueAutocomplete,
        ContentEditor,
    },
    props: {
        brand: {
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
            status: 1,
            image: null,
            is_image_changed: false,
            is_in_home: false,
            website: null,
            short_description: null,
            full_description: null,
            country_id: null,
        },
        form: null,
        statusLabels,
    }),
    watch: {
        brand(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.brand || {});
    },
};
</script>
