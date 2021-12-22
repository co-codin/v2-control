<template>
    <div>
        <page-header h1="Вопросы к товарам" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'product-questions.create' }"> Добавить вопрос </v-btn>
        </div>

        <advanced-search-form
            fast-filter-name="live"
            :filters="filters"
            :value="searchForm"
            @search="search"
        />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="product_questions"
                :loading="isLoading"
                :server-items-length="total"
                loading-text="Идет загрузка..."
                :options.sync="tableOptions"
                :footer-props="tableFooterProps"
                show-select
                @update:items-per-page="updateOptions('itemsPerPage', $event)"
                @update:page="updateOptions('page', $event)"
                @update:sort-by="updateOptions('sortBy', $event)"
                @update:sort-desc="updateOptions('sortDesc', $event)"
            >
                <template #item.id="{ item }">
                    <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
                </template>

                <template #item.product_id="{ item }">
                    <div class="text-no-wrap">
                        {{ item.product.brand.name }} {{ item.product.name }}
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            target="_blank"
                            link
                            :href="`${$config.app.siteUrl}/product/${item.product.slug}/${item.product.id}`"
                        >
                            <external-link-icon />
                        </v-btn>
                    </div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('date').fromNow() }}</div>
                </template>

                <template #item.status="{ item }">
                    <v-chip small :color="item.color" dark>{{ item.status.description }}</v-chip>
                </template>

                <template #item.product_id="{ item }">
                    <div class="text-no-wrap">
                        {{ item.product.brand.name }} {{ item.product.name }}
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            target="_blank"
                            link
                            :href="`${$config.app.siteUrl}/product/${item.product.slug}/${item.product.id}`"
                        >
                            <external-link-icon />
                        </v-btn>
                    </div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn
                            icon
                            @click="selectedQuestion = item; showQuestionAnswersPopup = true"
                            class="mr-1"
                        >
                            <chat-alt2-icon /> <span style="margin-left: 3px;">{{ item.product_answers_count }}</span>
                        </v-btn>
                        <v-btn
                            icon
                            @click="showQuestion(item)"
                        >
                            <eye-icon width="24" height="24" />
                        </v-btn>
                        <v-btn
                            icon
                            :to="{ name: 'product-questions.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn icon @click.prevent="deleteProductQuestion(item)">
                            <trash-icon />
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog
            v-if="showQuestionDetailsPopup"
            v-model="showQuestionDetailsPopup"
            max-width="500"
        >
            <v-card>
                <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                >
                    Подробно о вопросе
                </v-card-title>

                <v-card-text class="pt-2">
                    <div>
                        <b>Автор: </b> {{ selectedQuestion.clientName }}
                    </div>

                    <div>
                        <b>Дата написания: </b> {{ selectedQuestion.asDate('date').fromNow() }}
                    </div>

                    <div>
                        <b>Статус: </b> <v-chip small :color="selectedQuestion.color" dark>{{ selectedQuestion.status.description }}</v-chip>
                    </div>

                    <div>
                        <b>Товар: </b>
                        <span class="text-no-wrap">
                            <a target="_blank" :href="`${$config.app.siteUrl}/product/${selectedQuestion.product.slug}/${selectedQuestion.product.id}`">
                                {{ selectedQuestion.product.brand.name }} {{ selectedQuestion.product.name }}
                            </a>
                        </span>
                    </div>

                    <div>
                        <b>Вопрос: </b> {{ selectedQuestion.text || "(не указано)" }}
                    </div>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-if="!selectedQuestion.isApproved"
                        color="green"
                        outlined
                        small
                        @click="approveQuestion(selectedQuestion)"
                    >
                        <check-circle-icon class="h-6 w-6 mr-1" />
                        Одобрить
                    </v-btn>
                    <v-btn
                        v-if="!selectedQuestion.isRejected"
                        color="red"
                        outlined
                        small
                        @click="rejectQuestion(selectedQuestion)"
                    >
                        <x-circle-icon class="h-6 w-6 mr-1" />
                        Отклонить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-if="showQuestionAnswersPopup"
            v-model="showQuestionAnswersPopup"
            max-width="1000"
        >
            <v-card>
                <v-card-title>
                    Ответы к вопросу "{{ selectedQuestion.text }}?"
                </v-card-title>
                <v-card-text>
                    <v-expansion-panels v-if="selectedQuestion.product_answers.length" v-model="selectedAnswerPanel">
                        <v-expansion-panel v-for="(answer, index) in selectedQuestion.product_answers" :key="index">
                            <v-expansion-panel-header class="title">
                                #{{ index + 1 }}. {{ answer.first_name }} {{ answer.last_name }} {{ answer.person ? ` - ${answer.person}` : '' }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <product-answer-form :question="selectedQuestion" :answer="answer" @save="updateAnswer(answer, index, $event)" />
                                <v-divider class="my-2" />
                                <div class="text-center">
                                    <v-btn
                                        small
                                        class="white--text"
                                        color="red"
                                        @click="removeAnswer(answer, index)"
                                    >
                                        Удалить ответ
                                    </v-btn>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-alert v-else dense type="info">
                        Не добавлено ни одного ответа к вопросу. Нажмите на "Добавить ответ", чтобы добавить первый ответ
                    </v-alert>
                    <div class="mt-2">
                        <v-btn link small color="primary" outlined @click="showAddAnswerPopup = true">Добавить ответ</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-if="showAddAnswerPopup"
            v-model="showAddAnswerPopup"
            max-width="1000"
        >
            <v-card>
                <v-card-title>
                    Добавление ответа
                </v-card-title>
                <v-card-text>
                    <product-answer-form :question="selectedQuestion" @save="createAnswer" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import DatatableMixin from '@/mixins/datatable';
