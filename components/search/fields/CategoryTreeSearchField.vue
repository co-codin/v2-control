<template>
    <div>
        <v-input :label="label">
            <treeselect
                :value="value"
                :multiple="multiple"
                :options="options"
                :normalizer="normalizer"
                @input="$emit('input', $event)"
            />
        </v-input>

        <portal v-if="chips" :to="`filter-${name}-chips`">
            <v-chip
                v-for="chip in chips"
                :key="chip.value"
                close
                :input-value="chip.value"
                @click="removeChip(chip.value)"
            >
                {{ chip.label }}
            </v-chip>
        </portal>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { toTree, fetchAllEntries } from '../../../helpers';

export default {
    components: {
        Treeselect,
    },
    props: {
        label: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        value: {
            default: null,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            entries: [],
        };
    },
    computed: {
        options() {
            return toTree(this.entries);
        },
        chips() {
            console.log(this.value);
            if (!this.value) {
                return [];
            }
            return [this.value].flat().map((id) => ({
                value: id,
                label: this.entries.find((entry) => entry.id === +id)?.name,
            }));
        },
    },
    async created() {
        this.entries = await fetchAllEntries((page) => {
            return this.$axios.get('/categories', {
                params: {
                    'page[size]': 100,
                    'page[number]': page,
                    'fields[categories]': 'id,name,parent_id',
                },
            });
        });
    },
    methods: {
        normalizer(node) {
            return {
                id: node.id,
                label: node.name,
                children: node.children && node.children.length ? node.children : undefined,
            };
        },
        removeChip(e) {
            const value = [...this.value];
            value.splice(this.value.indexOf(e), 1);
            this.$emit('input', value);
        },
    },
};
</script>
