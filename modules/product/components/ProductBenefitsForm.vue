<template>
    <v-form @submit.prevent="saveBenefits">
        <v-expansion-panels v-if="form">
            <form-block title="Сводная информация">
                <v-expansion-panels v-if="form.benefits.information && form.benefits.information.length">
                    <v-expansion-panel v-for="(information, index) in form.benefits.information" :key="index">
                        <v-expansion-panel-header class="title">
                            {{ information.description || '(не заполнено)' }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-text-field
                                label="Иконка"
                                v-model="information.icon"
                                dense
                            />
                            <v-text-field
                                label="Значение"
                                dense
                                v-model="information.description"
                            />
                            <div class="text-center mt-1">
                                <v-btn small @click="removeInformation(index)" class="white--text" color="red">
                                    Удалить
                                </v-btn>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-alert v-else type="info" dense outlined>
                    К товару не добавлено ни одного пункта со сводной информацией
                </v-alert>
                <div class="mt-2">
                    <v-btn @click="addInformation" :disabled="addInformationButtonsDisabled" link small color="primary" outlined>
                        Добавить пункт
                    </v-btn>
                    <v-alert type="info" class="mt-2" dense outlined v-if="addInformationButtonsDisabled">
                        Вы добавили максимальное количество пунктов
                    </v-alert>
                </div>
            </form-block>
            <form-block title="Фишки">
                <v-expansion-panels v-if="form.benefits.chips && form.benefits.chips.length">
                    <v-expansion-panel v-for="(chip, index) in form.benefits.chips" :key="index">
                        <v-expansion-panel-header class="title">
                            {{ chip.value && chip.description ? `${chip.value} ${chip.description}` : '(не заполнено)' }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-text-field
                                label="Значение"
                                dense
                                v-model="chip.value"
                            />
                            <v-text-field
                                label="Описание"
                                v-model="chip.description"
                                dense
                            />
                            <div class="text-center mt-1">
                                <v-btn small @click="removeChip(index)" class="white--text" color="red">
                                    Удалить фишку
                                </v-btn>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-alert v-else type="info" dense outlined>
                    К товару не добавлено ни одной фишки
                </v-alert>
                <div class="mt-2">
                    <v-btn @click="addChip" :disabled="addChipButtonDisabled" link small color="primary" outlined>
                        Добавить фишку
                    </v-btn>
                    <v-alert type="info" class="mt-2" dense outlined v-if="addChipButtonDisabled">
                        Вы добавили максимальное количество фишек к товару
                    </v-alert>
                </div>
            </form-block>
            <form-block title="Особенность">
                <v-input
                    label="Особенность"
                    :error-messages="form.errors.get('benefit')"
                    :error="form.errors.has('benefit')"
                >
                    <content-editor v-model="form.benefit" />
                </v-input>
            </form-block>
            <v-row class="expansion-panel-actions mt-3">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                </v-col>
            </v-row>
        </v-expansion-panels>
    </v-form>
</template>

<script>
import Form from 'form-backend-validation';
import FileUploader from '~/components/FileUploader';
import FormBlock from '~/components/forms/FormBlock';
import FileField from "~/components/forms/FileField";
import { mapGetters } from "vuex";
import ContentEditor from "~/components/editors/ContentEditor";

export default {
    components: {
        FormBlock,
        FileUploader,
        FileField,
        ContentEditor,
    },
    data() {
        return {
            form: null,
            formDefaults: {
                benefits: {
                    chips: null,
                    benefit: null,
                    information: null,
                },
            },
        };
    },
    computed: {
        ...mapGetters({
            product: 'forms/product/product',
        }),
        addChipButtonDisabled() {
            return this.form.benefits.chips && this.form.benefits.chips.length >= 3;
        },
        addInformationButtonsDisabled() {
            return this.form.benefits.information && this.form.benefits.information.length >= 2;
        },
    },
    methods: {
        saveBenefits() {
            this.form.patch(`/products/${this.product.id}`).then((resp) => {
                this.$snackbar.success(`Особенности товара успешно обновлена`);
            });
        },
        addChip() {
            if(!this.form.benefits.chips) {
                this.form.benefits.chips = [];
            }
            this.form.benefits.chips.push({
                value: null,
                description: null,
            });
        },
        removeChip(index) {
            this.form.benefits.chips.splice(index, 1);
            if(!this.form.benefits.chips.length) {
                this.form.benefits.chips = null;
            }
        },
        addInformation() {
            if(!this.form.benefits.information) {
                this.form.benefits.information = [];
            }
            this.form.benefits.information.push({
                value: null,
                description: null,
            });
        },
        removeInformation(index) {
            this.form.benefits.information.splice(index, 1);
            if(!this.form.benefits.information.length) {
                this.form.benefits.information = null;
            }
        },
    },
    created() {
        this.form = Form.create()
            .withData(this.formDefaults)
            .withOptions({
                http: this.$axios,
                resetOnSuccess: false,
            })
            .populate(this.product || {});
    },
};
</script>

<style lang="scss" scoped></style>
