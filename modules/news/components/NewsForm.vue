<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-input
            label="Дата"
            dense
            :error-messages="form.errors.get('published_at')"
            :error="form.errors.has('published_at')"
        >
            <flat-pickr
                v-model="form.published_at"
                :config="configPicker"
                placeholder="Выберите дату"
                class="date-picker-input"
                name="published_at"
            >
            </flat-pickr>
        </v-input>

        <v-text-field
            v-model="form.name"
            label="Заголовок"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />

        <v-text-field
            v-model="form.slug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
        />

        <v-input
            label="Главная фотография"
            dense
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            @input="form.is_image_changed = true"
        >
            <file-uploader v-model="form.image" />
        </v-input>

        <v-input
            label="Короткое описание"
            dense
            :error-messages="form.errors.get('short_description')"
            :error="form.errors.has('short_description')"
        >
            <content-editor v-model="form.short_description" />
        </v-input>

        <v-input
            label="Полное описание"
            dense
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
        >
            <content-editor v-model="form.full_description" />
        </v-input>

        <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
        />

        <v-checkbox
            v-model="form.is_in_home"
            label="Отображать на главной"
            :error-messages="form.errors.get('is_in_home')"
            :error="form.errors.has('is_in_home')"
        />

        <v-text-field
            v-model="form.view_num"
            label="Количество просмотров"
            :error-messages="form.errors.get('view_num')"
            :error="form.errors.has('view_num')"
        />

        <slot name="buttons">
            <v-btn type="submit">Сохранить</v-btn>
        </slot>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import ContentEditor from '~/components/editors/ContentEditor';
import FileUploader from '~/components/FileUploader';

export default {
    components: {
        FileUploader,
        ContentEditor,
        flatPickr,
    },
    props: {
        news: {
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
            short_description: null,
            full_description: null,
            published_at: null,
            view_num: null,
        },
        configPicker: {
            dateFormat: 'Y-m-d H:i',
            enableTime: true,
            locale: Russian,
        },
        statusLabels: [
            { value: 1, text: 'Active' },
            { value: 2, text: 'Inactive' },
            { value: 3, text: 'Only By Url' },
        ],
        form: null,
    }),
    watch: {
        news(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.news || {});

        this.form.image = this.form.image ? `${this.$config.app.storageUrl}/${this.form.image}` : null;
    },
};
</script>
