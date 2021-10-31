<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Основная информация</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-form @submit.prevent="$emit('send', form)">
                <v-text-field
                    v-model="form.question"
                    label="Название"
                    :error-messages="form.errors.get('question')"
                    :error="form.errors.has('question')"
                />
                <v-text-field
                    v-model="form.slug"
                    label="Ссылка"
                    :error-messages="form.errors.get('slug')"
                    :error="form.errors.has('slug')"
                />

                <!--                <field-value-autocomplete-->
                <!--                    v-model="form.country_id"-->
                <!--                    label="Страна"-->
                <!--                    :error-messages="form.errors.get('country_id')"-->
                <!--                    :error="form.errors.has('country_id')"-->
                <!--                />-->

                <v-select
                    v-model="form.status"
                    label="Статус"
                    :items="statusLabels"
                    :error-messages="form.errors.get('status')"
                    :error="form.errors.has('status')"
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
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';
import { statusLabels } from '~/enums';

export default {
    components: {
        FieldValueAutocomplete,
    },
    props: {
        question: {
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
            slug: null,
            status: 1,
        },
        form: null,
        statusLabels,
    }),
    watch: {
        question(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.question || {});
    },
};
</script>
