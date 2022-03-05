<template>
    <v-input v-bind="$attrs" hide-details="auto" class="categories-tree-field">
        <div class="input-custom">
            <treeselect
                class="mt-1"
                :value="value"
                :multiple="multiple"
                :options="categoryTree"
                :normalizer="normalizer"
                :flat="true"
                @input="$emit('input', $event)"
            >
                <label
                    slot="option-label"
                    slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }"
                    :class="labelClassName"
                >
                    <span :class="{ 'text--disabled': node.raw.status.key !== 'ACTIVE' }">{{ node.label }}</span>
                </label>
            </treeselect>
        </div>
    </v-input>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { mapGetters } from 'vuex';

export default {
    components: {
        Treeselect,
    },
    props: {
        value: {
            default: null,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        ...mapGetters({
            categoryTree: 'category/categoryTree',
            categories: 'category/categories',
        }),
    },
    methods: {
        normalizer(node) {
            return {
                id: node.id,
                label: node.name,
                status: node.status,
                children: node.children && node.children.length ? node.children : undefined,
            };
        },
    },
};
</script>

<style lang="scss">
.categories-tree-field {
    .v-input__slot {
        align-items: start;
        flex-direction: column;
    }
}
</style>
