<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels>
            <v-expansion-panel v-for="(requirement, index) in form.requirements" :key="index">
                <v-expansion-panel-header class="title"> {{ requirement.key }} </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-text-field label="Название" dense />
                    <v-text-field label="Значение" dense />
                    <v-divider class="my-2" />
                    <div class="text-center">
                        <v-btn small class="white--text" color="red"> Удалить требование </v-btn>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div class="mt-2">
            <v-btn link small color="primary" outlined> Добавить требование </v-btn>
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
    created() {
        this.initForm();
        this.fillForm(this.cabinet);
    },
    methods: {
        ...mapMutations({
            initForm: 'forms/cabinet/INIT_FORM',
            fillForm: 'forms/cabinet/FILL_FORM',
            fillErrors: 'forms/cabinet/FILL_ERRORS',
            updateField: 'forms/cabinet/UPDATE_FIELD',
            closeAllPanels: 'helper/closeAllPanels',
            addRequirement: 'forms/cabinet/ADD_REQUIREMENT',
            removeRequirement: 'forms/cabinet/REMOVE_REQUIREMENT',
        }),
        ...mapActions({
            createRequirements: 'forms/cabinet/createRequirements',
        }),
        async save() {
            await this.createRequirements(this.cabinet.id);
            this.$snackbar(`Требования успешно обновлены`);
            this.closeAllPanels();
        },
    },
};
</script>
