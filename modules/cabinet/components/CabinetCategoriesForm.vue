<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels>
            <draggable style="width: 100%" @end="updateCategoriesPositions">
                <v-expansion-panel v-for="(category, index) in form.categories" :key="index">
                    <v-expansion-panel-header class="title">
                        #{{ index + 1 }}. {{ category.name || '(без названия)' }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <category-tree-search-field
                            :value="category.id"
                            label="Категория"
                            name="category"
                            :multiple="false"
                            class="mb-3"
                            :error-messages="form.errors.get(`categories.${index}.id`)"
                            :error="form.errors.has(`categories.${index}.id`)"
                            @input="
                                (value) => {
                                    updateField({ field: `categories.${index}.id`, value });
                                    updateName(value, index);
                                }
                            "
                        />

                        <v-text-field
                            :value="category.name"
                            label="Название"
                            dense
                            :error-messages="form.errors.get(`categories.${index}.name`)"
                            :error="form.errors.has(`categories.${index}.name`)"
                            @input="(value) => updateField({ field: `categories.${index}.name`, value })"
                        />
                        <v-text-field
                            class="mt-2"
                            :value="category.count"
                            type="number"
                            label="Количество"
                            dense
                            :error-messages="form.errors.get(`categories.${index}.count`)"
                            :error="form.errors.has(`categories.${index}.count`)"
                            @input="(value) => updateField({ field: `categories.${index}.count`, value })"
                        />
                        <v-text-field
                            class="mt-2"
                            :value="category.price"
                            type="number"
                            label="Цена"
                            dense
                            :error-messages="form.errors.get(`categories.${index}.price`)"
                            :error="form.errors.has(`categories.${index}.price`)"
                            @input="(value) => updateField({ field: `categories.${index}.price`, value })"
                        />
                        <v-divider class="my-2" />
                        <div class="text-center">
                            <v-btn small class="white--text" color="red" @click="removeCategory(index)">
                                Удалить категорию
                            </v-btn>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </draggable>
        </v-expansion-panels>
        <div class="mt-2">
            <v-btn link small color="primary" outlined @click="addCategory"> Добавить категорию </v-btn>
        </div>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { debounce } from 'lodash';
import draggable from 'vuedraggable';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';

export default {
    components: {
        CategoryTreeSearchField,
        draggable,
    },
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
            form: 'forms/cabinet/form',
            categories: 'category/categories',
        }),
    },
    methods: {
        ...mapMutations({
            updateField: 'forms/cabinet/UPDATE_FIELD',
            fillErrors: 'forms/cabinet/FILL_ERRORS',
            closeAllPanels: 'helper/closeAllPanels',
            removeCategory: 'forms/cabinet/REMOVE_CATEGORY',
            addCategory: 'forms/cabinet/ADD_CATEGORY',
        }),
        ...mapActions({
            createCategories: 'forms/cabinet/createCategories',
        }),
        updateName: debounce(function (id, index) {
            const category = this.categories.find((category) => category.id === id);
            this.updateField({
                field: `categories.${index}.name`,
                value: category?.product_name ? category.product_name : null,
            });
        }, 200),
        async save() {
            if (this.form.categories.length) {
                try {
                    await this.createCategories(this.cabinet.id);
                    this.$snackbar(`Категории успешно обновлены`);
                    this.closeAllPanels();
                } catch (e) {
                    const errors = e?.response?.data?.errors;
                    if (errors) {
                        this.fillErrors(errors);
                    }
                    this.$snackbar(`Произошла ошибка при обновлении категорий: ${e.message}`);
                }
            } else {
                this.$snackbar(`Категории должны заполнены`);
            }
        },
        updateCategoriesPositions() {
            let i = 0;
            this.form.categories.forEach((item, index) => {
                this.updateField({ field: `categories.${index}.position`, value: ++i });
            });
        },
    },
};
</script>
