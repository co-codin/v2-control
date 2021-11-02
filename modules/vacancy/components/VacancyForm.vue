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

        <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
        />

        <slot name="buttons">
            <v-btn type="submit">Сохранить</v-btn>
        </slot>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import ContentEditor from '~/components/editors/ContentEditor';
import { statusLabels } from '~/enums';

export default {
    components: { ContentEditor },
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
