<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-menu
            ref="menu_published_at"
            v-model="menu_published_at"
            :close-on-content-click="false"
            :return-value.sync="form.published_at"
            transition="scale-transition"
            offset-y
            min-width="290px"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="form.published_at"
                    label="Дата"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :error-messages="form.errors.get('published_at')"
                    :error="form.errors.has('published_at')"
                    v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker
                v-model="form.published_at"
                no-title
                scrollable
                locale="ru-RU"
            >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu_published_at = false">Отмена</v-btn>
                <v-btn text color="primary" @click="$refs.menu_published_at.save(form.published_at)">OK</v-btn>
            </v-date-picker>
        </v-menu>

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

        <v-switch
            v-model="form.is_in_home"
            label="Отображать на главной"
            :error-messages="form.errors.get('is_in_home')"
            :error="form.errors.has('is_in_home')"
            inset
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
import FileField from '~/components/forms/FileField';
import { statusLabels } from '~/enums';
import WysiwygField from "~/components/forms/WysiwygField";

export default {
    components: {
        FileField,
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
        form: null,
        statusLabels,
        menu_published_at: false,
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
