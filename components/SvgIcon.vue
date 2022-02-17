<template>
    <div @click="$emit('click', $event)" v-html="require(`assets/icons/site-icons/${name}.svg?raw`)"></div>
</template>
<script>
export default {
    name: 'SvgIcon',
    props: {
        name: {
            type: String,
            required: true,
        },
    },
};
</script>
