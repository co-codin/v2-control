<template>
    <div>
        <v-expansion-panels>
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
                                            :value="variation.name"
                                            @input="(value) => updateField({field: `variations.${index}.name`, value})"
                                            :error-messages="form.errors.get(`variations.${index}.name`)"
                                            :error="form.errors.has(`variations.${index}.name`)"
                                            dense
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
                                            label="Цена"
                                            @input="(value) => updateField({field: `variations.${index}.price`, value})"
                                            :error-messages="form.errors.get(`variations.${index}.price`)"
                                            :error="form.errors.has(`variations.${index}.price`)"
                                            dense
                                        />
                                        <v-text-field
                                            label="Предыдущая цена"
                                            @input="(value) => updateField({field: `variations.${index}.previous_price`, value})"
                                            :error-messages="form.errors.get(`variations.${index}.previous_price`)"
                                            :error="form.errors.has(`variations.${index}.previous_price`)"
                                            dense
                                        />
                                        <v-select
                                            label="Валюта"
                                            :items="currencyLabels"
                                            @change="(value) => updateField({field: `variations.${index}.currency_id`, value})"
                                            :error-messages="form.errors.get(`variations.${index}.currency_id`)"
                                            :error="form.errors.has(`variations.${index}.currency_id`)"
                                            dense
                                        />
                                        <v-switch
                                            label="Цена отображается?"
                                            @change="(value) => updateField({field: `variations.${index}.is_price_visible`, value})"
                                            :error-messages="form.errors.get(`variations.${index}.is_price_visible`)"
                                            :error="form.errors.has(`variations.${index}.is_price_visible`)"
                                            dense
                                        />
                                        <v-select
                                            label="Наличие"
                                            :items="availabilityLabels"
                                            @change="(value) => updateField({field: `variations.${index}.availability`, value})"
                                            :error-messages="form.errors.get(`variations.${index}.availability`)"
                                            :error="form.errors.has(`variations.${index}.availability`)"
                                            dense
                                        />
                                        <v-switch
                                            label="Отображается на сайте?"
                                            @change="(value) => updateField({field: `variations.${index}.is_enabled`, value})"
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
            <v-btn @click="addVariation" link small color="primary" outlined>
                Добавить модификацию
            </v-btn>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    data() {
        return {
            currencyLabels: [
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
        };
    },
    computed: {
        ...mapGetters({
            form: 'forms/configurator/form',
        })
    },
    methods: {
        ...mapMutations({
            removeVariation: 'forms/configurator/REMOVE_VARIATION',
            addVariation: 'forms/configurator/ADD_VARIATION',
            updateField: 'forms/configurator/UPDATE_FIELD',
        }),
    },
};
</script>
