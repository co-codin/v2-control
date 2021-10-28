<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-expansion-panels v-if="form">
            <v-expansion-panel v-for="(variation, index) in form.variations" :key="index">
                <v-expansion-panel-header class="title">
                    #{{ index + 1 }}. {{ variation.name || '(без названия)' }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-tabs v-model="tab" grow background-color="transparent">
                            <v-tab v-for="item in items" :key="item.key">
                                {{ item.tab }}
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="tab" style="width: 100%">
                            <v-tab-item key="parameters">
                                <v-card flat>
                                    <v-card-text>
                                        <v-text-field v-model="variation.name" label="Название" />
                                        <v-divider class="my-2" />
                                        <div class="text-center">
                                            <v-btn
                                                small
                                                class="white--text"
                                                color="red"
                                                @click="removeVariation(index)"
                                            >
                                                Удалить модификацию
                                            </v-btn>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item key="commerce">
                                <v-card flat>
                                    <v-card-text>
                                        <v-text-field
                                            v-model="variation.price"
                                            label="Цена"
                                            :error-messages="form.errors.get(`variations.${index}.price`)"
                                            :error="form.errors.has(`variations.${index}.price`)"
                                            dense
                                        />
                                        <v-text-field
                                            v-model="variation.previous_price"
                                            label="Предыдущая цена"
                                            :error-messages="form.errors.get(`variations.${index}.previous_price`)"
                                            :error="form.errors.has(`variations.${index}.previous_price`)"
                                            dense
                                        />
                                        <v-select
                                            v-model="variation.currency_id"
                                            label="Валюта"
                                            :items="currencies"
                                            :error-messages="form.errors.get(`variations.${index}.currency_id`)"
                                            :error="form.errors.has(`variations.${index}.currency_id`)"
                                            dense
                                        />
                                        <v-switch
                                            v-model="variation.is_price_visible"
                                            label="Цена отображается?"
                                            :error-messages="form.errors.get(`variations.${index}.is_price_visible`)"
                                            :error="form.errors.has(`variations.${index}.is_price_visible`)"
                                            dense
                                        />
                                        <v-select
                                            v-model="variation.availability"
                                            label="Наличие"
                                            :items="availabilityLabels"
                                            :error-messages="form.errors.get(`variations.${index}.availability`)"
                                            :error="form.errors.has(`variations.${index}.availability`)"
                                            dense
                                        />
                                        <v-switch
                                            v-model="variation.is_enabled"
                                            label="Отображается на сайте?"
                                            :error-messages="form.errors.get(`variations.${index}.is_enabled`)"
                                            :error="form.errors.has(`variations.${index}.is_enabled`)"
                                            dense
                                        />
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <div class="mt-2">
            <v-btn link small color="primary" outlined @click="addVariation"> Добавить модификацию </v-btn>
        </div>
    </v-form>
</template>

<script>
import Form from 'form-backend-validation';

export default {
    props: {
        variations: {
            required: true,
            type: Array,
        },
    },
    data() {
        return {
            editing: false,
            newVariations: [
                {
                    name: null,
                    is_price_visible: false,
                    currency_id: null,
                    previous_price: null,
                    price: null,
                    is_enabled: false,
                    availability: null,
                },
            ],
            currencies: [
                { value: 1, text: 'Рубль' },
                { value: 2, text: 'Доллар' },
                { value: 3, text: 'Евро' },
            ],
            availabilityLabels: [
                { value: 1, text: 'В наличии' },
                { value: 2, text: 'Под заказ' },
                { value: 3, text: 'Ожидается поступление' },
                { value: 4, text: 'Вышел из производства' },
                { value: 5, text: 'Отсутствует РУ' },
            ],
            tab: null,
            items: [
                { tab: 'Параметры', key: 'parameters' },
                { tab: 'Коммерческая информация', key: 'commerce' },
            ],
            form: null,
            formDefaults: {
                variations: [],
            },
        };
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate({
                variations: this.variations || [],
            });
    },
    methods: {
        async createVariations() {
            this.newVariations = this.newVariations.filter((item) => item.name !== null);
            try {
                await this.$axios.$put(`/admin/products/${this.$route.params.id}/configurator`, {
                    variations: this.newVariations,
                });
                this.$snackbar('Успешно создан конфигурятор');
                this.$route.push({ name: 'products.update', params: { id: this.$route.params.id } });
            } catch (e) {
                this.$snackbar('Произошла ошибка создании конфигурятора');
            }
        },
        addNewVariations() {
            this.newVariations.push({
                name: null,
                is_price_visible: false,
                currency_id: null,
                previous_price: null,
                price: null,
                is_enabled: false,
                availability: null,
            });
        },
        addVariation() {
            this.form.variations.push({
                price: null,
                previous_price: null,
                currency_id: 1,
                name: null,
                availability: 1,
                is_price_visible: false,
                is_enabled: false,
            });
        },
        removeVariation(index) {
            this.form.variations.splice(index, 1);
        },
    },
};
</script>
