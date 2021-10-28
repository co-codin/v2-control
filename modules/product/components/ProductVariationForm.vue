<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Модификации</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-simple-table>
                <template #default>
                    <thead>
                        <tr>
                            <th class="text-left">Состояние</th>
                            <th class="text-left">Старая цена</th>
                            <th class="text-left">Текущая цена</th>
                            <th class="text-left">Валюта</th>
                            <th class="text-left">Цена отображается</th>
                            <th class="text-left">Наличие</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="variation in variations" :key="variation.name">
                            <td>{{ availabilityDescriptions[variation.availability] }}</td>
                            <td>{{ variation.previous_price }}</td>
                            <td>{{ variation.price }}</td>
                            <td v-if="variation.currency_id">{{ variation.currency.name }}</td>
                            <td>{{ variation.is_price_visible ? 'Да' : 'Нет' }}</td>
                            <td>{{ variation.is_enabled ? 'Да' : 'Нет' }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <v-card v-for="(newVariation, index) in newVariations" :key="'newVariation-' + index">
                <v-text-field v-model="newVariation.name" label="Название"></v-text-field>
                <v-checkbox v-model="newVariation.is_price_visible" dense label="Отображать цену" />
                <v-select v-model="newVariation.currency_id" label="Валюта" :items="currencies" />
                <v-text-field v-model.number="newVariation.price" label="Цена"></v-text-field>

                <v-text-field v-model.number="newVariation.previous_price" label="Старая цена"></v-text-field>
                <v-select v-model="newVariation.availability" label="Availability" :items="availabilityLabels">
                </v-select>
            </v-card>
            <div class="mt-2">
                <v-btn @click="addNewVariations"
                    >{{ newVariations.length ? 'Добавить еще' : 'Добавить новую вариацию' }}
                </v-btn>
                <v-btn @click.prevent="createVariations">Сохранить</v-btn>
            </div>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
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
            newVariations: [],
            currencies: [
                { value: 1, text: 'Рубль' },
                { value: 2, text: 'Доллар' },
                { value: 3, text: 'Евро' },
            ],
            availabilityDescriptions: {
                1: 'Новый',
                2: 'Демонстрационный',
                3: 'Восстановленный',
                4: 'Б/У',
            },
        };
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
            console.log(this.newVariations);
            this.newVariations.push({
                name: null,
                is_price_visible: false,
                currency_id: null,
                previous_price: null,
                price: null,
                is_enabled: false,
                availability: null,
            });
            console.log(this.newVariations);
        },
    },
};
</script>
