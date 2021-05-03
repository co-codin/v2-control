<template>

  <v-form class="mt-3" @submit.prevent='$emit("sendForm", form)'>

    <v-autocomplete
      v-model.number="form.user_id"
      item-text="full_name"
      clearable
      item-value="id"
      :items="users"
      dense
      label="Ответственный"
      no-data-text="Не найдено"
      :error-messages="form.errors.get('user_id')"
      :error="form.errors.has('user_id')"
    />

    <v-select
      v-model="form.status"
      label="Статус"
      :error-messages="form.errors.get('status')"
      :error="form.errors.has('status')"
      :items="statuses"
    />

    <v-textarea
      v-model="form.additional_info"
      label="Доп информация"
      :error-messages="form.errors.get('status')"
      :error="form.errors.has('status')"
      rows="3"
    />

    <v-card tile class="mt-5 block-wrap">
      <v-card-title>
        Местоположение
        <v-btn @click="blockVisibility.location = !blockVisibility.location" text small color="info" class="ml-3">
          {{ blockVisibility.location ? 'Свернуть' : 'Развернуть' }}
        </v-btn>
      </v-card-title>
      <v-card-subtitle>Данные о местоположении дилера</v-card-subtitle>
      <v-card-text v-show="blockVisibility.location">
        <v-select
          v-model="form.region"
          label="Регион"
          :error-messages="form.errors.get('region')"
          :error="form.errors.has('region')"
          :items="regions"
        />

        <v-select
          v-model="form.federal_district"
          label="Федеральный округ"
          :error-messages="form.errors.get('federal_district')"
          :error="form.errors.has('federal_district')"
          :items="federal_districts"
        />

        <v-text-field
          v-model="form.city"
          label="Город"
          :error-messages="form.errors.get('city')"
          :error="form.errors.has('city')"
        />

      </v-card-text>
    </v-card>

    <v-card tile class="mt-5 block-wrap">
      <v-card-title>
        Юридические лица
        <v-btn @click="blockVisibility.entities = !blockVisibility.entities" text small color="info" class="ml-3">
          {{ blockVisibility.entities ? 'Свернуть' : 'Развернуть' }}
        </v-btn>
        <v-btn @click="addEntity" v-if="blockVisibility.entities" type="button" class="ml-3" x-small dark color="orange">
          Добавить
        </v-btn>
      </v-card-title>

      <v-card-subtitle>Юридические лица дилера</v-card-subtitle>

      <div v-if="form.errors.has('entities')" class="v-messages error--text ml-5" role="alert">
        {{ form.errors.get('entities')[0] }}
      </div>

      <v-card-text v-show="blockVisibility.entities" class="pb-0">
        <div v-for="(entity, index) in form.entities" :key="index" class="d-flex align-center">

          <v-col cols="6">
            <v-text-field
              v-model="entity.name"
              label="Название"
              :error-messages="form.errors.get(`entities.${index}.name`)"
              :error="form.errors.has(`entities.${index}.name`)"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="entity.inn"
              label="Инн"
              :error-messages="form.errors.get(`entities.${index}.inn`)"
              :error="form.errors.has(`entities.${index}.inn`)"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-checkbox
              v-model="entity.is_main"
              label="Основное"
              :error-messages="form.errors.get(`entities.${index}.is_main`)"
              :error="form.errors.has(`entities.${index}.is_main`)"
              @change="toggleMainEntity(index, $event)"
            />
          </v-col>
          <v-col cols="1">
            <v-btn x-small dark color="red" @click="deleteEntity(index)">
              Удалить
            </v-btn>
          </v-col>
        </div>
      </v-card-text>

    </v-card>

    <v-card tile class="mt-5 block-wrap">

      <v-card-title>
        Контакты
        <v-btn @click="blockVisibility.contacts = !blockVisibility.contacts" text small color="info" class="ml-3">
          {{ blockVisibility.contacts ? 'Свернуть' : 'Развернуть' }}
        </v-btn>
      </v-card-title>

      <v-card-subtitle>
        Контактные лица дилера
      </v-card-subtitle>

      <div v-if="form.errors.has('contacts')" class="v-messages error--text ml-5" role="alert">
        {{ form.errors.get('contacts')[0] }}
      </div>

      <v-card-text v-show="blockVisibility.contacts" class="pb-0">

        <v-card outlined v-for="(contact, index) in form.contacts" :key="index" class="d-flex mb-2 align-center">

          <v-btn absolute right top x-small dark color="red" @click="deleteContact(index)">
            Удалить
          </v-btn>

          <v-card-text>

            <v-checkbox
              v-model="contact.is_main"
              label="Это основной контакт"
              :error-messages="form.errors.get(`contacts.${index}.is_main`)"
              :error="form.errors.has(`contacts.${index}.is_main`)"
              @change="toggleMainContact(index, $event)"
            />

            <v-text-field
              v-model="contact.name"
              label="ФИО"
              :error-messages="form.errors.get(`contacts.${index}.name`)"
              :error="form.errors.has(`contacts.${index}.name`)"
            />

            <v-text-field
              v-model="contact.position"
              label="Должность"
              :error-messages="form.errors.get(`contacts.${index}.position`)"
              :error="form.errors.has(`contacts.${index}.position`)"
            />

            <v-text-field
              v-model="contact.email"
              label="Email"
              :error-messages="form.errors.get(`contacts.${index}.email`)"
              :error="form.errors.has(`contacts.${index}.email`)"
            />

            <v-card>
              <v-card-title class="pb-0">
                Телефоны
                <v-btn @click="addPhone(index)" type="button" class="ml-3" x-small dark color="orange">
                  Добавить телефон
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-row v-for="(phone, phoneIndex) in contact.phone" :key="phoneIndex">
                  <v-col class="pb-0"  cols="6">
                    <v-text-field
                      label="Номер телефона"
                      v-model="phone.value"
                      :error-messages="form.errors.get(`contacts.${index}.phone.${phoneIndex}.value`)"
                      :error="form.errors.has(`contacts.${index}.phone.${phoneIndex}.value`)"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

          </v-card-text>
        </v-card>

        <v-btn @click="addContact" v-if="blockVisibility.contacts" type="button" class="mt-2 mb-3" small dark color="orange">
          Добавить контакт
        </v-btn>

      </v-card-text>
    </v-card>

    <v-card tile class="mt-5 block-wrap">
      <v-card-title>
        Директор
        <v-btn @click="blockVisibility.director = !blockVisibility.director" text small color="info" class="ml-3">
          {{ blockVisibility.director ? 'Свернуть' : 'Развернуть' }}
        </v-btn>
      </v-card-title>

      <v-card-subtitle>
        Контактные руководителя
      </v-card-subtitle>

      <v-card-text v-show="blockVisibility.director">

        <v-text-field
          v-model="form.director.name"
          label="ФИО"
          :error-messages="form.errors.get(`director.name`)"
          :error="form.errors.has(`director.name`)"
        />

        <v-text-field
          v-model="form.director.position"
          label="Должность"
          :error-messages="form.errors.get(`director.position`)"
          :error="form.errors.has(`director.position`)"
        />

        <v-text-field
          v-model="form.director.email"
          label="Email"
          :error-messages="form.errors.get(`director.email`)"
          :error="form.errors.has(`director.email`)"
        />

        <v-card>
          <v-card-title class="pb-0">
            Телефоны
            <v-btn @click="addPhone('director')" type="button" class="ml-3" x-small dark color="orange">
              Добавить телефон
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row v-for="(phone, index) in form.director.phone" :key="index">
              <v-col class="pb-0"  cols="6">
                <v-text-field
                  label="Номер телефона"
                  v-model="phone.value"
                  :error-messages="form.errors.get(`director.phone.${index}.value`)"
                  :error="form.errors.has(`director.phone.${index}.value`)"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

      </v-card-text>

    </v-card>

    <v-card tile class="mt-5 block-wrap">
      <v-card-title>
        Бухгалтерия
        <v-btn @click="blockVisibility.accountant = !blockVisibility.accountant" text small color="info" class="ml-3">
          {{ blockVisibility.accountant ? 'Свернуть' : 'Развернуть' }}
        </v-btn>
      </v-card-title>

      <v-card-subtitle>
        Контактные бухгалтерии / логистики
      </v-card-subtitle>

      <v-card-text v-show="blockVisibility.accountant">

        <v-text-field
          v-model="form.accountant.name"
          label="ФИО"
          :error-messages="form.errors.get(`accountant.name`)"
          :error="form.errors.has(`accountant.name`)"
        />

        <v-text-field
          v-model="form.accountant.position"
          label="Должность"
          :error-messages="form.errors.get(`accountant.position`)"
          :error="form.errors.has(`accountant.position`)"
        />

        <v-text-field
          v-model="form.accountant.email"
          label="Email"
          :error-messages="form.errors.get(`accountant.email`)"
          :error="form.errors.has(`accountant.email`)"
        />

        <v-card>
          <v-card-title class="pb-0">
            Телефоны
            <v-btn @click="addPhone('accountant')" type="button" class="ml-3" x-small dark color="orange">
              Добавить телефон
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row v-for="(phone, index) in form.accountant.phone" :key="index">
              <v-col class="pb-0"  cols="6">
                <v-text-field
                  label="Номер телефона"
                  v-model="phone.value"
                  :error-messages="form.errors.get(`accountant.phone.${index}.value`)"
                  :error="form.errors.has(`accountant.phone.${index}.value`)"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

      </v-card-text>

    </v-card>

    <v-card tile class="mt-5 block-wrap">
      <v-card-title>Дополнительные поля</v-card-title>

      <v-card-subtitle>
        Дополнительная информация по дилерам
      </v-card-subtitle>

      <v-card-text>

        <v-text-field
          v-for="field in fields"
          :key="field.key"
          v-model="form.fields[field.key]"
          :label="field.name"
          :error-messages="form.errors.get(`fields.${field.key}`)"
          :error="form.errors.has(`fields.${field.key}`)"
        ></v-text-field>

      </v-card-text>
    </v-card>

    <div class="mt-5">
      <v-btn type="submit" dark color="green">{{ buttonLabel }}</v-btn>
    </div>

  </v-form>

