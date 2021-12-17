<template>
    <v-form @submit.prevent="saveGallery">
        <v-expansion-panels>
            <draggable v-model="form.images" style="width: 100%" @end="updateImagePositions">
                <v-expansion-panel v-for="(item, index) in form.images" :key="index">
                    <v-expansion-panel-header class="title">
                        <div>
                            <div class="d-flex align-center">
                                <div>
                                    <v-img
                                        max-height="70"
                                        max-width="70"
                                        :src="`${$config.app.storageUrl}/${item.image}`"
                                    />
                                </div>
                                <div class="ml-2">Фотография {{ index + 1 }}</div>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row>
                            <v-tabs v-model="tab" grow background-color="transparent">
                                <v-tab v-for="tab in tabs" :key="tab.key">
                                    {{ tab.name }}
                                </v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="tab" style="width: 100%">
                                <v-tab-item key="image">
                                    <v-card flat>
                                        <v-card-text>
                                            <v-img
                                                max-height="200"
                                                max-width="200"
                                                :src="`${$config.app.storageUrl}/${item.image}`"
                                                class="mb-3"
                                            />
                                            <v-divider class="my-2" />
                                            <div class="text-center">
                                                <v-btn
                                                    small
                                                    class="white--text"
                                                    color="red"
                                                    @click="deleteImage(index)"
                                                >
                                                    Удалить фотографию
                                                </v-btn>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab-item key="metadata">
                                    <v-card flat>
                                        <v-card-text>
                                            <v-text-field
                                                v-model="form.images[index].caption"
                                                label="Описание"
                                                dense
                                                :error-messages="form.errors.get(`images.${index}.caption`)"
                                                :error="form.errors.has(`images.${index}.caption`)"
                                            />
                                            <v-text-field
                                                v-model="form.images[index].alt"
                                                label="Alt"
                                                dense
                                                :error-messages="form.errors.get(`images.${index}.alt`)"
                                                :error="form.errors.has(`images.${index}.alt`)"
                                            />
                                            <v-text-field
                                                v-model="form.images[index].title"
                                                label="Title"
                                                dense
                                                :error-messages="form.errors.get(`images.${index}.title`)"
                                                :error="form.errors.has(`images.${index}.title`)"
                                            />
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </draggable>
        </v-expansion-panels>
        <file-uploader :multiple="true" :max="10" :object-format="true" @upload="addImage" />
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Form from 'form-backend-validation';
import draggable from 'vuedraggable';
import FileUploader from '~/components/FileUploader';
import FormBlock from '~/components/forms/FormBlock';
import FileField from '~/components/forms/FileField';

export default {
    components: {
        FormBlock,
        FileUploader,
        FileField,
        draggable,
    },
    data() {
        return {
            editing: false,
            formDefaults: {
                images: null,
            },
            form: null,
            tab: 'image',
            tabs: [
                { name: 'Изображение', key: 'parameters' },
                { name: 'Метаданные', key: 'metadata' },
            ],
        };
    },
    computed: {
        ...mapGetters({
            product: 'product/product',
        }),
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.product || {});
    },
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        async saveGallery() {
            try {
                await this.form.put(`/admin/products/${this.product.id}/images`);
                this.$snackbar(`Галерея товара успешно обновлена`);
                this.$nuxt.refresh();
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        deleteImage(index) {
            this.form.images.splice(index, 1);
        },
        addImage(e) {
            this.form.images.push({
                image: e.file,
                position: null,
                caption: null,
                alt: null,
                title: null,
            });
            this.updateImagePositions();
        },
        updateImagePositions() {
            let i = 0;
            this.form.images.forEach((item) => {
                item.position = ++i;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.gallery-form {
    display: flex;
    flex-wrap: wrap;
    margin-left: -15px;
    margin-right: -15px;
}
</style>
