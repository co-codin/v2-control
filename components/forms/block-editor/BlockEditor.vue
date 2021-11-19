<template>
    <div>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header class="title">
                    Текстовый блок
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-textarea
                        dense
                        label="Текст"
                        placeholder="Введите текст"
                    />
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header class="title">
                    Изображение
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <file-field
                        dense
                        label="Изображение"
                        prepend-icon="mdi-image"
                    />
                    <v-text-field
                        dense
                        label="Alt"
                    />
                    <v-text-field
                        dense
                        label="Подпись"
                    />
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header class="title">
                    Вопросы и ответы
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-expansion-panels>
                        <v-expansion-panel v-for="(question, index) in questions" :key="index">
                            <v-expansion-panel-header class="title">
                                {{ question.question || '(не задано)' }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-text-field
                                    label="Вопрос"
                                    dense
                                    v-model="question.question"
                                />
                                <v-textarea
                                    label="Ответ"
                                    dense
                                    v-model="question.answer"
                                />
                                <div class="text-center">
                                    <v-btn color="red" dark small @click="removeQuestion(index)">
                                        Удалить вопрос
                                    </v-btn>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <div class="mt-2">
                        <v-btn @click="addQuestion" small color="primary" dark>Добавить вопрос</v-btn>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header class="title">
                    Вопросы и ответы
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-expansion-panels>
                        <v-expansion-panel v-for="(image, index) in gallery" :key="index">
                            <v-expansion-panel-header class="title">
                                {{ question.question || '(не задано)' }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <file-field
                                    dense
                                    label="Изображение"
                                    prepend-icon="mdi-image"
                                />
                                <v-text-field
                                    dense
                                    label="Alt"
                                />
                                <v-text-field
                                    dense
                                    label="Подпись"
                                />
                                <div class="text-center">
                                    <v-btn color="red" dark small @click="removeQuestion(index)">
                                        Удалить вопрос
                                    </v-btn>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <div class="mt-2">
                        <v-btn @click="addQuestion" small color="primary" dark>Добавить вопрос</v-btn>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>

        </v-expansion-panels>
        <div>

        </div>
    </div>
</template>

<script>
import FileField from "~/components/forms/FileField";

export default {
    data: () => ({
        questions: [],
        gallery: [],
    }),
    components: {
        FileField,
    },
    methods: {
        addQuestion() {
            this.questions.push({
                question: null,
                answer: null,
            })
        },
        removeQuestion(index) {
            this.questions.splice(index, 1);
        },
        addImage() {
            this.gallery.push({
                image: null,
                alt: null,
                caption: null,
                width: null,
                height: null,
            })
        },
        removeImage(index) {
            this.gallery.splice(index, 1);
        },
    },
};
</script>
