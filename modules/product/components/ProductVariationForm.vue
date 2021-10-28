<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-expansion-panels v-if="form">
            <v-expansion-panel v-for="(variation, index) in form.variations" :key="index">
                <v-expansion-panel-header class="title">
                    #{{ index + 1 }}. {{ variation.name || '(без названия)' }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-tabs
                            v-model="tab"
                            grow
                            background-color="transparent"
                        >
                            <v-tab v-for="item in items" :key="item.key">
                                {{ item.tab }}
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="tab" style="width: 100%">
                            <v-tab-item
                                key="parameters"
                            >
                                <v-card flat>
                                    <v-card-text>
                                        <v-text-field
                                            label="Название"
                                            v-model="variation.name"
                                        />
                                        <v-divider class="my-2" />
                                        <div class="text-center">
                                            <v-btn small @click="removeVariation(index)" class="white--text" color="red">
                                                Удалить модификацию
                                            </v-btn>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item
                                key="commerce"
                            >
                                <v-card flat>
                                    <v-card-text>
                                        <v-text-field
                                            dense
                                            label="Цена"
                                            v-model="variation.price"
                                            :error-messages="form.errors.get(`variations.${index}.price`)"
                                            :error="form.errors.has(`variations.${index}.price`)"
                                        />
                                        <v-text-field
                                            dense
                                            label="Предыдущая цена"
                                            v-model="variation.previous_price"
                                            :error-messages="form.errors.get(`variations.${index}.previous_price`)"
                                            :error="form.errors.has(`variations.${index}.previous_price`)"
                                        />
                                        <v-select
                                            dense
                                            label="Валюта"
                                            :items="currencies"
                                            v-model="variation.currency_id"
                                            :error-messages="form.errors.get(`variations.${index}.currency_id`)"
                                            :error="form.errors.has(`variations.${index}.currency_id`)"
                                        />
                                        <v-select
                                            dense
                                            label="Наличие"
                                            :items="availabilityLabels"
                                            v-model="variation.availability"
                                            :error-messages="form.errors.get(`variations.${index}.availability`)"
                                            :error="form.errors.has(`variations.${index}.availability`)"
                                        />
                                        <v-switch
                                            dense
                                            label="Отображается на сайте?"
                                            v-model="variation.is_enabled"
                                            :error-messages="form.errors.get(`variations.${index}.is_enabled`)"
                                            :error="form.errors.has(`variations.${index}.is_enabled`)"
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
            <v-btn @click="addVariation" link small color="primary" outlined>
                Добавить модификацию
            </v-btn>
        </div>

<!--        <template v-if="false">-->
<!--            <v-btn @clic.prevent="addNewVariations">Добавить новую вариацию</v-btn>-->
<!--            <v-card v-for="(newVariation, index) in newVariations" :key="'newVariation-' + index">-->
<!--                <v-text-field v-model="newVariation.name" label="Название"></v-text-field>-->
<!--                <v-checkbox v-model="newVariation.is_price_visible" dense label="Отображать цену" />-->
<!--                <v-select v-model="newVariation.currency_id" label="Валюта" :items="currencies" />-->
<!--                <v-text-field v-model.number="newVariation.price" label="Цена"></v-text-field>-->

<!--                <v-text-field v-model.number="newVariation.previous_price" label="Старая цена"></v-text-field>-->
<!--                <v-select v-model="newVariation.availability" label="Availability" :items="availabilityLabels">-->
<!--                </v-select>-->
<!--            </v-card>-->
<!--            <v-btn @click.prevent="addNewVariations">Еще</v-btn>-->
<!--            <v-btn @click.prevent="createVariations">Сохранить</v-btn>-->
<!--        </template>-->
    </v-form>
</template>

<script>
import Form from "form-backend-validation";

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
            });
        },
        removeVariation(index) {
            this.form.variations.splice(index, 1);
        },
    },
};
</script>
