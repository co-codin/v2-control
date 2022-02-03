<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-expansion-panels v-if="form">
            <v-expansion-panel v-for="(source, index) in form.sources" :key="index">
                <v-expansion-panel-header class="title"
                    >#{{ index + 1 }}. {{ source.source_name || '(без названия)' }}</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                    <v-text-field
                        v-model="source.source_name"
                        label="Название источника"
                        :error-messages="form.errors.get(`sources.${index}.source_name`)"
                        :error="form.errors.has(`sources.${index}.source_name`)"
                        dense
                    />
                    <v-text-field
                        v-model="source.source_link"
                        label="Ссылка на источник"
                        :error-messages="form.errors.get(`sources.${index}.source_link`)"
                        :error="form.errors.has(`sources.${index}.source_link`)"
                        dense
                    />
                    <div class="text-center">
                        <v-btn class="" x-small dark color="red" @click="removeSource(index)">Удалить источника</v-btn>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div class="mt-2">
            <v-btn link small color="primary" outlined @click="addSource"> Добавить источника </v-btn>
        </div>
        <v-row class="expansion-panel-actions mt-3">
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
        news: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            sources: [],
        },
        form: null,
    }),
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.news || []);
    },
    methods: {
        addSource() {
            this.form.sources.push({
                source_name: '',
                source_link: '',
            });
        },
        removeSource(index) {
            this.form.sources.splice(index, 1);
        },
    },
};
</script>
