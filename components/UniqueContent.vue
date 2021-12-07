<template>
    <v-switch v-model="isChecked" :label="label" inset @click.prevent="handleUniqueContent" />
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    props: {
        label: {
            required: false,
            type: String,
            default: 'Уникальный контент',
        },
        module: {
            required: true,
            type: String,
        },
        field: {
            required: true,
            type: String,
        },
        object: {
            required: true,
            type: Number,
        },
    },

    data() {
        return {
            isChecked: false,
            hasContent: false,
        };
    },

    async mounted() {
        await this.getUniqueContent();
    },

    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        async handleUniqueContent() {
            try {
                await this.$axios({
                    method: 'post',
                    url: this.hasContent ? '/unique-content/destroy' : '/unique-content',
                    baseURL: this.$config.app.contentUrl,
                    data: {
                        field: this.field,
                        module: this.module,
                        object: this.object,
                    },
                });
                this.$snackbar('Данные успешно обновлены');
                await this.getUniqueContent();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },

        async getUniqueContent() {
            const data = await this.$axios.$get('/unique-content', {
                baseURL: process.env.CONTENT_API_URL,
                params: {
                    'filter[field]': this.field,
                    'filter[module]': this.module,
                    'filter[object]': this.object,
                },
            });
            this.hasContent = data.length !== 0;
            this.isChecked = this.hasContent;
        },
    },
};
</script>
