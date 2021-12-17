<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels>
            <v-expansion-panel v-for="(requirement, index) in form.requirements" :key="index">
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
                                                :value="requirement.group_name"
                                                :error-messages="form.errors.get(`requirements.${index}.group_name`)"
                                                :error="form.errors.has(`requirements.${index}.group_name`)"
                                                placeholder="Введите название группу требования"
                                                label="Группа требования"
                                                @input="
                                                    (value) =>
                                                        updateField({
                                                            field: `requirements.${index}.group_name`,
                                                            value,
                                                        })
                                                "
                                            />
                                            <v-divider class="my-2" />
                                            <div class="text-center">
                                                <v-btn
                                                    small
                                                    class="white--text"
                                                    color="red"
                                                    @click="removeRequirementGroup(index)"
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
                                                <v-expansion-panel
                                                    v-for="(req, i) in requirement.requirements"
                                                    :key="'req-' + i"
                                                >
                                                    <v-expansion-panel-header class="title">
                                                        {{ req.key || '(без названия)' }}
                                                    </v-expansion-panel-header>
                                                    <v-expansion-panel-content>
                                                        <v-text-field
                                                            label="Название"
                                                            dense
                                                            :value="requirement.key"
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
                                                            @input="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `requirements.${index}.requirements.${i}.key`,
                                                                        value,
                                                                    })
                                                            "
                                                        />
                                                        <v-text-field
                                                            label="Значение"
                                                            dense
                                                            :value="requirement.value"
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
                                                            @input="
                                                                (value) =>
                                                                    updateField({
                                                                        field: `requirements.${index}.requirements.${i}.value`,
                                                                        value,
                                                                    })
                                                            "
                                                        />

                                                        <v-divider class="my-2" />
                                                        <div class="text-center">
                                                            <v-btn
                                                                small
                                                                class="white--text"
                                                                color="red"
                                                                @click="removeRequirement({ index, i })"
                                                            >
                                                                Удалить требование
                                                            </v-btn>
                                                        </div>
                                                    </v-expansion-panel-content>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                            <div class="mt-2">
                                                <v-btn
                                                    link
                                                    small
                                                    color="primary"
                                                    outlined
                                                    @click="addRequirement(index)"
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
                    <v-divider class="my-2" />
                    <div class="text-center">
                        <v-btn small class="white--text" color="red" @click="removeRequirement(index)">
                            Удалить требование
                        </v-btn>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div class="mt-2">
            <v-btn link small color="primary" outlined @click="addRequirement"> Добавить требование </v-btn>
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

export default {
    data: () => ({
        tab: null,
        tabs: [
            { tab: 'О группе', key: 'information' },
            { tab: 'Требования ', key: 'requirements' },
        ],
    }),
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
            form: 'forms/cabinet/form',
        }),
    },
    methods: {
        ...mapMutations({
            updateField: 'forms/cabinet/UPDATE_FIELD',
            closeAllPanels: 'helper/closeAllPanels',
            addRequirement: 'forms/cabinet/ADD_REQUIREMENT',
            removeRequirement: 'forms/cabinet/REMOVE_REQUIREMENT',
            addRequirementGroup: 'forms/cabinet/ADD_REQUIREMENT_GROUP',
            removeRequirementGroup: 'forms/cabinet/REMOVE_REQUIREMENT_GROUP',
            fillErrors: 'forms/cabinet/FILL_ERRORS',
        }),
        ...mapActions({
            createRequirements: 'forms/cabinet/updateCabinet',
        }),
        async save() {
            try {
                await this.createRequirements(this.cabinet.id);
                this.$snackbar(`Требования успешно обновлены`);
                this.closeAllPanels();
            } catch (e) {
                const errors = e?.response?.data?.errors;
                if (errors) {
                    this.fillErrors(errors);
                }
                this.$snackbar(`Произошла ошибка при обновлении требований: ${e.message}`);
            }
        },
    },
};
</script>
