<template>
    <v-card v-if="error.statusCode === 404" class="text-center w-full error-page pa-3">
        <v-img src="/images/illustrations/404-illustration.svg" max-height="200" contain />
        <div class="display-2 mt-10">Как Вы сюда попали?</div>
        <div class="mt-3 mb-6">Извините, мы не смогли найти эту страницу</div>
        <v-text-field solo placeholder="Поиск" large></v-text-field>
        <v-btn to="/" block large color="primary">Вернуться</v-btn>
    </v-card>
    <v-card v-else class="text-center w-full error-page pa-3">
        <v-img src="/images/illustrations/500-illustration.svg" max-height="200" contain />
        <div class="display-2 mt-10">OOPS! Something went wrong here</div>
        <div class="mt-3 mb-10">Our experts are working to fix the issue.</div>
        <v-text-field solo placeholder="Search website"></v-text-field>
        <v-btn to="/" block large color="primary">Send me back</v-btn>
    </v-card>
</template>

<script>
export default {
    layout: 'simple',
    props: {
        error: {
            type: Object,
            default: () => {},
        },
    },
};
</script>

<style>
.error-page {
    max-width: 500px !important;
}
</style>
