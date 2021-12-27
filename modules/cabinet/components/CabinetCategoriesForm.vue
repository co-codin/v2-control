<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels v-if="form">
            <draggable v-model="form.categories" class="width-full">
                <v-expansion-panel v-for="(category, index) in form.categories" :key="'category-' + index">
                    <v-expansion-panel-header class="title">
                        #{{ index + 1 }}. {{ category.name || '(без названия)' }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <category-tree-search-field
                            v-model="category.id"
                            label="Категория"
                            name="category"
                            :multiple="false"
                            class="mb-3"
                            :error-messages="form.errors.get(`categories.${index}.id`)"
                            :error="form.errors.has(`categories.${index}.id`)"
                        />

                        <v-text-field
                            v-model="category.name"
                            label="Название"
                            dense
                            :error-messages="form.errors.get(`categories.${index}.name`)"
                            :error="form.errors.has(`categories.${index}.name`)"
                        />
                        <v-text-field
                            v-model="category.count"
                            class="mt-2"
                            type="number"
                            label="Количество"
                            dense
                            :error-messages="form.errors.get(`categories.${index}.count`)"
                            :error="form.errors.has(`categories.${index}.count`)"
                        />
                        <v-text-field
                            v-model="category.price"
                            class="mt-2"
                            type="number"
                            label="Цена"
                            dense
                            :error-messages="form.errors.get(`categories.${index}.price`)"
                            :error="form.errors.has(`categories.${index}.price`)"
                        />
                        <v-divider class="my-2" />
                        <div class="text-center">
                            <v-btn small class="white--text" color="red" @click="form.categories.splice(index)">
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
import Form from 'form-backend-validation';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';

export default {
    components: {
        CategoryTreeSearchField,
        draggable,
    },
    data: () => ({
        formDefaults: {
            categories: [],
        },
        form: null,
    }),
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
            categories: 'category/categories',
        }),
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.cabinet || {});
    },
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        ...mapActions({
            createCategories: 'forms/cabinet/createCategories',
        }),
        updateName: debounce(function (id, index) {
            const category = this.categories.find((category) => category.id === id);
            this.form.categories[index].name = category?.product_name ? category.product_name : null;
        }, 200),
        addCategory() {
            if (!this.form.categories || !Array.isArray(this.form.categories)) {
                this.form.categories = [];
            }
            this.form.categories.push({
                id: null,
                name: null,
                count: null,
                price: null,
            });
        },
        async save() {
            if (this.form.categories.length) {
                try {
                    await this.form.put(`/admin/cabinets/${this.cabinet.id}/categories`);
                    this.$snackbar(`Категории успешно обновлены`);
                    this.closeAllPanels();
                } catch (e) {
                    this.$snackbar(`Произошла ошибка при обновлении категорий: ${e.message}`);
                }
            } else {
                this.$snackbar(`Категории должны заполнены`);
            }
        },
    },
};
</script>
