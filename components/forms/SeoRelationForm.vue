<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-switch
            v-model="form.is_enabled"
            label="Включить"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
        />
        <template v-if="Boolean(form.is_enabled)">
            <v-textarea
                v-model="form.title"
                rows="3"
                label="Заголовок страницы"
                :error-messages="form.errors.get('title')"
                :error="form.errors.has('title')"
            />
            <v-textarea
                v-model="form.h1"
                rows="3"
                label="H1"
                :error-messages="form.errors.get('h1')"
                :error="form.errors.has('h1')"
            />
            <v-textarea
                v-model="form.description"
                rows="3"
                label="Описание"
                :error-messages="form.errors.get('description')"
                :error="form.errors.has('description')"
            />
        </template>
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import {Form} from 'form-backend-validation';

export default {
    props: {
        seo: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            is_enabled: false,
            title: null,
            h1: null,
            description: null,
        },
        form: null,
    }),
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({http: this.$axios, resetOnSuccess: false})
            .populate(this.seo || {})
    },
    watch: {
        seo(value) {
            this.form.populate(value);
        },
    }
}
</script>

