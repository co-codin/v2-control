<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-select
            v-model="form.page"
            label="Страница"
            :error-messages="form.errors.get('page')"
            :error="form.errors.has('page')"
            :items="bannerPages"
        />
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />
        <v-text-field
            v-model="form.url"
            label="Ссылка"
            :error-messages="form.errors.get('url')"
            :error="form.errors.has('url')"
        />

        <h4>Desktop:</h4>
        <file-uploader
            v-if="!form.images.desktop"
            @upload="
                form.images.desktop = $event.file;
            "
        />
        <file-field
            v-else
            v-model="form.images.desktop"
            :error-messages="form.errors.get('images.desktop')"
            :error="form.errors.has('images.desktop')"
            prepend-icon="mdi-image"
            @delete="
                form.images.desktop = null;
            "
        />

        <h4>Tablet:</h4>
        <file-uploader
            v-if="!form.images.tablet"
            @upload="
                form.images.tablet = $event.file;
            "
        />
        <file-field
            v-else
            v-model="form.images.tablet"
            :error-messages="form.errors.get('images.tablet')"
            :error="form.errors.has('images.tablet')"
            prepend-icon="mdi-image"
            @delete="
                form.images.tablet = null;
            "
        />

        <h4>Mobile:</h4>
        <file-uploader
            v-if="!form.images.mobile"
            @upload="
                form.images.mobile = $event.file;
            "
        />
        <file-field
            v-else
            v-model="form.images.mobile"
            :error-messages="form.errors.get('images.mobile')"
            :error="form.errors.has('images.mobile')"
            prepend-icon="mdi-image"
            @delete="
                form.images.mobile = null;
            "
        />
        <v-switch
            v-model="form.is_enabled"
            label="Отображать на сайте"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
            inset
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
import { bannerPages } from "~/enums/modules/BannerPages";
import FileUploader from "~/components/FileUploader";
import FileField from "~/components/forms/FileField";

export default {
    components: {
        FileUploader,
        FileField
    },
    props: {
        banner: {
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
            page: null,
            url: null,
            is_enabled: false,
            images: {
                desktop: null,
                tablet: null,
                mobile: null
            },
        },
        form: null,
        bannerPages,
    }),
    watch: {
        banner(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.banner || {});
    },
};
</script>
