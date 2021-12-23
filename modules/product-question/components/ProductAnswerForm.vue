<template>
    <v-form @submit.prevent="$emit('save', form)">
        <v-select
            label="Сотрудник"
            :items="personList"
            return-object
            dense
            @change="fillPersonFields"
        />
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
import ProductAnswerPerson from "~/modules/product/models/ProductAnswerPerson";

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
            persons: [],
        });
    },
    watch: {
        answer(value) {
            this.form.populate(value);
        },
    },
    computed: {
        personList() {
            return this.persons.map(person => ({
                ...person,
                value: `${person.first_name} ${person.last}`,
                text: `${person.first_name} ${person.last_name} (${person.person ?? "не заполнено"})`,
            }));
        },
    },
    async created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.answer || {});

        this.persons = await ProductAnswerPerson.get();
    },
    methods: {
        fillPersonFields(person) {
            this.form.first_name = person.first_name;
            this.form.last_name = person.last_name;
            this.form.person = person.person;
        },
    },
};
</script>
