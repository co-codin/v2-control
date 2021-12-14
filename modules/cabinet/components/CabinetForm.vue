<template>
    <v-form @submit.prevent="save">
        <v-text-field
            :value="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
            @input="(value) => updateField({ field: 'name', value })"
        />

        <v-text-field
            :value="form.slug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
            @input="(value) => updateField({ field: 'slug', value })"
        />

        <wysiwyg-field
            :value="form.full_description"
            class="mt-2"
            label="Подробное описание"
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
            @input="(value) => updateField({ field: 'full_description', value })"
        />

        <wysiwyg-field
            :value="form.welcome_text"
            class="mt-2"
            label="Приветственный текст"
            :error-messages="form.errors.get('welcome_text')"
            :error="form.errors.has('welcome_text')"
            @input="(value) => updateField({ field: 'welcome_text', value })"
        />

        <file-field
            :value="form.image"
            label="Фотография"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            prepend-icon="mdi-image"
            @input="
                (value) => {
                    updateField({ field: 'image', value });
                    updateField({ field: 'is_image_changed', value: true });
                }
            "
            @delete="
                () => {
                    updateField({ field: 'is_image_changed', value: true });
                    updateField({ field: 'image', value: null });
                }
            "
        />

        <v-select
            :value="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
            @change="(value) => updateField({ field: 'status', value })"
        />

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import WysiwygField from '~/components/forms/WysiwygField';
import FileField from '~/components/forms/FileField';
import { statusLabels } from '~/enums';

export default {
    components: { FileField, WysiwygField },
    props: {
        isUpdating: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        statusLabels,
    }),
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
            form: 'forms/cabinet/form',
        }),
    },
    methods: {
        ...mapActions({
            updateCabinet: 'forms/cabinet/updateCabinet',
            createCabinet: 'forms/cabinet/createCabinet',
        }),
        ...mapMutations({
            updateField: 'forms/cabinet/UPDATE_FIELD',
            closeAllPanels: 'helper/closeAllPanels',
            fillErrors: 'forms/cabinet/FILL_ERRORS',
        }),
        async save() {
            try {
                if (this.isUpdating) {
                    await this.updateCabinet(this.cabinet.id);
                    this.$snackbar(`Категории успешно обновлены`);
                    this.closeAllPanels();
                } else {
                    await this.createCabinet();
                }
            } catch (e) {
                const errors = e?.response?.data?.errors;
                if (errors) {
                    this.fillErrors(errors);
                }
                this.$snackbar(`Произошла ошибка при обновлении категорий: ${e.message}`);
            }
        },
    },
};
</script>