</template>

<script>
import Form from 'form-backend-validation';
import User from "@/modules/document/models/User";

export default {
  props: {
    dealer: {
      type: Object,
      default: () => ({
        region: null,
        status: null,
        user_id: null,
        federal_district: null,
        entities: [],
        contacts: [],
        additional_info: null,
        director: {
          name: null,
          position: null,
          email: null,
          phone: [],
        },
        accountant: {
          name: null,
          position: null,
          email: null,
          phone: [],
        },
        fields: {},
      }),
    },
    type: {
      type: String,
    }
  },
  data() {
    return {
      form: null,
      users: [],
      fields: [],
      regions: [
        {value: 6, text: 'Москва'},
        {value: 1, text: 'ЦФО и СЗФО'},
        {value: 2, text: 'ЮФО | СКФО | КФО'},
        {value: 3, text: 'ПФО'},
        {value: 4, text: 'УрФО'},
        {value: 5, text: 'СФО'},
        {value: 7, text: 'СНГ | ДФО'},
      ],
      statuses: [
        {value: 1, text: 'Active'},
        {value: 2, text: 'StandBy'},
        {value: 3, text: 'Marketing'},
      ],
      federal_districts: [
        {value: 1, text: 'Центральный'},
        {value: 2, text: 'Северо-Западный'},
        {value: 3, text: 'Южный'},
        {value: 4, text: 'Северо-Кавказский'},
        {value: 5, text: 'Приволжский'},
        {value: 6, text: 'Уральский'},
        {value: 7, text: 'Сибирский'},
        {value: 8, text: 'Дальневосточный'},
      ],
      blockVisibility: {
        location: false,
        contacts: true,
        accountant: false,
        director: false,
        entities: true,
      }
    }
  },
  computed: {
    buttonLabel() {
      return this.type === "create" ? "Добавить" : "Сохранить"
    },
  },
  methods: {
    addEntity() {
      this.form.entities.push({
        name: null,
        inn : null,
        is_main: false,
      })
    },
    deleteEntity(index) {
      this.form.entities.splice(index, 1);
    },
    addContact() {
      this.form.contacts.push({
        name: null,
        phone: [],
        position: null,
        email: null,
        is_main: false,
      })
    },
    deleteContact(index) {
      this.form.contacts.splice(index, 1);
    },
    addPhone(index) {
      let contact = typeof index === 'string'
        ? this.form[index]
        : this.form.contacts[index];

      contact.phone.push({
        value: null,
      });
    },
    toggleMainContact(index, value) {
      this.form.contacts.map((contact, key) => {
        if(key !== index) contact.is_main = false;
        return contact;
      });
    },
    toggleMainEntity(index, value) {
      this.form.entities.map((entity, key) => {
        if(key !== index) entity.is_main = false;
        return entity;
      });
    },
  },

  created() {

    let dealer = Object.assign({}, this.dealer);

    if(!dealer.director) {
      dealer.director = {
        name: null,
        position: null,
        email: null,
        phone: [],
      };
    }


    if(!dealer.accountant) {
      dealer.accountant = {
        name: null,
        position: null,
        email: null,
        phone: [],
      };
    }

    if(!dealer.fields) {
      dealer.fields = {};
    }

    this.form = Form.create()
      .withData(dealer)
      .withOptions({
        http: this.$axios, resetOnSuccess: false
      });
  },
  async fetch() {
    let {data} = await this.$axios.get('users/all', {
      params: {
        "filter[onlyManagers]": 1,
        sort: 'last_name',
        append: 'full_name',
      }
    });
    this.users = data.data;

    let response = await this.$axios.get('dealer-fields');
    this.fields = response.data.data;
  }
}
</script>
