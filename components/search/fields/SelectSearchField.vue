<template>
    <div>
        <v-select
            :items="items"
            :value="toInputValue"
            :label="label"
            dense
            :multiple="multiple"
            hide-details
            @change="$emit('input', $event)"
        />
        <portal v-if="isEnabled" :to="`filter-${name}-chips`">
            <div>
                <template v-if="multiple">
                    <v-chip v-for="(item, index) in value" :key="index" close @click:close="removeMultipleChip(index)">
                        {{ label }}: {{ getItemTextByValue(item) }}
                    </v-chip>
                </template>
                <template v-else>
                    <v-chip close @click:close="removeChip"> {{ label }}: {{ getItemTextByValue(value) }} </v-chip>
                </template>
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
        items: {
            type: Array,
            required: true,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        toInputValue() {
            if (this.multiple) {
                const arrayValue = !Array.isArray(this.value) ? Array(this.value) : this.value;
                return arrayValue.filter((value) => value).map((value) => (typeof value === Number ? +value : value));
            }
            return +this.value;
        },
        isEnabled() {
            if (this.multiple) {
                return Array.isArray(this.value) && Boolean(this.value.length);
            }

            return Boolean(this.value);
        },
    },
    methods: {
        removeChip() {
            this.$emit('input', null);
        },
        removeMultipleChip(index) {
            const currentValue = [...this.value];
            currentValue.splice(index, 1);
            this.$emit('input', currentValue);
        },
        getItemTextByValue(value) {
            const data = this.items.find((item) => ((item.value === typeof value) === Number ? +value : value))?.text;

            return data;
        },
    },
};
</script>
