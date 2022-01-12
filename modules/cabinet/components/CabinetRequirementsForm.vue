<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels v-if="form">
            <draggable v-model="form.requirements" class="width-full">
                <v-expansion-panel v-for="(requirement, index) in form.requirements" :key="'requirement-' + index">
                    <v-expansion-panel-header class="title">
                        #{{ index + 1 }}. {{ requirement.group_name || '(без названия)' }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-tabs v-model="tab" grow background-color="transparent">
                                <v-tab v-for="item in tabs" :key="item.key">
                                    {{ item.tab }}
                                </v-tab>
                                <v-tabs-items v-model="tab" style="width: 100%">
                                    <v-tab-item key="information">
                                        <v-card flat>
                                            <v-card-text>
                                                <v-text-field
                                                    v-model="requirement.group_name"
                                                    :error-messages="
                                                        form.errors.get(`requirements.${index}.group_name`)
                                                    "
                                                    :error="form.errors.has(`requirements.${index}.group_name`)"
                                                    placeholder="Введите название группу требований"
                                                    label="Группа требования"
                                                />
                                                <v-text-field
                                                    v-model="requirement.column_key"
                                                    :error-messages="
                                                        form.errors.get(`requirements.${index}.column_key`)
                                                    "
                                                    :error="form.errors.has(`requirements.${index}.column_key`)"
                                                    placeholder="Введите название колонки"
                                                    label="Название колонки"
                                                />
                                                <v-text-field
                                                    v-model="requirement.column_value"
                                                    :error-messages="
                                                        form.errors.get(`requirements.${index}.column_value`)
                                                    "
                                                    :error="form.errors.has(`requirements.${index}.column_value`)"
                                                    placeholder="Введите значение колонки"
                                                    label="Значение колонки"
                                                />
                                                <v-divider class="my-2" />
                                                <div class="text-center">
                                                    <v-btn
                                                        small
                                                        class="white--text"
                                                        color="red"
                                                        @click="form.requirements.splice(index, 1)"
                                                    >
                                                        Удалить группу
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                    <v-tab-item key="requirements">
                                        <v-card flat>
                                            <v-card-text>
                                                <v-expansion-panels>
                                                    <draggable v-model="requirement.requirements" class="width-full">
                                                        <v-expansion-panel
                                                            v-for="(req, i) in requirement.requirements"
                                                            :key="'req-' + i"
                                                        >
                                                            <v-expansion-panel-header class="title">
                                                                {{ req.key || '(без названия)' }}
                                                            </v-expansion-panel-header>
                                                            <v-expansion-panel-content>
                                                                <v-text-field
                                                                    v-model="req.key"
                                                                    label="Название"
                                                                    dense
                                                                    :error-messages="
                                                                        form.errors.get(
                                                                            `requirements.${index}.requirements.${i}.key`
                                                                        )
                                                                    "
                                                                    :error="
                                                                        form.errors.has(
                                                                            `requirements.${index}.requirements.${i}.key`
                                                                        )
                                                                    "
                                                                />
                                                                <v-text-field
                                                                    v-model="req.value"
                                                                    label="Значение"
                                                                    dense
                                                                    :error-messages="
                                                                        form.errors.get(
                                                                            `requirements.${index}.requirements.${i}.value`
                                                                        )
                                                                    "
                                                                    :error="
                                                                        form.errors.has(
                                                                            `requirements.${index}.requirements.${i}.value`
                                                                        )
                                                                    "
                                                                />

                                                                <v-divider class="my-2" />
                                                                <div class="text-center">
                                                                    <v-btn
                                                                        small
                                                                        class="white--text"
                                                                        color="red"
                                                                        @click="requirement.requirements.splice(i, 1)"
                                                                    >
                                                                        Удалить требование
                                                                    </v-btn>
                                                                </div>
                                                            </v-expansion-panel-content>
                                                        </v-expansion-panel>
                                                    </draggable>
                                                </v-expansion-panels>
                                                <div class="mt-2">
                                                    <v-btn
                                                        link
                                                        small
                                                        color="primary"
                                                        outlined
                                                        @click="addRequirement(requirement)"
                                                    >
                                                        Добавить требование
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-tabs>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </draggable>
        </v-expansion-panels>
        <div class="mt-2">
            <v-btn link small color="primary" outlined @click="addGroup"> Добавить группу требований </v-btn>
        </div>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import draggable from 'vuedraggable';
import Form from 'form-backend-validation';

export default {
    components: {
        draggable,
    },
    data: () => ({
        formDefaults: {
            requirements: [],
        },
        form: null,
        tab: null,
        tabs: [
            { tab: 'О группе', key: 'information' },
            { tab: 'Требования ', key: 'requirements' },
        ],
    }),
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
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
        addRequirement(requirement) {
            if (!requirement.requirements || !Array.isArray(requirement.requirements)) {
                requirement.requirements = [];
            }
            requirement.requirements.push({
                text: null,
                value: null,
            });
        },
        addGroup() {
            if (!this.form.requirements || !Array.isArray(this.form.requirements)) {
                this.form.requirements = [];
            }
            this.form.requirements.push({
                group_name: null,
                column_key: null,
                column_value: null,
                requirements: [],
            });
        },
        async save() {
            try {
                await this.form.patch(`/admin/cabinets/${this.cabinet.id}`);
                this.$snackbar(`Требования успешно обновлены`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обновлении требований: ${e.message}`);
            }
        },
    },
};
</script>
