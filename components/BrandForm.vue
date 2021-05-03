<template>
  <v-form @submit.prevent="$emit('send', form)">

    <v-text-field
      v-model="form.name"
      label="Название"
      :error-messages="form.errors.get('name')"
      :error="form.errors.has('name')"
    ></v-text-field>

    <v-text-field v-if="isUpdating"
      v-model="form.slug"
      label="Ссылка"
      :error-messages="form.errors.get('slug')"
      :error="form.errors.has('slug')"
    ></v-text-field>

    <v-text-field
      label="Статус"
      v-model="form.status"
    ></v-text-field>

    <file-field
      v-model="form.image"
      @input="form.is_image_changed = true"
      :error-messages="form.errors.get('image')"
      :error="form.errors.has('image')"
    ></file-field>

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
    const { $axios } = useContext();
    const defaults = {
      name: null,
      slug: null,
      status: 1,
      image: null,
      is_image_changed: false,
    }
    const form = ref(
      Form.create(defaults)
        .withOptions({ http: $axios })
        .populate(props.brand || {})
    )

    watch(props.brand, (value) => {
      form.value.populate(Object.assign({}, value));
    });

    return { form }
  },
});
</script>

