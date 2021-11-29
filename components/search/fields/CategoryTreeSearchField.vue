<template>
    <div>
        <v-input>
            <div class="input-custom">
                <template @slot="label">
                    {{ label }}
                </template>
                <treeselect
                    class="mt-1"
                    :value="value"
                    :multiple="multiple"
                    :options="categoryTree"
                    :normalizer="normalizer"
                    @input="$emit('input', $event)"
                />
            </div>
        </v-input>

        <portal v-if="chips.length" :to="`filter-${name}-chips`">
            <div>
                <v-chip
                    v-for="(chip, index) in chips"
                    :key="'category-' + index"
                    close
                    @click:close="removeChip(chip.value)"
                >
                    {{ chip.label }}
                </v-chip>
            </div>
        </portal>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { mapActions, mapGetters } from 'vuex';

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
    computed: {
        ...mapGetters({
            categoryTree: 'category/categoryTree',
            categories: 'category/categories',
        }),
        chips() {
            if (!this.value) {
                return [];
            }
            return [this.value].flat().map((id) => ({
                value: id,
                label: this.categories.find((entry) => entry.id === +id)?.name,
            }));
        },
    },
    async created() {
        await this.getCategories();
    },
    methods: {
        ...mapActions({
            getCategories: 'category/getCategories',
        }),
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

<style scoped>
.input-custom {
    flex-direction: column;
}
</style>
