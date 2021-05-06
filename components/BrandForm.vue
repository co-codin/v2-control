<template>
  <v-form @submit.prevent="$emit('send', form)">

    <v-text-field
      v-model="form.name"
      label="Название"
      :error-messages="form.errors.get('name')"
      :error="form.errors.has('name')"
    ></v-text-field>

    <v-text-field
      v-model="form.slug"
      label="Ссылка"
      :error-messages="form.errors.get('slug')"
      :error="form.errors.has('slug')"
    ></v-text-field>

    <v-text-field
      label="Сайт"
      v-model="form.website"
      :error-messages="form.errors.get('website')"
      :error="form.errors.has('website')"
    ></v-text-field>

    <v-textarea
      label="Краткое описание"
      v-model="form.short_description"
      :error-messages="form.errors.get('short_description')"
      :error="form.errors.has('short_description')"
    ></v-textarea>

    <v-textarea
      label="Подробное описание"
      v-model="form.full_description"
      :error-messages="form.errors.get('full_description')"
      :error="form.errors.has('full_description')"
    ></v-textarea>

    <v-checkbox
      label="Отображать на главной"
      v-model="form.is_in_home"
      :error-messages="form.errors.get('is_in_home')"
      :error="form.errors.has('is_in_home')"
    ></v-checkbox>

    <file-field
      v-model="form.image"
      @input="form.is_image_changed = true"
      :error-messages="form.errors.get('image')"
      :error="form.errors.has('image')"
    ></file-field>

    <v-text-field
      label="Страна"
      v-model="form.country"
      :error-messages="form.errors.get('country')"
      :error="form.errors.has('country')"
    ></v-text-field>

    <v-select
      label="Статус"
      v-model="form.status"
      :items="statusLabels"
      :error-messages="form.errors.get('status')"
      :error="form.errors.has('status')"
    ></v-select>

    <slot name="buttons">
      <v-btn type="submit">Сохранить</v-btn>
    </slot>

  </v-form>
</template>


<script>
import { Form } from 'form-backend-validation';
import FileField from "./FileField";
import { defineComponent, ref, useContext, watch } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    brand: {
      type: Object | null,
      default: () => ({}),
    },
    isUpdating: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    FileField,
  },
  setup(props) {
    const statusLabels = [
      { value: 1, text: 'Active' },
      { value: 2, text: 'Inactive' },
      { value: 3, text: 'Only By Url' },
    ];
    const { $axios } = useContext();
    const defaults = {
      name: null,
      slug: null,
      status: 1,
      image: null,
      is_image_changed: false,
      is_in_home: false,
      website: null,
      short_description: null,
      full_description: null,
      country: null,
    }
    const form = ref(
      Form.create(defaults)
        .withOptions({ http: $axios })
        .populate(props.brand || {})
    )

    watch(props.brand, (value) => {
      form.value.populate(Object.assign({}, value));
    });

    return { form, statusLabels }
  },
});
</script>

