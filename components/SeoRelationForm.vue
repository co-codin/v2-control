<template>
  <v-form @submit.prevent="$emit('send', form)">

    <v-checkbox
      v-model="form.is_enabled"
      label="Включить"
      :error-messages="form.errors.get('is_enabled')"
      :error="form.errors.has('is_enabled')"
    ></v-checkbox>

    <v-text-field
      v-model="form.title"
      label="Заголовок страницы"
      :error-messages="form.errors.get('title')"
      :error="form.errors.has('title')"
    ></v-text-field>

    <v-text-field
      v-model="form.h1"
      label="H1"
      :error-messages="form.errors.get('h1')"
      :error="form.errors.has('h1')"
    ></v-text-field>

    <v-text-field
      v-model="form.description"
      label="Описание"
      :error-messages="form.errors.get('description')"
      :error="form.errors.has('description')"
    ></v-text-field>

    <slot name="buttons">
      <v-btn type="submit">Сохранить</v-btn>
    </slot>

  </v-form>
</template>


<script>
import { Form } from 'form-backend-validation';

import {defineComponent, ref, useContext, watch} from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    seo: {
      type: Object,
    },
  },
  setup(props) {
    const { $axios } = useContext();
    const defaults = {
      is_enabled: true,
      title: null,
      h1: null,
      description: null,
    }
    const form = ref(
      Form.create(defaults)
        .withOptions({ http: $axios })
        .populate(props.seo || {})
    );

    watch(props.seo, (value) => {
      form.value.populate(Object.assign({}, value));
    });

    return { form };
  },
});
</script>

