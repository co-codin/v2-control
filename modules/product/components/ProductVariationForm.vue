<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Модификации</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-form @submit.prevent="$emit('send', form)">
                <v-card v-for="variation in variations" :key="'variation-' + variation.id">
                    <v-card-title>{{ variation.name }}</v-card-title>
                    <v-card-text>
                        <span>Валюта: {{ variation.currency.name }}</span>
                        <span>Старая цена: {{ variation.previous_price }}</span>
                        <span>Цена: {{ variation.price }}</span>
                        <span>Цена отображается: {{ variation.is_price_visible ? 'Да' : 'Нет' }}</span>
                    </v-card-text>
                </v-card>

                <v-btn @clic.prevent="addNewVariations">Добавить новую вариацию</v-btn>
                <v-card v-for="(newVariation, index) in newVariations" :key="'newVariation-' + index">
                    <v-text-field v-model="newVariation.name" label="Название"></v-text-field>
                    <v-checkbox v-model="newVariation.is_price_visible" dense label="Отображать цену" />
                    <v-select v-model="newVariation.currency_id" label="Валюта" :items="currencies" />
                    <v-text-field v-model.number="newVariation.price" label="Цена"></v-text-field>

                    <v-text-field v-model.number="newVariation.previous_price" label="Старая цена"></v-text-field>
                    <v-select v-model="newVariation.availability" label="Availability" :items="availabilityLabels">
                    </v-select>
                </v-card>
                <v-btn @click.prevent="addNewVariations">Еще</v-btn>
                <v-btn @click.prevent="createVariations">Сохранить</v-btn>
            </v-form>
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
    },
};
</script>
