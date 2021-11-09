<template>
    <div class="file-field-wrap">
        <div v-if="isUploaded">
            <div class="v-label v-label-active theme--light">
                {{ $attrs.label }}
            </div>
            <v-row>
                <v-col class="pt-2">
                    <v-card>
                        <v-img v-if="isImage" :src="url" class="white--text align-end" min-height="200px" />
                        <v-card-title v-else>{{ value }}</v-card-title>
                        <v-card-actions>
                            <v-btn icon @click="openImage">
                                <external-link-icon />
                            </v-btn>
                            <v-spacer />
                            <v-btn icon @click="copyImageLink">
                                <copy-icon />
                            </v-btn>
                            <v-spacer />
                            <v-btn icon @click="$emit('delete', value)">
                                <trash-icon width="26" />
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import TrashIcon from '@/components/heroicons/TrashIcon';
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';
import CopyIcon from '~/components/heroicons/CopyIcon';

export default {
    components: {
        CopyIcon,
        ExternalLinkIcon,
        TrashIcon,
    },
    props: {
        value: {
            default: null,
            type: String | File,
        },
        isImage: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        isUploaded() {
            return typeof this.value === 'string';
        },
        url() {
            return this.isImage ? `${this.$config.app.storageUrl}/${this.value}` : null;
        },
    },
    methods: {
        async copyImageLink() {
            try {
                await navigator.clipboard.writeText(this.url);
                this.$snackbar('Ссылка копирована');
            } catch (e) {
                this.$snackbar('Произошла ошибка при копировании ссылки');
            }
        },

        openImage() {
            window.open(this.url);
        },
    },
};
</script>

<style lang="scss" scoped>
.file-field-wrap {
    width: 33%;
    padding: 15px;
}
</style>
