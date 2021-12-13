<template>
    <v-form @submit.prevent="saveRequirements">
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header class="title"> Площадь кабинета </v-expansion-panel-header>
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
            <v-btn link small color="primary" outlined> Добавить группу </v-btn>
        </div>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
export default {
    data: () => ({
        tab: null,
        tabs: [
            { tab: 'О группе', key: 'information' },
            { tab: 'Список требований', key: 'requirements' },
        ],
        groups: [{ name: 'Процедурный кабинет' }, { name: 'Смотровая' }],
    }),
    methods: {
        saveRequirements() {
            alert('saving');
        },
    },
};
</script>
