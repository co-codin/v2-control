<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">{{ title }}</v-expansion-panel-header>
        <v-expansion-panel-content eager>
            <slot></slot>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
    },
};
</script>
