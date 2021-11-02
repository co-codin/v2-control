<template>
    <v-form @submit.prevent="save">
        <v-alert dense type="info" outlined>
            В скором времени здесь появится возможность подгрузки сертификатов и прочей документации
        </v-alert>
        <file-field v-model="form.booklet" :is-image="false" label="Брошюра" />
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import FileField from '~/components/forms/FileField';

export default {
    components: {
        FileField,
    },
    data: () => ({
        form: {},
    }),
    created() {},
    methods: {
        async save() {},
    },
};
</script>
