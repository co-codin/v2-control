<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />

        <v-switch
            v-model="form.is_enabled"
            label="Отображать на сайте?"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
            inset
        />

        <file-field
            v-model="form.image"
            label="Фотография"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            @input="form.is_image_changed = true"
            @delete="form.image = null"
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
import FileField from '../../../components/forms/FileField';

export default {
    components: {
        FileField,
    },
    props: {
        achievement: {
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
            image: null,
            is_image_changed: false,
            is_enabled: false,
        },
        form: null,
    }),
    watch: {
        achievement(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.achievement || {});
    },
};
</script>
