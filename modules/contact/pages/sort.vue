<template>
    <div>
        <page-header h1="Контакты" :breadcrumbs="breadcrumbs"></page-header>
        <div class="mt-2">
            <v-simple-table class="elevation-3">
                <template v-slot:default>
                    <draggable tag="tbody" @update="update" v-model="contacts">
                        <tr v-for="contact in contacts" :key="contact.id">
                            <td>
                                <v-img max-height="120" max-width="120" :src="`${$config.app.storageUrl}/${contact.image}`" />
                            </td>
                            <td>{{ contact.last_name }} {{contact.first_name}}</td>
                        </tr>
                    </draggable>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>

<script>
import PageHeader from "~/components/common/PageHeader";
import draggable from "vuedraggable";
import Contact from '~/modules/contact/models/Contact'

export default {
    components: {
        PageHeader,
        draggable,
    },
    data() {
        return {
            page: null,
            contacts: [],
            loading: false,
            breadcrumbs: [
                { text: 'Список контактов', to: { name: 'contacts.index' } },
                { text: 'Сортировка' },
            ],
        };
    },
    async created() {
       await this.getContacts()
    },
    methods: {
        async getContacts() {
            this.loading = true;
            this.contacts = await Contact.select('id', 'last_name', 'first_name', 'image')
                .orderBy('position')
                .$get();
            this.loading = false;
        },
        async update() {
            try {
                let position = 0;
                await this.$axios.put(`/admin/contacts/sort`, {
                    contacts: this.contacts.map(contact => ({
                        id: contact.id,
                        position: ++position,
                    })),
                });
                this.$snackbar(`Позиции контактов успешно сохранены`);
            }
            catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
    },
};
</script>
