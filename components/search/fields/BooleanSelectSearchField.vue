<template>
    <div>
        <v-select
            :items="items"
            :value="toInputValue"
            :label="label"
            dense
            hide-details
            @change="$emit('input', $event)"
        />
        <portal v-if="isEnabled" :to="`filter-${name}-chips`">
            <div>
                <v-chip close @click:close="removeChip"> {{ label }}: {{ getItemTextByValue(value) }} </v-chip>
            </div>
        </portal>
    </div>
</template>

<script>
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
        trueValue: {
            type: String | Number,
            default: 1,
        },
        falseValue: {
            type: String | Number,
            default: 0,
        },
        trueLabel: {
            type: String,
            default: 'Да',
        },
        falseLabel: {
            type: String,
            default: 'Нет',
        },
    },
    data() {
        return {
            items: [
                // { value: null, text: 'Не выбрано' },
                { value: this.trueValue, text: this.trueLabel },
                { value: this.falseValue, text: this.falseLabel },
            ],
        };
    },
    computed: {
        toInputValue() {
            return this.value !== '' && this.value !== null ? +this.value : null;
        },
        isEnabled() {
            return this.toInputValue !== null;
        },
    },
    methods: {
        removeChip() {
            this.$emit('input', null);
        },
        getItemTextByValue(value) {
            return this.items.find((item) => item.value === +value)?.text;
        },
    },
};
</script>
