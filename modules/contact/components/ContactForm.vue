<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.first_name"
            label="Имя"
            :error-messages="form.errors.get('first_name')"
            :error="form.errors.has('first_name')"
        />

        <v-text-field
            v-model="form.last_name"
            label="Фамилия"
            :error-messages="form.errors.get('last_name')"
            :error="form.errors.has('last_name')"
        />

        <v-text-field
            v-model="form.job_position"
            label="Должность"
            :error-messages="form.errors.get('job_position')"
            :error="form.errors.has('job_position')"
        />

        <v-switch
            v-model="form.is_enabled"
            label="Отображать на сайте?"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
            inset
        />

        <v-text-field
            v-model="form.email"
            label="Почта"
            :error-messages="form.errors.get('email')"
            :error="form.errors.has('email')"
        />

        <v-text-field
            v-model="form.phone"
            label="Телефон"
            :error-messages="form.errors.get('phone')"
            :error="form.errors.has('phone')"
        />

        <file-uploader
            v-if="!form.image"
            @upload="
                    form.image = $event.file;
                "
        />

        <file-field
            v-else
            v-model="form.image"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            prepend-icon="mdi-image"
            @delete="
                    form.image = null;
                "
        />

        <v-text-field
            v-if="isUpdating"
            v-model="form.position"
            type="number"
            label="Позиция"
            :error-messages="form.errors.get('position')"
            :error="form.errors.has('position')"
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
import FileUploader from '~/components/FileUploader'

export default {
    components: {
        FileUploader,
        FileField,
    },
    props: {
        contact: {
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
            first_name: null,
            last_name: null,
            job_position: null,
            is_enabled: false,
            position: null,
            email: null,
            phone: null,
        },
        form: null,
    }),
    watch: {
        contact(value) {
            this.form.populate(value);
        },
    },
    async created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.contact || {});
    },
    methods: {

    },
};
</script>
