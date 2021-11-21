export const urlRules = [
    (v) => {
        if (v && /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(v)) {
            return true;
        }
        return false;
    },
];
