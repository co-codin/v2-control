<template>
    <v-form @submit.prevent="save">
        <div v-if="form">
            <template v-if="filterIsCheckBoxList">
                <v-text-field
                    v-model="form.options.seoPrefix"
                    label="Префикс метки"
                    :error-messages="form.errors.get('options.seoPrefix')"
                    :error="form.errors.has('options.seoPrefix')"
                />
                <h3>Метки</h3>
                <v-expansion-panels v-if="hasSeoTagLabels" class="mt-2">
                    <v-expansion-panel v-for="(tag, index) in form.options.seoTagLabels" :key="index">
                        <v-expansion-panel-header class="title">{{ tag.value || '(метка не заполнена)' }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <field-value-autocomplete
                                v-model="tag.key"
                                label="Значение"
                                :error-messages="form.errors.get(`options.seoTagLabels[${index}].key`)"
                                :error="form.errors.has(`options.seoTagLabels[${index}].key`)"
                                dense
                            />
                            <v-text-field
                                v-model="tag.value"
                                label="Метка"
                                :error-messages="form.errors.get(`options.seoTagLabels[${index}].value`)"
                                :error="form.errors.has(`options.seoTagLabels[${index}].value`)"
                                dense
                            />
                            <div class="text-center">
                                <v-btn
                                    small
                                    class="white--text"
                                    color="red"
                                    @click="deleteTag(index)"
                                >
                                    Удалить метку
                                </v-btn>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <div class="mt-2">
                    <v-btn link small color="primary" outlined @click="addTag"> Добавить метку </v-btn>
                </div>
            </template>
            <template v-else>
                <v-text-field
                    v-model="form.options.seoTagLabel"
                    label="Метка"
                    :error-messages="form.errors.get('options.seoTagLabel')"
                    :error="form.errors.has('options.seoTagLabel')"
                    :hint="seoTagLabelHint"
                    persistent-hint
                />
            </template>
            <v-row class="expansion-panel-actions mt-5">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                </v-col>
            </v-row>
        </div>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import FieldValueAutocomplete from "~/components/forms/FieldValueAutocomplete";
import Filter from "~/modules/filter/models/Filter";
import { merge } from "lodash";

export default {
    components: {
        FieldValueAutocomplete,
    },
    props: {
        filter: {
            type: Object | null,
            required: true,
        },
    },
    data: () => ({
        formDefaults: {
            type: null,
            options: {
            },
        },
        form: null,
    }),
    computed: {
        filterIsCheckBoxList() {
            return this.filter.type === 1;
        },
        hasSeoTagLabels() {
            return !! this.form.options.seoTagLabels?.length;
        },
        seoTagLabelHint() {
            if(this.form.type === 2) {
                return "Поле должно содержать две переменные: <from> и <to>"
            }
            return null;
        },
    },
    watch: {
        filter: {
            handler(value) {
                this.form.populate(value);
            },
            deep: true,
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.filter);
    },
    methods: {
        addTag() {
            if (!this.form.options.seoTagLabels) {
                this.form.options = Object.assign({}, {...this.form.options}, {
                    seoTagLabels: [],
                });
            }
            this.form.options.seoTagLabels.push({
                key: null,
                value: null,
            });
        },
        deleteTag(index) {
            this.form.options.seoTagLabels.splice(index, 1);
        },
        async save() {
            try {
                const { data } = await this.form.put(`/admin/filters/${this.filter.id}`);
                this.$snackbar(`Фильтр успешно обновлен`);
                this.$emit('save', new Filter(data));
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
