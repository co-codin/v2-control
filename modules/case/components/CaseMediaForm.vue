<template>
    <v-expansion-panels>
        <form-block title="Основная фотография">
            <case-main-image-form />
        </form-block>
        <form-block title="Дополнительные фотографии">
            <case-gallery-form />
        </form-block>
    </v-expansion-panels>
</template>

<script>
import FormBlock from "~/components/forms/FormBlock";
import CaseMainImageForm from "~/modules/case/components/CaseMainImageForm";
import CaseGalleryForm from "~/modules/case/components/CaseGalleryForm";

export default {
    components: {
        FormBlock,
        CaseMainImageForm,
        CaseGalleryForm
    },
};
</script>
