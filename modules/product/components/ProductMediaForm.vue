<template>
    <v-expansion-panels>
        <form-block title="Основная фотография">
            <product-main-image-form />
        </form-block>
        <form-block title="Дополнительные фотографии">
            <product-gallery-form />
        </form-block>
        <form-block title="Видеообзор">
            <product-video-form />
        </form-block>
    </v-expansion-panels>
</template>

<script>
import FormBlock from "~/components/forms/FormBlock";
import ProductMainImageForm from "~/modules/product/components/ProductMainImageForm";
import ProductGalleryForm from "~/modules/product/components/ProductGalleryForm";
import ProductVideoForm from "~/modules/product/components/ProductVideoForm";

export default {
    components: {
        FormBlock,
        ProductMainImageForm,
        ProductGalleryForm,
        ProductVideoForm,
    },
};
</script>
