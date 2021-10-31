<template>
    <div>
        <div v-if="isUploaded">
            <div class="v-label v-label-active theme--light">
                {{ $attrs.label }}
            </div>
            <v-row>
                <v-col cols="12" sm="4" md="3" class="pt-2">
                    <v-card>
                        <v-img
                            v-if="isImage"
                            :src="url"
                            class="white--text align-end"
                            min-height="200px"
                        />
                        <v-card-title v-else>{{ value }}</v-card-title>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn icon @click="$emit('input', null)" >
                                <trash-icon width="26"/>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <v-file-input
            v-else
            :value="value"
            @change="$emit('input', $event)"
            v-bind="$attrs"
        ></v-file-input>
    </div>
</template>

<script>
import TrashIcon from "@/components/heroicons/TrashIcon";
import DocumentTextIcon from "@/components/heroicons/DocumentTextIcon";

export default {
    components: {
        TrashIcon,
        DocumentTextIcon,
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
            return typeof this.value === "string";
        },
        url() {
            return this.isImage ? `${this.$config.app.storageUrl}/${this.value}` : null;
        },
    },
};
</script>

<style lang="scss">
</style>
