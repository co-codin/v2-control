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
            />
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

        <file-field
            v-model="form.image"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            @input="form.is_image_changed = true"
            @delete="form.image = null"
        />

        <wysiwyg-field
            label="Короткое описание"
            :error-messages="form.errors.get('short_description')"
            :error="form.errors.has('short_description')"
            v-model="form.short_description"
        />

        <wysiwyg-field
            label="Подробное описание"
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
            v-model="form.full_description"
        />

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
import FileField from '~/components/forms/FileField';
import { statusLabels } from '~/enums';
import WysiwygField from "~/components/forms/WysiwygField";

export default {
    components: {
        FileField,
        flatPickr,
        WysiwygField,
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
            dateFormat: 'Y-m-d',
            enableTime: true,
            locale: Russian,
        },
        form: null,
        statusLabels,
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
        this.form.published_at = this.$dayjs(this.news.published_at, 'DD-MM-YYYY').format('YYYY-MM-DD');
    },
};
</script>
