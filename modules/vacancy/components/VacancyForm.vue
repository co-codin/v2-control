<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
            @input="updateSlug"
        />

        <v-text-field
            v-model="form.slug"
            append-icon="mdi-refresh"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
            @click:append="
                form.slug = null;
                updateSlug();
            "
        />

        <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
        />

        <v-text-field
            v-model="form.experience"
            label="Опыт работы"
            :error-messages="form.errors.get('experience')"
            :error="form.errors.has('experience')"
        />

        <v-text-field
            v-model="form.timetable"
            label="График работы"
            :error-messages="form.errors.get('timetable')"
            :error="form.errors.has('timetable')"
        />

        <v-text-field
            v-model="form.occupation"
            label="Занятость"
            :error-messages="form.errors.get('occupation')"
            :error="form.errors.has('occupation')"
        />

        <wysiwyg-field
            v-model="form.short_description"
            label="Краткое описание"
            :error-messages="form.errors.get('short_description')"
            :error="form.errors.has('short_description')"
        />

        <wysiwyg-field
            v-model="form.duty"
            label="Обязанности"
            :error-messages="form.errors.get('duty')"
            :error="form.errors.has('duty')"
        />

        <wysiwyg-field
            v-model="form.requirement"
            label="Требования"
            :error-messages="form.errors.get('requirement')"
            :error="form.errors.has('requirement')"
        />

        <wysiwyg-field
            v-model="form.condition"
            label="Условия"
            :error-messages="form.errors.get('condition')"
            :error="form.errors.has('condition')"
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
import { statusLabels } from '~/enums';

export default {
    components: {
        WysiwygField,
    },
    props: {
        vacancy: {
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
            short_description: null,
            status: 1,
            experience: null,
            timetable: null,
            occupation: null,
            duty: null,
            requirement: null,
            condition: null,
        },
        form: null,
        statusLabels,
    }),
    watch: {
        vacancy(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.vacancy || {});
    },
    methods: {
        updateSlug: debounce(function () {
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