import AdvancedSearchForm from '@/components/search/AdvancedSearchForm';
import ProductQuestion from "~/modules/product-question/models/ProductQuestion";
import PageHeader from '~/components/common/PageHeader';
import { productQuestionStatusLabels } from "~/enums";
import CheckCircleIcon from '~/components/heroicons/CheckCircleIcon';
import XCircleIcon from '~/components/heroicons/XCircleIcon';
import EyeIcon from '~/components/heroicons/XCircleIcon';
import ChatAlt2Icon from '~/components/heroicons/ChatAlt2Icon';
import ProductAnswerForm from "~/modules/product-question/components/ProductAnswerForm";

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
        CheckCircleIcon,
        XCircleIcon,
        EyeIcon,
        ChatAlt2Icon,
        ProductAnswerForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            product_questions: [],
            searchForm: {
                live: null,
                id: null,
                status: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Товар', align: 'left', value: 'product_id' },
                { text: 'Автор', align: 'left', value: 'clientName' },
                { text: 'Статус', value: 'status' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: 'Вопрос', align: 'left', value: 'text' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [
                { text: 'Список вопросов к товарам' },
            ],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Статус',
                    name: 'status',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: productQuestionStatusLabels,
                },
            ],
            showQuestionDetailsPopup: false,
            showQuestionAnswersPopup: false,
            showAddAnswerPopup: false,
            selectedQuestion: null,
            selectedAnswerPanel: null,
        };
    },
    async fetch() {
        this.showLoading();
        const response = await ProductQuestion.query()
            .params(this.queryParams)
            .with(['client', 'product', 'product.brand', 'productAnswers', 'productAnswersCount'])
            .get();
        this.product_questions = ProductQuestion.hydrate(response.data);
        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Отзывы к товарам',
    },
    watch: {
        showQuestionAnswersPopup(value) {
            if(!value) {
                this.closeAnswerPanels();
                this.selectedQuestion = null;
            }
        }
    },
    methods: {
        async deleteProductQuestion(product_question) {
            if (!(await this.$confirm(`Вы действительно хотите удалить вопрос?`))) {
                return;
            }
            try {
                await product_question.delete();
                this.$snackbar(`Вопрос к товару успешно удален`);
                this.product_questions = this.product_questions.filter((item) => item.id !== product_question.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async approveQuestion(question) {
            if (!(await this.$confirm(`Вы действительно хотите одобрить вопрос?`))) {
                return;
            }
            try {
                await question.approve();
                this.$snackbar(`Вопрос успешно одобрен`);
                this.$fetch();
                this.showQuestionDetailsPopup = false;
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async rejectQuestion(question) {
            if (!(await this.$confirm(`Вы действительно хотите отклонить вопрос?`))) {
                return;
            }
            try {
                await question.reject();
                this.$snackbar(`Вопрос успешно отклонен`);
                this.$fetch();
                this.showQuestionDetailsPopup = false;
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        showQuestion(question) {
            this.selectedQuestion = question;
            this.showQuestionDetailsPopup = true;
        },
        async removeAnswer(answer, index) {
            if (!(await this.$confirm(`Вы действительно хотите удалить этот ответ?`))) {
                return;
            }
            try {
                await this.$axios.delete(`/admin/product-answers/${answer.id}`);
                this.$snackbar(`Ответ успешно удалено`);
                this.selectedQuestion.product_answers.splice(index, 1);
                this.$fetch();
                this.closeAnswerPanels();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async createAnswer(form) {
            try {
                const { data } = await form.post('/admin/product-answers');
                this.selectedQuestion.product_answers.push(data);
                this.showAddAnswerPopup = false;
                this.$fetch();
                this.closeAnswerPanels();
                this.$snackbar(`Ответ успешно добавлен`);
            }
            catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении ответа: ${e.message}`);
            }
        },
        async updateAnswer(answer, index, form) {
            try {
                const { data } = await form.put(`/admin/product-answers/${answer.id}`);
                this.$snackbar(`Ответ успешно обновлен`);
                this.selectedQuestion.product_answers[index] = data;
                this.closeAnswerPanels();
            }
            catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении ответа: ${e.message}`);
            }
        },
        closeAnswerPanels() {
            this.selectedAnswerPanel = undefined;
        },
    },
};
</script>
