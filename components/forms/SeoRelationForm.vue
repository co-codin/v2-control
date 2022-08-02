<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-switch
            v-model="form.is_enabled"
            label="Включить"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
            inset
            filled
        />
        <template v-if="Boolean(form.is_enabled)">
            <v-textarea
                v-model="form.title"
                rows="3"
                label="Заголовок страницы (title)"
                :error-messages="form.errors.get('title')"
                :error="form.errors.has('title')"
                filled
            />
            <v-textarea
                v-model="form.h1"
                rows="3"
                label="H1"
                :error-messages="form.errors.get('h1')"
                :error="form.errors.has('h1')"
                filled
            />
            <v-textarea
                v-model="form.description"
                rows="3"
                label="Описание (description)"
                :error-messages="form.errors.get('description')"
                :error="form.errors.has('description')"
                filled
            />
            <v-card outlined>
                <v-card-title class="d-flex justify-space-between align-center">
                    <h4>Мета теги</h4>
                    <v-btn type="button" small dark color="orange" @click.prevent="addTag">Добавить</v-btn>
                </v-card-title>
                <v-card-text class="pt-0 pb-0">
                    <div v-for="(tag, index) in form.meta_tags" :key="index" class="d-flex mb-2 align-center">
                        <v-col cols="5">
                            <v-text-field
                                v-model="tag.name"
                                label="Название"
                                :error-messages="form.errors.get(`meta_tags.${index}.name`)"
                                :error="form.errors.has(`meta_tags.${index}.name`)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-text-field
                                v-model="tag.content"
                                label="Контент"
                                :error-messages="form.errors.get(`meta_tags.${index}.content`)"
                                :error="form.errors.has(`meta_tags.${index}.content`)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-btn x-small dark color="red" @click="deleteTag(index)">удалить</v-btn>
                        </v-col>
                    </div>
                </v-card-text>
            </v-card>
        </template>
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';

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
            meta_tags: [],
        },
        form: null,
    }),
    watch: {
        seo(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.seo || {});
    },
    methods: {
        addTag() {
            if (!this.form.meta_tags) {
                this.form.meta_tags = [];
            }
            this.form.meta_tags.push({
                name: null,
                content: null,
            });
        },
        deleteTag(index) {
            this.form.meta_tags.splice(index, 1);
        },
    },
};
</script>
