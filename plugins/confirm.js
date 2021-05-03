import Vue from 'vue'
// import Confirm from '../components/VConfirm'

Vue.prototype.$confirm = function (text) {
  return confirm(text);
}

//
// const ConfirmPlugin = {
//   install(Vue, options = {}) {
//     const property = '$confirm'
//     const vuetify = options.vuetify
//     delete options.vuetify
//
//     if (!vuetify) {
//       console.warn('Module vuetify-confirm needs vuetify instance. Use Vue.use(VuetifyConfirm, { vuetify })')
//     }
//
//     const Ctor = Vue.extend(Object.assign({ vuetify }, Confirm));
//
//     function createDialogComponent (options) {
//       const container = document.querySelector('[data-app=true]') || document.body
//       return new Promise(resolve => {
//         const component = new Ctor(Object.assign({}, {
//           propsData: Object.assign({}, Vue.prototype[property].options, options),
//           destroyed: () => {
//             container.removeChild(component.$el)
//             resolve(component.value)
//           }
//         }))
//         container.appendChild(component.$mount().$el)
//       })
//     }
//
//     function show (message, options = {}) {
//       options.message = message
//       return createDialogComponent(options)
//     }
//
//     Vue.prototype.$confirm = show
//     Vue.prototype.$confirm.options = options || {}
//   },
// };
// //
// // export default ({ app }) => {
// //   Vue.use(ConfirmPlugin, { vuetify: app.vuetify })
// // }
//
// // Auto-install
// let GlobalVue = null
// if (typeof window !== 'undefined') {
//   GlobalVue = window.Vue
// } else if (typeof global !== 'undefined') {
//   GlobalVue = global.Vue
// }
// if (GlobalVue) {
//   GlobalVue.use(ConfirmPlugin)
// }
//
//
//
