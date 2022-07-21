<template>
    <div>
        <v-list-item
            v-if="!menuItem.items"
            :input-value="menuItem.value"
            :to="menuItem.link"
            :exact="menuItem.exact"
            :disabled="menuItem.disabled"
            active-class="primary--text"
            link
        >
            <v-list-item-content class="position-relative">
                <v-list-item-title class="d-flex">
                    <svg-icon style="width: 10%; height: 10%; margin-right: 20px;" :name="menuItem.icon" :class="{ 'grey--text': menuItem.disabled }" />

                    {{ menuItem.text }}
                </v-list-item-title>
                <v-badge
                    v-if="menuItem.badge"
                    class="position-absolute"
                    color="success"
                    dot
                    style="right: 12px; top: 18px;"
                >
                </v-badge>
            </v-list-item-content>
        </v-list-item>

        <v-list-group
            v-else
            :value="menuItem.regex ? menuItem.regex.test($route.path) : false"
            :disabled="menuItem.disabled"
            :sub-group="subgroup"
            :to="menuItem.link"
            link
        >
            <template #activator>

                <v-list-item-content>
                    <v-list-item-title class="d-flex">
                        <svg-icon style="width: 10%; height: 10%; margin-right: 20px;" :name="menuItem.icon" :class="{ 'grey--text': menuItem.disabled }" />

                        {{ menuItem.text }}
                    </v-list-item-title>
                </v-list-item-content>
            </template>

            <slot></slot>
        </v-list-group>
    </div>
</template>

<script>
import SvgIcon from '~/components/SvgIcon'
export default {
    components: {
        SvgIcon
    },
    props: {
        menuItem: {
            type: Object,
            default: () => {},
        },
        subgroup: {
            type: Boolean,
            default: false,
        },
        small: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
