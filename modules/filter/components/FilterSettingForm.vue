<template>
    <v-form @submit.prevent="send">
        <v-select
            v-model="form.facet.name"
            label="Системное поле"
            :items="systemFilters"
            item-text="name_ru"
            item-value="name"
            :error-messages="form.errors.get('facet.name')"
            :error="form.errors.has('facet.name')"
        />

        <v-select
            v-if="systemFilterValues"
            v-model="form.facet.value"
            label="Значение для поиска"
            :items="systemFilterValues"
            item-text="text"
            item-value="value"
            :error-messages="form.errors.get('facet.value')"
            :error="form.errors.has('facet.value')"
        />
        <v-text-field
            v-else
            v-model="form.facet.value"
            label="Значение для поиска"
            :error-messages="form.errors.get('facet.value')"
            :error="form.errors.has('facet.value')"
        />

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import { systemFilters } from '~/enums';

export default {
    props: {
        filter: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            facet: {
                name: null,
                path: null,
                value: null,
            },
        },
        form: null,
        systemFilters,
    }),
    computed: {
        systemFilter() {
            if (this.form.facet.name) {
                return systemFilters.find((filter) => {
                    return filter.name === this.form.facet.name;
                });
            }
        },
        systemFilterValues() {
            if (this.systemFilter) {
                if (this.systemFilter.allowedValues) {
                    return this.systemFilter.allowedValues;
                }
            }
        },
    },
    watch: {
        filter(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults).withOptions({ http: this.$axios });

        if (!this.filter.facet) {
            this.form.populate({
                facet: {
                    name: null,
                    path: null,
                    value: null,
                },
            });
        } else {
            this.form.populate(this.filter);
        }
    },
    methods: {
        send() {
            if (this.systemFilter.path) {
                this.form.facet.path = this.systemFilter.path;
            }
            this.$emit('send', this.form);
        },
    },
};
</script>
