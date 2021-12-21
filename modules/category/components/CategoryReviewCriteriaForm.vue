<template>
    <v-form @submit.prevent="save">
        <template v-if="form">
            <v-expansion-panels>
                <draggable v-model="form.review_ratings" style="width: 100%">
                    <v-expansion-panel v-for="(criteria, index) in form.review_ratings" :key="index">
                        <v-expansion-panel-header class="title">
                            {{ criteria.name || '(без названия)' }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-text-field
                                v-model="criteria.name"
                                label="Название"
                                :error-messages="form.errors.get(`review_ratings.${index}.name`)"
                                :error="form.errors.has(`review_ratings.${index}.name`)"
                            />
                            <v-divider class="my-2" />
                            <div class="text-center">
                                <v-btn
                                    small
                                    class="white--text"
                                    color="red"
                                    @click="removeCriteria(index)"
                                >
                                    Удалить критерий
                                </v-btn>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </draggable>
            </v-expansion-panels>
            <v-alert v-if="form.errors.first('review_ratings')" class="mt-2" color="red" dark dense outlined>
                {{ form.errors.first('review_ratings') }}
            </v-alert>
            <div class="mt-2">
                <v-btn link small color="primary" outlined @click="addCriteria"> Добавить критерий </v-btn>
            </div>
            <v-row class="expansion-panel-actions mt-5">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                </v-col>
            </v-row>
        </template>
    </v-form>
</template>

<script>
import Form from 'form-backend-validation';
import Category from "~/modules/category/models/Category";
import draggable from "vuedraggable";

export default {
    components: {
        draggable,
    },
    props: {
        category: {
            type: Category,
            required: true,
        },
    },
    data: () => ({
        form: null,
        formDefaults: {
            review_ratings: [],
        },
    }),
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.category || {});
    },
    methods: {
        async save() {
            try {
                await this.form.patch(`/admin/categories/${this.category.id}`);
                this.$snackbar(`Критерии успешно сохранены`);
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
        removeCriteria(index) {
            this.form.review_ratings.splice(index, 1);
        },
        addCriteria() {
            if (!this.form.review_ratings) {
                this.form.review_ratings = [];
            }
            this.form.review_ratings.push({
                name: null,
            })
        },
    },
};
</script>
