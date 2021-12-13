<template>
    <v-form @submit.prevent="saveCategories">
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header class="title"> Аппараты УЗИ </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <category-tree-search-field label="Категория" name="category" :multiple="false" class="mb-3" />

                    <v-text-field label="Название" dense />
                    <v-text-field label="Количество" dense />
                    <v-text-field label="Цена" dense />
                    <v-divider class="my-2" />
                    <div class="text-center">
                        <v-btn small class="white--text" color="red"> Удалить категорию </v-btn>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div class="mt-2">
            <v-btn link small color="primary" outlined> Добавить категорию </v-btn>
        </div>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';

export default {
    components: {
        CategoryTreeSearchField,
    },
    methods: {
        saveCategories() {},
    },
};
</script>
