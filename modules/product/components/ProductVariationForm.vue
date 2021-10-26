<template>
    <v-card tile class="mt-5 block-wrap">
        <v-card-title>
            Вариации
            <v-btn text small color="info" class="ml-3" @click="editing = !editing">
                {{ editing ? 'Свернуть' : 'Развернуть' }}
            </v-btn>
        </v-card-title>
        <v-card-text v-show="editing" v-if="variations.length">
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
            <template v-if="newVariations.length">
                <v-card v-for="(newVariation, index) in newVariations" :key="'newVariation-' + index">
                    <v-checkbox v-model="newVariation[index].is_price_visible" dense label="Отображать цену" />
                </v-card>
                <v-btn @click.prevent="addNewVariations">Еще</v-btn>
                <v-btn @click.prevent="createVariations">Сохранить</v-btn>
            </template>
        </v-card-text>
    </v-card>
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
        };
    },
    methods: {
        createVariations() {},
        addNewVariations() {
            this.newVariations.push({});
        },
    },
};
</script>
