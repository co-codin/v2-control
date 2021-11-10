<template>
    <editor :value="value" :api-key="apiKey" :init="settings" @input="$emit('input', $event)"> </editor>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';

export default {
    components: {
        editor: Editor,
    },
    props: ['value'],
    data() {
        return {
            settings: {
                body_class: 'editor-class',
                content_style:
                    '.editor-class { position:absolute; margin: 4px 8px; width: calc(100% - 16px); height: 80%; }',
                height: 300,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table code help wordcount paste',
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help',
                images_upload_credentials: true,
                images_upload_handler: this.upload,
                paste_preprocess: (pl, data) => {
                    data.content = this.cleanFormat(data);
                },
            },
        };
    },
    computed: {
        apiKey() {
            return process.env.API_EDITOR;
        },
    },
    methods: {
        upload(blobInfo, success, failure) {
            const fd = new FormData();
            fd.append('file', blobInfo.blob(), blobInfo.filename());
            fd.append('resize', 1);
            this.$axios
                .post('/tools/admin/upload', fd)
                .then(({ data }) => {
                    success(process.env.UPLOADS_BASE_URL + data);
                })
                .catch((error) => {
                    failure(error.response.data.errors.file[0]);
                });
        },
        cleanFormat(data) {
            data.content = data.content.replace(
                /<\/*(applet|area|article|aside|audio|base|basefont|bdi|bdo|body|button|canvas|command|datalist|details|embed|figcaption|figure|font|footer|frame|frameset|head|header|hgroup|hr|html|keygen|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|optgroup|output|param|progress|rp|rt|ruby|script|section|source|span|style|summary|time|title|track|video|wbr)[^>]*>/gi,
                ''
            );
            data.content = data.content.replace(
                /<(div|table|tbody|tr|td|th|p|b|font|strong|i|em|h1|h2|h3|h4|h5|h6|hr|ul|li|ol|code|blockquote|address|dir|dt|dd|dl|big|cite|del|dfn|ins|kbd|q|samp|small|s|strike|sub|sup|tt|u|var|caption) [^>]*>/gi,
                '<$1>'
            );
            data.content = data.content.replace(/\/*(data-)/gi, '');
            // keep only href in the a tag (needs to be refined to also keep _target and ID):
            data.content = data.content.replace(/<a [^>]*href=(\"|')(.*?)(\"|')[^>]*>/gi, '<a href="$2">');
            // replace br tag with p tag:
            if (data.content.match(/<br[\/\s]*>/gi)) {
                data.content = data.content.replace(/<br[\s\/]*>/gi, '</p><p>');
            }
            // replace div tag with p tag:
            data.content = data.content.replace(/<(\/)*div[^>]*>/gi, '<$1p>');
            // remove double paragraphs:
            //   data.content = data.content.replace(/<\/p>[\s\\r\\n]+<\/p>/gi,'</p></p>');
            //   data.content = data.content.replace(/<\<p>[\s\\r\\n]+<p>/gi,'<p><p>');
            //   data.content = data.content.replace(/<\/p>[\s\\r\\n]+<\/p>/gi,'</p></p>');
            //   data.content = data.content.replace(/<\<p>[\s\\r\\n]+<p>/gi,'<p><p>');
            //   data.content = data.content.replace(/(<\/p>)+/gi,'</p>');
            //   data.content = data.content.replace(/(<p>)+/gi,'<p>');
            return data.content;
        },
    },
};
</script>

<style lang="scss" scoped></style>
