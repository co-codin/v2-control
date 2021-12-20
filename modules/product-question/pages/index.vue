<template>
    <div>
        <page-header h1="Вопросы к товарам" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                    >
                        Добавить вопрос
                    </v-btn>
                </template>
                <span>
                    Добавление вопросов временно недоступно
                </span>
            </v-tooltip>
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

                <template #item.author="{ item }">
                    <div>
                        <template v-if="item.client.first_name">
                            {{ item.client.first_name }}
                        </template>
                        <template v-if="item.client.last_name">
                            {{ item.client.last_name }}
                        </template>
                    </div>
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
                            <external-link-icon class="h-6 w-6" />
                        </v-btn>
                    </div>
                </template>

                <template #item.action="{ item }">
                    <div class="actions text-no-wrap">
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            class="mr-1"
                            @click="selectedQuestion = item; showQuestionAnswersPopup = true"
                        >
                            <chat-alt2-icon class="h-6 w-6" />
                        </v-btn>

<!--                        <v-btn-->
<!--                            icon-->
<!--                            width="22"-->
<!--                            height="22"-->
<!--                            class="mr-1"-->
<!--                            @click="showQuestion(item)"-->
<!--                        >-->
<!--                            <eye-icon width="24" height="24" class="h-6 w-6" />-->
<!--                        </v-btn>-->
                        <v-btn
                            v-if="!item.isApproved"
                            icon
                            width="22"
                            height="22"
                            class="mr-1"
                            @click="approveQuestion(item)"
                        >
                            <check-circle-icon class="h-6 w-6" />
                        </v-btn>
                        <v-btn
                            v-if="!item.isRejected"
                            icon
                            width="22"
                            height="22"
                            class="mr-1"
                            @click="rejectQuestion(item)"
                        >
                            <x-circle-icon class="h-6 w-6" />
                        </v-btn>
<!--                        <v-btn-->
<!--                            icon-->
<!--                            width="22"-->
<!--                            height="22"-->
<!--                            class="mx-1"-->
<!--                            :to="{ name: 'product-questions.update', params: { id: item.id } }"-->
<!--                        >-->
<!--                            <pencil-alt-icon class="h-6 w-6" />-->
<!--                        </v-btn>-->
                        <v-btn icon width="22" height="22" @click.prevent="deleteProductQuestion(item)">
                            <trash-icon class="h-6 w-6" />
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog
            v-if="showQuestionDetailsPopup"
            v-model="showQuestionDetailsPopup"
            width="500"
        >
            <v-card>
                <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                >
                    Подробно об оставленном отзывы
                </v-card-title>

                <v-card-text>

                    <div>
                        <b>Опыт использования:</b>
                    </div>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="dialog = false"
                    >
                        I accept
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
                { text: 'Автор', align: 'left', value: 'author' },
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
            .with(['client', 'product', 'product.brand', 'productAnswers'])
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
                await this.$axios.put(`/admin/product-questions/${question.id}/approve`, {
                    comment: 'Вопрос к товару прошел проверку'
                });
                this.$snackbar(`Вопрос успешно одобрен`);
                this.$fetch();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async rejectQuestion(question) {
            if (!(await this.$confirm(`Вы действительно хотите отклонить вопрос?`))) {
                return;
            }
            try {
                await this.$axios.put(`/admin/product-questions/${question.id}/reject`, {
                    comment: 'Вопрос к товару не прошел проверку'
                });
                this.$snackbar(`Вопрос успешно отклонен`);
                this.$fetch();
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
