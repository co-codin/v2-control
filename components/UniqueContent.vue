<template>
    <v-checkbox v-model="isChecked" :label="label" @click.prevent="handleUniqueContent" />
</template>

<script>
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
        async handleUniqueContent() {
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
            await this.getUniqueContent();
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
