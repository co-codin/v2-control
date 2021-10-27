<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Основная информация</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-form @submit.prevent="$emit('send', form)">
                <v-text-field
                    v-model="form.company_name"
                    label="Название"
                    :error-messages="form.errors.get('company_name')"
                    :error="form.errors.has('company_name')"
                />

                <v-text-field
                    v-model="form.post"
                    label="Пост"
                    :error-messages="form.errors.get('post')"
                    :error="form.errors.has('post')"
                />

                <v-text-field
                    v-model="form.comment"
                    label="Коментарий"
                    :error-messages="form.errors.get('comment')"
                    :error="form.errors.has('comment')"
                />

                <v-switch
                    v-model="form.is_in_home"
                    label="Отображать на главной"
                    :error-messages="form.errors.get('is_in_home')"
                    :error="form.errors.has('is_in_home')"
                />

                <v-select
                    v-model="form.type"
                    label="Тип"
                    :items="typeLabels"
                    :error-messages="form.errors.get('type')"
                    :error="form.errors.has('type')"
                />

                <v-row class="expansion-panel-actions mt-5">
                    <v-col>
                        <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
import { Form } from 'form-backend-validation';

export default {
    props: {
        customerReview: {
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
            company_name: null,
            post: null,
            type: 1,
            comment: null,
            is_in_home: false,
        },
        typeLabels: [
            { value: 1, text: 'Гос' },
            { value: 2, text: 'Частное лицо' },
            { value: 3, text: 'Частный центр' },
        ],
        form: null,
    }),
    watch: {
        brand(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.brand || {});
    },
};
</script>
