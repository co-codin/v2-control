<template>
    <v-input v-bind="$attrs" class="content-editor">
        <content-editor :value="value" @input="$emit('input', $event)" />
    </v-input>
</template>

<script>
import ContentEditor from "~/components/editors/ContentEditor";

export default {
    props: {
        value: {
            default: null,
        },
    },
    components: {
        ContentEditor,
    },
};
</script>
