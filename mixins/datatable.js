import qs from 'qs';
import DotsHorizontalIcon from '@/components/heroicons/DotsHorizontalIcon';
import PencilAltIcon from '@/components/heroicons/PencilAltIcon';
import TrashIcon from '@/components/heroicons/TrashIcon';
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';

export default {
    data: () => ({
        selectedItems: [],
        total: null,
        isLoading: true,
        tableFooterProps: {
            'items-per-page-options': [5, 10, 15, 50, 100, 200],
            'items-per-page-text': '',
        },
        tableOptions: {
            itemsPerPage: null,
            page: null,
            sortBy: null,
            sortDesc: null,
        },
        searchForm: {},
    }),
    components: {
        PencilAltIcon,
        TrashIcon,
        DotsHorizontalIcon,
        ExternalLinkIcon,
    },
    computed: {
        filter() {
            const filters = {};
            Object.keys(this.searchForm).forEach((key) => {
                filters[`filter[${key}]`] = this.searchForm[key];
            });
            return filters;
        },
        sort() {
            return this.tableOptions.sortBy.map((key, index) => {
                const direction = this.tableOptions.sortDesc[index] ? '-' : '';
                return `${direction}${key}`;
            });
        },
        queryParams() {
            return {
                'page[size]': this.tableOptions.itemsPerPage,
                'page[number]': this.tableOptions.page,
                ...this.filter,
                sort: this.sort,
            };
        },
    },
    methods: {
        async updateOptions(key, value) {
            this.tableOptions[key] = value;
            await this.$router.replace({
                query: {
                    ...this.$route.query,
                    page: this.tableOptions.page,
                    per_page: this.tableOptions.itemsPerPage,
                    sort_by: this.tableOptions.sortBy,
                    sort_desc: this.tableOptions.sortDesc,
                },
            });
            this.$fetch();
        },
        showLoading() {
            this.isLoading = true;
        },
        hideLoading() {
            this.isLoading = false;
        },
        setTotal(total) {
            this.total = total;
        },
        async search(data) {
            this.searchForm = { ...data };
            await this.$router.replace({
                query: {
                    ...this.$route.query,
                    filter: qs.stringify(this.searchForm),
                },
            });
            this.$fetch();
        },
    },
    created() {
        this.searchForm = Object.assign(this.searchForm, qs.parse(this.$route.query.filter || null));
        this.tableOptions = {
            itemsPerPage: +this.$route.query.per_page || 15,
            page: +this.$route.query.page || 1,
            sortBy: [this.$route.query.sort_by || 'id'].flat(),
            sortDesc: [this.$route.query.sort_desc || 'true'].flat().map((key) => key === 'true'),
        };
    },
};
