<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels>
            <v-expansion-panel v-for="(requirement, index) in form.requirements" :key="index">
                <v-expansion-panel-header class="title">
                    #{{ index + 1 }}. {{ requirement.key || '(без названия)' }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-text-field
                        label="Название"
                        dense
                        :value="requirement.key"
                        :error-messages="form.errors.get(`requirements.${index}.key`)"
                        :error="form.errors.has(`requirements.${index}.key`)"
                        @input="(value) => updateField({ field: `requirements.${index}.key`, value })"
                    />
                    <v-text-field
                        label="Значение"
                        dense
                        :value="requirement.value"
                        :error-messages="form.errors.get(`requirements.${index}.value`)"
                        :error="form.errors.has(`requirements.${index}.value`)"
                        @input="(value) => updateField({ field: `requirements.${index}.value`, value })"
                    />
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
    data: () => ({}),
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
