<template>
    <div>
        <v-text-field :value="value" dense :label="label" hide-details @input="updateInput($event)" />
        <portal v-if="Boolean(value)" :to="`filter-${name}-chips`">
            <div>
                <v-chip close @click:close="removeChip"> {{ label }}: {{ value }} </v-chip>
            </div>
        </portal>
    </div>
</template>

<script>
import { debounce } from 'lodash';

export default {
    props: {
        value: {
            default: null,
        },
        label: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    methods: {
        removeChip() {
            this.$emit('input', null);
        },
        updateInput: debounce(function (value) {
            this.$emit('input', value);
        }, 300),
    },
};
</script>
