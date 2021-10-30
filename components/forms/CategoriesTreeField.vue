<template>
    <div>
        <v-input v-if="!isLoading" v-bind="$attrs" class="treeselect-field">
            <treeselect
                :value="value"
                :multiple="multiple"
                :options="options"
                :normalizer="normalizer"
                placeholder=""
                @input="$emit('input', $event)"
            />
        </v-input>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { toTree } from '@/helpers';

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
            default: false,
        },
    },
    data() {
        return {
            categories: [],
            isLoading: true,
        };
    },
    computed: {
        options() {
            return toTree(this.categories);
        },
    },
    async created() {
        this.categories = await this.$axios
            .get('/categories/all', {
                params: {
                    'fields[categories]': 'id,name,parent_id,status',
                    sort: 'name',
                },
            })
            .then(({ data }) => data.data);
        this.isLoading = false;
    },
    methods: {
        normalizer(node) {
            return {
                id: node.id,
                label: node.name,
                children: node.children && node.children.length ? node.children : undefined,
            };
        },
    },
};
</script>

<style lang="scss">
.treeselect-field {
    padding-top: 12px;
    margin-top: 4px;
    .vue-treeselect {
        &--focused {
            .vue-treeselect__input {
            }
        }
    }
    .vue-treeselect__control {
        padding-left: 0;
        height: 40px;
        padding-right: 0;
        border: none;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.7);
    }
    .vue-treeselect:not(.vue-treeselect--disabled):not(.vue-treeselect--focused) .vue-treeselect__control:hover {
        border-color: red;
    }
    .v-label {
        position: absolute !important;
        z-index: 1;
    }
    .vue-treeselect__input-container {
        padding-left: 0;
        padding-right: 0;
        padding-top: 7px;
    }
    .vue-treeselect__input {
        &:focus {
        }
    }
    .vue-treeselect svg {
        color: rgba(0, 0, 0, 0.7);
    }

    .vue-treeselect__menu {
        margin-top: 1px;
        padding: 0;
        width: 100%;
        font-size: 1rem;
        border-radius: 0;
        border: none;
        box-shadow: 0px 5px 30px -3px rgb(85 85 85 / 8%), 0px 8px 30px 1px rgb(85 85 85 / 6%),
            0px 3px 30px 2px rgb(85 85 85 / 3%);
    }

    .vue-treeselect__multi-value-item {
        font-size: 1rem;
    }

    .vue-treeselect__checkbox {
        border: 0;
        align-items: center;
        font-feature-settings: 'liga';
        font-size: 24px;
        justify-content: center;
        letter-spacing: normal;
        line-height: 1;
        position: relative;
        text-indent: 0;
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font: normal normal normal 24px/1 'Material Design Icons';
        margin: 0;
        width: 24px;
        height: 27px;
        &:before {
            content: '\F0131';
        }
        &--checked {
            &:before {
                content: '\F0132';
                color: rgb(231, 243, 248);
            }
        }
    }
    .vue-treeselect__check-mark {
        display: none;
    }
    .vue-treeselect__minus-mark {
        display: none;
    }
    .vue-treeselect__option {
        display: flex;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;
        &--selected {
            background: rgb(231, 243, 248);
        }
    }
    .vue-treeselect__option-arrow-container {
        display: block;
    }
    .vue-treeselect__checkbox--unchecked {
        background: transparent;
    }
    .vue-treeselect__label-container {
        display: flex;
        align-items: center;
    }
    .vue-treeselect__checkbox-container {
        display: block;
        margin-right: 10px;
        margin-left: 5px;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
        background: transparent;
    }
    .vue-treeselect__label {
        display: block;
    }
    .vue-treeselect__option--hide {
        display: none;
    }
}
/*display: inline-block;*/
/*font: normal normal normal 24px/1 "Material Design Icons";*/
/*font-size: inherit;*/
/*text-rendering: auto;*/
/*line-height: inherit;*/
/*-webkit-font-smoothing: antialiased;*/
/*-moz-osx-font-smoothing: grayscale;*/
</style>
