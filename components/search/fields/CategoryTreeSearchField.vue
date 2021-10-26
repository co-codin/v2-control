<template>
    <div>
        <v-input :label="label">
            <treeselect
                @input="$emit('input', $event)"
                :value="value"
                :multiple="multiple"
                :options="options"
                :normalizer="normalizer"
            />
        </v-input>
        <portal
            v-if="chips"
            :to="`filter-${name}-chips`"
        >
            <v-chip v-for="chip in chips" close :input-value="chip.value" @click="removeChip(chip.value)"
                    :key="chip.value">
                {{ chip.label }}
            </v-chip>
        </portal>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {toTree, fetchAllEntries} from "../../../helpers";

export default {
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
        }
    },
    components: {
        Treeselect,
    },
    data() {
        return {
            entries: [],
        }
    },
    computed: {
        options() {
            return toTree(this.entries);
        },
        chips() {
            if (!this.value) {
                return [];
            }
            return [this.value].flat().map(id => ({
                value: id,
                label: this.entries.find(entry => entry.id === +id)?.name,
            }));
        },
    },
    methods: {
        normalizer(node) {
            return {
                id: node.id,
                label: node.name,
                children: node.children && node.children.length ? node.children : undefined,
            }
        },
        removeChip(e) {
            let value = [...this.value];
            value.splice(this.value.indexOf(e), 1);
            this.$emit('input', value);
        },
    },
    async created() {
        this.entries = await fetchAllEntries(page => {
            return this.$axios.get("/categories", {
                params: {
                    "page[size]": 100,
                    "page[number]": page,
                    "fields[categories]": "id,name,parent_id",
                }
            });
        });
    }
}
</script>
