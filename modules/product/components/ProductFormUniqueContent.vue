<template>
    <v-card outlined>
        <v-card-text>
            <UniqueContent
                module="product"
                field="short_description"
                label="Краткое описание"
                :object="productIdInInteger"
            />
            <UniqueContent
                module="product"
                field="full_description"
                label="Подробное описание"
                :object="productIdInInteger"
            />
            <UniqueContent module="product" field="booklet" label="Брошюра" :object="productIdInInteger" />
            <UniqueContent module="product" field="video" label="Видеообзор" :object="productIdInInteger" />
        </v-card-text>
    </v-card>
</template>

<script>
import UniqueContent from '@/components/UniqueContent';

export default {
    components: {
        UniqueContent,
    },
    props: ['productId'],
    computed: {
        productIdInInteger() {
            return +this.productId;
        },
    },
};
</script>
