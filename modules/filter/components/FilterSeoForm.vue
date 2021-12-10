<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.options.seoPrefix"
            label="Префикс"
            :error-messages="form.errors.get('options.seoPrefix')"
            :error="form.errors.has('options.seoPrefix')"
        />

        <v-text-field
            v-model="form.options.filter_value"
            label="Значение для поиска"
            :error-messages="form.errors.get('options.filter_value')"
            :error="form.errors.has('options.filter_value')"
        />

        <v-text-field
            v-model="form.options.seoTagLabel"
            label="Метка"
            :error-messages="form.errors.get('options.seoTagLabel')"
            :error="form.errors.has('options.seoTagLabel')"
        />
        <v-card outlined>
            <v-card-title class="d-flex justify-space-between align-center">
                <h4>Мета теги</h4>
                <v-btn type="button" small dark color="orange" @click.prevent="addTag">Добавить</v-btn>
            </v-card-title>
            <v-card-text class="pt-0 pb-0">
                <div v-for="(tag, index) in form.options.seoTagLabels" :key="index" class="d-flex mb-2 align-center">
                    <v-col cols="5">
                        <v-select
                            v-if="properties.length"
                            v-model="tag.key"
                            :items="properties"
                            label="Характеристика"
                            item-text="name"
                            item-value="id"
                            :error-messages="form.errors.get(`seoTagLabels.${index}.key`)"
                            :error="form.errors.has(`seoTagLabels.${index}.key`)"
                        />
                    </v-col>
                    <v-col cols="5">
                        <v-text-field
                            v-model="tag.value"
                            label="Контент"
                            :error-messages="form.errors.get(`seoTagLabels.${index}.value`)"
                            :error="form.errors.has(`seoTagLabels.${index}.value`)"
                        />
                    </v-col>
                    <v-col cols="2">
                        <v-btn x-small dark color="red" @click="deleteTag(index)">удалить</v-btn>
                    </v-col>
                </div>
            </v-card-text>
        </v-card>
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import { mapGetters } from 'vuex';

export default {
    props: {
        filter: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            options: {
                seoPrefix: null,
                seoTagLabel: null,
                seoTagLabels: null,
                filter_value: null,
            },
        },
        form: null,
    }),
    computed: {
        ...mapGetters({
            properties: 'property/properties',
        }),
    },
    watch: {
        filter(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults).withOptions({ http: this.$axios });

        if (!this.filter.options) {
            this.form.populate({
                options: {
                    seoPrefix: null,
                    seoTagLabel: null,
                    seoTagLabels: null,
                    filter_value: null,
                },
            });
        } else {
            this.form.populate(this.filter);
        }
    },
    methods: {
        addTag() {
            if (!this.form.options.seoTagLabels) {
                this.form.options.seoTagLabels = [];
            }
            this.form.options.seoTagLabels.push({
                key: null,
                value: null,
            });
        },
        deleteTag(index) {
            this.form.options.seoTagLabels.splice(index, 1);
        },
    },
};
</script>
