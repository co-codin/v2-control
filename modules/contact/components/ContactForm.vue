<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
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
