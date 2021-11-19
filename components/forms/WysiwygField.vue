<template>
    <v-input v-bind="$attrs" class="content-editor">
        <content-editor :value="value" @input="$emit('input', $event)" />
    </v-input>
</template>

<script>
import ContentEditor from '~/components/editors/ContentEditor';

export default {
    components: {
        ContentEditor,
    },
    props: {
        value: {
            default: null,
        },
    },
};
</script>
