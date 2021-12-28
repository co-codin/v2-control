<template>
    <v-form @submit.prevent="$emit('send', form)">
        <template v-if="!form"></template>
        <template>
            <v-card outlined flat tile class="mb-1">
                <v-card-title>
                    Дата и время написания отзыва
                </v-card-title>
                <v-card-text>
                    <date-picker-field
                        :value="dateTime.date"
                        label="Дата"
                        :error-messages="form.errors.get('date')"
                        :error="form.errors.has('date')"
                        @input="updateDate"
                    />
                    <v-text-field
                        :value="dateTime.time"
                        label="Время"
                        prepend-icon="mdi-clock"
                        :error-messages="form.errors.get('date')"
                        :error="form.errors.has('date')"
                        @change="updateTime"
                        maxlength="5"
                        ref="time"
                    />
                </v-card-text>
            </v-card>

            <entity-autocomplete-field
                v-model="form.product_id"
                url="/products"
                item-value="id"
                :item-text="getProductItemText"
                :query-params="{
                    sort: 'name',
                    include: 'brand',
                    'fields[products]': 'id,brand_id,name',
                    'fields[brand]': 'id,name',
                }"
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
                    v-for="(rating, index) in ratings"
                    :value="getRatingValue(rating.name)"
                    @input="updateRatingValue(rating.name, $event)"
                    :label="rating.name"
                    :items="ratingLabels"
                    :error-messages="form.errors.get(`ratings.${index}.rate`)"
                    :error="form.errors.has(`ratings.${index}.rate`)"
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
        </template>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import WysiwygField from '~/components/forms/WysiwygField';
import FileField from '~/components/forms/FileField';
import EntityAutocompleteField from "~/components/forms/EntityAutocompleteField";
import Product from "~/modules/product/models/Product";
import ProductReview from "~/modules/product-review/models/ProductReview";
import DatePickerField from "~/components/forms/DatePickerField";

export default {
    components: { FileField, WysiwygField, EntityAutocompleteField, DatePickerField },
    props: {
        review: {
            type: ProductReview,
            default: () => new ProductReview,
        },
        isUpdating: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        clientReviewFormDefaults: {
            created_at: null,
            product_id: null,
            comment: null,
            disadvantages: null,
            advantages: null,
            ratings: {},
            experience: null,
            client_id: null,
            is_confirmed: false,
        },
        ownReviewFormDefaults: {
            created_at: null,
            product_id: null,
            first_name: null,
            last_name: null,
            comment: null,
            disadvantages: null,
            advantages: null,
            ratings: [],
            experience: null,
            is_confirmed: false,
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
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate({ created_at: this.$dayjs().format('YYYY-MM-DD HH:mm') })
            .populate(this.review || {});

        this.updateRatings();

        if (!this.isUpdating) {
            this.generateRandomPerson();
        }
    },
    computed: {
        isOwnReviewForm() {
            return !this.isUpdating || !this.review?.client_id;
        },
        dateTime() {
            const now = this.$dayjs(this.form.created_at || undefined);
            return {
                date: now.format('YYYY-MM-DD'),
                time: `${now.format('HH')}:${now.format('mm')}`
            };
        },
    },
    methods: {
        async updateRatings() {
            if (!this.form.product_id) {
                this.ratings = null;
                this.form.ratings = [];
                return;
            }

            const product = await Product.include('category').$find(this.form.product_id);

            if (!product.category) {
                this.ratings = [];
                this.form.ratings = [];
                return;
            }

            this.ratings = product.category.review_ratings;

            // reset old rating keys
            let reviewRating = [];
            this.ratings.forEach(rating => {
                reviewRating.push({name: rating.name, rate: this.getRatingValueByName(rating.name)?.rate || null});
            });
            this.form.ratings = reviewRating;
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
        updateDate(date) {
            const now = this.$dayjs(this.form.created_at ?? undefined);
            this.form.created_at = `${date || now.format('YYYY-MM-DD')} ${now.format('HH:mm')}`
        },
        updateTime(time) {
            if (!/[0-9]{2}:[0-9]{2}/.test(time)) {
                time = null;
            }
            const now = this.$dayjs(this.form.created_at);
            this.form.created_at = `${now.format('YYYY-MM-DD')} ${time || now.format('HH:mm')}`;
        },
        getRatingValue(name) {
            return this.form.ratings.find(rating => rating.name === name)?.rate;
        },
        updateRatingValue(name, rate) {
            if (!this.hasRatingValue(name)) {
                this.form.ratings.push({
                    name: name,
                    rate: null,
                });
            }
            this.updateRate(name, rate);
        },
        hasRatingValue(name) {
            return !! this.getRatingValueByName(name);
        },
        updateRate(name, rate) {
            const ratingValue = this.getRatingValueByName(name);
            ratingValue.rate = rate;
        },
        getRatingValueByName(name) {
            return this.form.ratings.find(rating => rating.name === name);
        },
        getProductItemText(item) {
            return `${item?.brand?.name} ${item.name}`;
        },
    },
};
</script>
