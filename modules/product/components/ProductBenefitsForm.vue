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
                            <v-select
                                v-model="information.icon"
                                label="Иконка"
                                :error-messages="form.errors.get(`benefits.information.${index}.icon`)"
                                :error="form.errors.has(`benefits.information.${index}.icon`)"
                                dense
                                :items="icons"
                            >
                                <template #prepend-inner>
                                    <svg-icon v-if="information.icon" :name="`site-icons/${information.icon}`" />
                                </template>
                            </v-select>
                            <v-text-field
                                v-model="information.description"
                                label="Значение"
                                :error-messages="form.errors.get(`benefits.information.${index}.description`)"
                                :error="form.errors.has(`benefits.information.${index}.description`)"
                                dense
                            />
                            <div class="text-center mt-1">
                                <v-btn small class="white--text" color="red" @click="removeInformation(index)">
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
                    <v-btn
                        :disabled="addInformationButtonsDisabled"
                        link
                        small
                        color="primary"
                        outlined
                        @click="addInformation"
                    >
                        Добавить пункт
                    </v-btn>
                    <v-alert v-if="addInformationButtonsDisabled" type="info" class="mt-2" dense outlined>
                        Вы добавили максимальное количество пунктов
                    </v-alert>
                </div>
            </form-block>
            <form-block title="Фишки">
                <v-expansion-panels v-if="form.benefits.chips">
                    <v-expansion-panel v-for="(chip, index) in form.benefits.chips" :key="index">
                        <v-expansion-panel-header class="title">
                            {{
                                chip.value && chip.description ? `${chip.value} ${chip.description}` : '(не заполнено)'
                            }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-text-field
                                v-model="chip.value"
                                label="Значение"
                                :error-messages="form.errors.get(`benefits.chips.${index}.value`)"
                                :error="form.errors.has(`benefits.chips.${index}.value`)"
                                dense
                            />
                            <v-textarea
                                v-model="chip.description"
                                rows="3"
                                label="Описание"
                                :error-messages="form.errors.get(`benefits.chips.${index}.description`)"
                                :error="form.errors.has(`benefits.chips.${index}.description`)"
                                dense
                            />
                            <div class="text-center mt-1">
                                <v-btn small class="white--text" color="red" @click="removeChip(index)">
                                    Удалить фишку
                                </v-btn>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-alert v-else type="info" dense outlined> К товару не добавлено ни одной фишки </v-alert>
                <div class="mt-2">
                    <v-btn :disabled="addChipButtonDisabled" link small color="primary" outlined @click="addChip">
                        Добавить фишку
                    </v-btn>
                    <v-alert v-if="addChipButtonDisabled" type="info" class="mt-2" dense outlined>
                        Вы добавили максимальное количество фишек к товару
                    </v-alert>
                </div>
            </form-block>
            <form-block title="Особенность">
                <wysiwyg-field
                    v-model="form.benefits.benefit"
                    label="Особенность"
                    :error-messages="form.errors.get('benefits.benefit')"
                    :error="form.errors.has('benefits.benefit')"
                />
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
import { mapGetters, mapMutations } from 'vuex';
import FormBlock from '~/components/forms/FormBlock';
import WysiwygField from '~/components/forms/WysiwygField';
import SvgIcon from '~/components/SvgIcon';

export default {
    components: {
        FormBlock,
        WysiwygField,
        SvgIcon,
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
            icons: [
                'arrow',
                'arrow-up',
                'burger-menu',
                'cart',
                'chip-close',
                'close-popup',
                'compare',
                'download',
                'flag',
                'heart',
                'heart-empty',
                'infinite',
                'note',
                'note-black',
                'plus',
                'plus-filters',
                'question-info',
                'remove',
                'reset',
                'search',
                'user',
                'warranty',
            ],
        };
    },
    computed: {
        ...mapGetters({
            product: 'product/product',
        }),
        addChipButtonDisabled() {
            return this.form.benefits.chips && this.form.benefits.chips.length >= 3;
        },
        addInformationButtonsDisabled() {
            return this.form.benefits.information && this.form.benefits.information.length >= 2;
        },
    },
    created() {
        this.form = Form.create().withData(this.formDefaults).withOptions({
            http: this.$axios,
            resetOnSuccess: false,
        });

        if (this.product.benefits) {
            this.form.populate(this.product);
        }
    },
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        async saveBenefits() {
            try {
                await this.form.patch(`/admin/products/${this.product.id}`);
                this.$snackbar(`Особенности товара успешно обновлены`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
        addChip() {
            if (!this.form.benefits.chips) {
                this.form.benefits.chips = [];
            }
            this.form.benefits.chips.push({
                value: null,
                description: null,
            });
        },
        removeChip(index) {
            this.form.benefits.chips.splice(index, 1);
            if (!this.form.benefits.chips.length) {
                this.form.benefits.chips = null;
            }
        },
        addInformation() {
            if (!this.form.benefits.information) {
                this.form.benefits.information = [];
            }
            this.form.benefits.information.push({
                value: null,
                description: null,
            });
        },
        removeInformation(index) {
            this.form.benefits.information.splice(index, 1);
            if (!this.form.benefits.information.length) {
                this.form.benefits.information = null;
            }
        },
    },
};
</script>
