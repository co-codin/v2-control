export default function ({ $axios, $config }, inject) {
    const api = $axios.create();

    api.setBaseURL($config.services.randus.url);
    api.setToken(`Bearer ${$config.services.randus.key}`);

    inject('randomPerson', api);
}
