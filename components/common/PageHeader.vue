<template>
    <div>
        <div class="display-1">{{ h1 }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 pt-1 pb-3"></v-breadcrumbs>
    </div>
</template>

<script>
export default {
    props: {
        h1: {
            type: String,
            required: true,
        },
        breadcrumbs: {
            type: Array,
            default: () => [],
        },
    },
};
</script>
