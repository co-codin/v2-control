<template>
    <v-form @submit.prevent="$emit('send', form)">
        <date-picker-field
            v-model="form.published_at"
            label="Дата"
            :error-messages="form.errors.get('published_at')"
            :error="form.errors.has('published_at')"
        />

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

        <v-combobox
            v-model="form.category"
            label="Рубрика"
            :error-messages="form.errors.get('category')"
            :error="form.errors.has('category')"
            :items="categories"
            :return-object="false"
            dense
        />

        <file-field
            v-model="form.image"
            label="Фотография"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            @input="form.is_image_changed = true"
            @delete="
                form.image = null;
                form.is_image_changed = true;
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

        <v-switch
            v-model="form.is_in_home"
            label="Отображать на главной"
            :error-messages="form.errors.get('is_in_home')"
            :error="form.errors.has('is_in_home')"
            inset
        />

        <v-text-field
            v-model="form.view_num"
            type="number"
            label="Количество просмотров"
            :error-messages="form.errors.get('view_num')"
            :error="form.errors.has('view_num')"
            required
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
import FileField from '~/components/forms/FileField';
import { statusLabels } from '~/enums';
import WysiwygField from '~/components/forms/WysiwygField';
import DatePickerField from '~/components/forms/DatePickerField';

export default {
    components: {
        FileField,
        WysiwygField,
        DatePickerField,
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
            category: null,
            status: 1,
            image: null,
            is_image_changed: false,
            is_in_home: false,
            short_description: null,
            full_description: null,
            published_at: null,
            view_num: 1,
        },
        form: null,
        statusLabels,
        categories: [
            { value: 'Новость', text: 'Новость' },
            { value: 'Статья', text: 'Статья' },
            { value: 'Об оборудовании', text: 'Об оборудовании' },
            { value: 'Новости компании', text: 'Новости компании' },
            { value: 'Перевод', text: 'Перевод' },
            { value: 'Пересказ', text: 'Пересказ' },
            { value: 'Акции', text: 'Акции' },
        ],
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
    },
};
</script>
