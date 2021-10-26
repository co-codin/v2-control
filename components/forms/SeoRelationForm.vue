<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">SEO</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-form @submit.prevent="$emit('send', form)">
                <v-switch
                    v-model="form.is_enabled"
                    label="Включить"
                    :error-messages="form.errors.get('is_enabled')"
                    :error="form.errors.has('is_enabled')"
                />
                <template v-if="Boolean(form.is_enabled)">
                    <v-text-field
                        v-model="form.title"
                        label="Заголовок страницы"
                        :error-messages="form.errors.get('title')"
                        :error="form.errors.has('title')"
                    ></v-text-field>

                    <v-text-field
                        v-model="form.h1"
                        label="H1"
                        :error-messages="form.errors.get('h1')"
                        :error="form.errors.has('h1')"
                    ></v-text-field>

                    <v-text-field
                        v-model="form.description"
                        label="Описание"
                        :error-messages="form.errors.get('description')"
                        :error="form.errors.has('description')"
                    ></v-text-field>
                </template>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-form>
        </v-expansion-panel-content>
    </v-expansion-panel>
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

