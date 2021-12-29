<template>
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
            v-model="form.full_description"
            label="Подробное описание"
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
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
            full_description: null,
            status: 1,
            experience: null,
            timetable: null,
            occupation: null,
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
};
</script>
