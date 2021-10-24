<template>
  <v-card tile>
    <v-form @submit.prevent="$emit('send', form)">
      <v-card-title>
        SEO
      </v-card-title>
      <v-card-text>
        <slot name="fields">
          <v-checkbox
            v-model="form.is_enabled"
            label="Включить"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
          ></v-checkbox>

          <template v-if="Boolean(form.is_enabled)">
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
          </template>
        </slot>
      </v-card-text>
      <v-card-actions>
        <slot name="buttons">
          <v-btn type="submit">Сохранить</v-btn>
        </slot>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { Form } from 'form-backend-validation';

export default {
  props: {
    seo: {
      type: Object | null,
      default: () => ({}),
    },
  },
  data: () => ({
    formDefaults: {
      is_enabled: false,
      title: null,
      h1: null,
      description: null,
    },
    form: null,
  }),
  created() {
    this.form = Form.create(this.formDefaults)
      .withOptions({ http: this.$axios, resetOnSuccess: false })
      .populate(this.seo || {})
  },
  watch: {
    seo(value) {
      this.form.populate(value);
    },
  }
}
</script>

