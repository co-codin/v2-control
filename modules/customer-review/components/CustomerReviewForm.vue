<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.position"
            label="Должность"
            :error-messages="form.errors.get('position')"
            :error="form.errors.has('position')"
        />

        <v-text-field
            v-model="form.author"
            label="Автор"
            :error-messages="form.errors.get('author')"
            :error="form.errors.has('author')"
        />

        <wysiwyg-field
            v-model="form.comment"
            label="Коментарий"
            :error-messages="form.errors.get('comment')"
            :error="form.errors.has('comment')"
        />

        <v-switch
            v-model="form.is_in_home"
            label="Отображать на главной"
            :error-messages="form.errors.get('is_in_home')"
            :error="form.errors.has('is_in_home')"
            inset
        />

        <v-select
            v-model="form.type"
            label="Тип"
            :items="typeLabels"
            :error-messages="form.errors.get('type')"
            :error="form.errors.has('type')"
        />

        <file-field
            v-model="form.logo"
            label="Логотип"
            :error-messages="form.errors.get('logo')"
            :error="form.errors.has('logo')"
            @input="form.is_logo_changed = true"
            @delete="form.logo = null; form.is_logo_changed = true"
        />

        <file-field
            v-model="form.review_file"
            :is-image="false"
            label="Отзыв в формате PDF"
            :error-messages="form.errors.get('review_file')"
            :error="form.errors.has('review_file')"
            prepend-icon="mdi-image"
            @input="form.is_review_file_changed = true"
            @delete="form.review_file = null; form.is_review_file_changed = true"
        />

        <v-text-field
            v-model="form.video"
            prepend-icon="mdi-youtube"
            label="Видеообзор"
            :error-messages="form.errors.get('video')"
            :error="form.errors.has('video')"
            :rules="urlRules"
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
import WysiwygField from '~/components/forms/WysiwygField';
import FileField from '~/components/forms/FileField';
import { urlRules } from '~/enums';

export default {
    components: { FileField, WysiwygField },
    props: {
        customerReview: {
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
            company_name: null,
            position: null,
            author: null,
            type: null,
            comment: null,
            is_in_home: false,
            logo: null,
            is_logo_changed: false,
            review_file: null,
            is_review_file_changed: false,
            video: '',
        },
        typeLabels: [
            { value: 1, text: 'Гос' },
            { value: 2, text: 'Частное лицо' },
            { value: 3, text: 'Частный центр' },
        ],
        form: null,
        urlRules,
    }),
    watch: {
        customerReview(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.customerReview || {});
    },
};
</script>
