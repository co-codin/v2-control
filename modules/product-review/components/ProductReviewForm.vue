<template>
    <v-form @submit.prevent="$emit('send', form)">

        <entity-autocomplete-field
            v-model="form.product_id"
            url="/products"
            item-value="id"
            item-text="name"
            :query-params="{ sort: 'name' }"
            :error-messages="form.errors.get('product_id')"
            :error="form.errors.has('product_id')"
            placeholder="Введите название товара"
            label="Товар"
            filter-column="id"
            search-column="live"
            hide-no-data
            cache-items
            clearable
            @input="updateRatings"
        />

        <template v-if="ratings && ratings.length">
            <v-select
                v-for="rating in ratings"
                v-model="form.ratings[`${rating.name}`]"
                :label="rating.name"
                :items="ratingLabels"
                :error-messages="form.errors.get(`ratings.${rating.name}`)"
                :error="form.errors.has(`ratings.${rating.name}`)"
                :key="rating.name"
            />
        </template>

        <template v-if="isOwnReviewForm">
            <v-card outlined class="mb-2">
                <v-card-title>
                    Автор
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="form.first_name"
                        label="Имя"
                        :error-messages="form.errors.get('first_name')"
                        :error="form.errors.has('first_name')"
                    />

                    <v-text-field
                        v-model="form.last_name"
                        label="Фамилия"
                        :error-messages="form.errors.get('last_name')"
                        :error="form.errors.has('last_name')"
                    />
                    <v-btn
                        @click="generateRandomPerson()"
                        :loading="isLoadingRandomPerson"
                        :disabled="isLoadingRandomPerson"
                    >
                        Сгенерировать новые данные
                    </v-btn>
                </v-card-text>
            </v-card>
        </template>

        <v-select
            v-model="form.experience"
            label="Опыт использования"
            :items="experienceLabels"
            :error-messages="form.errors.get('experience')"
            :error="form.errors.has('experience')"
        />

        <v-switch
            v-model="form.is_confirmed"
            label="Отзыв подтвержден"
            :error-messages="form.errors.get('is_confirmed')"
            :error="form.errors.has('is_confirmed')"
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
import { productReviewStatusLabels } from "~/enums";
import EntityAutocompleteField from "~/components/forms/EntityAutocompleteField";
import Product from "~/modules/product/models/Product";

export default {
    components: { FileField, WysiwygField, EntityAutocompleteField },
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
        clientReviewFormDefaults: {
            product_id: null,
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
        ownReviewFormDefaults: {
            product_id: null,
            first_name: null,
            last_name: null,
            comment: null,
            disadvantages: null,
            advantages: null,
            ratings: {},
            experience: null,
            is_confirmed: false,
            status: 1,
        },
        form: null,
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
        ratings: null,
        isLoadingRandomPerson: false,
    }),
    watch: {
        review(value) {
            this.form.populate(value);
        },
    },
    created() {
        let defaults = !this.isOwnReviewForm
            ? this.clientReviewFormDefaults
            : this.ownReviewFormDefaults;

        this.form = Form.create(defaults)
            .withOptions({ http: this.$axios })
            .populate(this.review || {});

        this.updateRatings();
        this.generateRandomPerson();
    },
    computed: {
        isOwnReviewForm() {
            return !this.isUpdating || !this.review?.client_id;
        },
    },
    methods: {
        async updateRatings() {
            if (!this.form.product_id) {
                this.ratings = null;
                return;
            }
            const product = await Product.include('category').$find(this.form.product_id);

            if (!product.category) {
                this.ratings = [];
                return;
            }

            this.ratings = product.category.review_ratings;
        },
        async generateRandomPerson() {
            this.isLoadingRandomPerson = true;
            try {
                const { data } = await this.$randomPerson.get('/api/person?fields=name');
                if (!data.result) {
                    throw new Error('Проблема с API генерации имен и фамилий');
                }
                this.form.first_name = data.result?.[0]?.name?.first;
                this.form.last_name = data.result?.[0]?.name?.second;
            }
            catch (e) {
                this.$snackbar(e.message);
            }
            this.isLoadingRandomPerson = false;
        },
    },
};
</script>
