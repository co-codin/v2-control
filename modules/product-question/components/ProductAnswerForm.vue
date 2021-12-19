<template>
    <v-form @submit.prevent="$emit('save', form)">
        <v-text-field
            v-model="form.first_name"
            label="Имя"
            :error-messages="form.errors.get('first_name')"
            :error="form.errors.has('first_name')"
            dense
        />
        <v-text-field
            v-model="form.last_name"
            label="Фамилия"
            :error-messages="form.errors.get('last_name')"
            :error="form.errors.has('last_name')"
            dense
        />
        <v-text-field
            v-model="form.person"
            label="Лицо"
            :error-messages="form.errors.get('person')"
            :error="form.errors.has('person')"
            dense
        />
        <v-textarea
            v-model="form.text"
            label="Ответ"
            :error-messages="form.errors.get('text')"
            :error="form.errors.has('text')"
            dense
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
import WysiwygField from '~/components/forms/WysiwygField';
import FileField from '~/components/forms/FileField';
import ProductQuestion from "~/modules/product-question/models/ProductQuestion";

export default {
    components: { FileField, WysiwygField },
    props: {
        answer: {
            type: Object | null,
            default: () => ({}),
        },
        question: {
            type: ProductQuestion,
            required: true,
        },
    },
    data() {
        return ({
            formDefaults: {
                first_name: null,
                last_name: null,
                person: null,
                text: null,
                product_question_id: this.question.id,
            },
            form: null,
        });
    },
    watch: {
        answer(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.answer || {});
    },
};
</script>
