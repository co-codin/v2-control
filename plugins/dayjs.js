import dayjs from '~/helpers/dayjs';

export default ({ app }, inject) => {
    inject('dayjs', dayjs);
};
