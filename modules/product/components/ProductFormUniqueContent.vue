<template>
    <v-card tile class="mt-5 block-wrap">
        <v-card-title>
            Уникальный контент
            <v-btn text small color="info" class="ml-3" @click="editing = !editing">
                {{ editing ? 'Свернуть' : 'Развернуть' }}
            </v-btn>
        </v-card-title>
        <v-card-text v-show="editing">
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
        </v-card-text>
    </v-card>
</template>

<script>
import UniqueContent from '@/components/UniqueContent';

export default {
    components: {
        UniqueContent,
    },
    props: ['product_id'],
    data() {
        return {
            editing: false,
        };
    },
    computed: {
        productIdInInteger() {
            return +this.product_id;
        },
    },
};
</script>
