<template>
    <v-form @submit.prevent="$emit('send', form)">

        <v-select
            v-model="form.experience"
            label="Опыт использования"
            :items="experienceLabels"
            :error-messages="form.errors.get('experience')"
            :error="form.errors.has('experience')"
        />

        <v-select
            v-model="form.ratings.main"
            label="Общая оценка"
            :items="ratingLabels"
            :error-messages="form.errors.get('ratings.main')"
            :error="form.errors.has('ratings.main')"
        />

        <v-switch
            v-model="form.is_confirmed"
            label="Отзыв подтвержден"
            :error-messages="form.errors.get('ratings.main')"
            :error="form.errors.has('ratings.main')"
            inset
        />

        <v-select
            v-model="form.status"
            label="Статус"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
            :items="productReviewStatusLabels"
        />

        <v-textarea
            v-model="form.advantages"
            label="Достоинства"
            :error-messages="form.errors.get('advantages')"
            :error="form.errors.has('advantages')"
        />

        <v-textarea
            v-model="form.disadvantages"
            label="Недостатки"
            :error-messages="form.errors.get('disadvantages')"
            :error="form.errors.has('disadvantages')"
        />

        <v-textarea
            v-model="form.comment"
            label="Комментарий"
            :error-messages="form.errors.get('comment')"
            :error="form.errors.has('comment')"
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
import { urlRules } from '~/enums';
import { productReviewStatusLabels } from "~/enums";

export default {
    components: { FileField, WysiwygField },
    props: {
        review: {
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
            comment: null,
            disadvantages: null,
            advantages: null,
            ratings: {
                main: 0,
            },
            experience: null,
            client_id: null,
            is_confirmed: false,
            status: 1,
        },
        form: null,
        urlRules,
        experienceLabels: [
            { value: 1, text: 'Меньше месяца' },
            { value: 2, text: 'Несколько месяцев' },
            { value: 3, text: 'Больше года' },
        ],
        ratingLabels: [
            { value: 1, text: '1 из 5' },
            { value: 2, text: '2 из 5' },
            { value: 3, text: '3 из 5' },
            { value: 4, text: '4 из 5' },
            { value: 5, text: '5 из 5' },
        ],
        productReviewStatusLabels,
    }),
    watch: {
        review(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.review || {});
    },
};
</script>
