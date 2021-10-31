import Vue from 'vue'
let handler = (e, modifier) => {
    let modifier_float = !!modifier.float
    let element = e.target
    let event = new Event("input")
    let regexp_float = /^\d*\.?\d*$/g;
    let regexp = /^[0-9]*$/;
    let test = (modifier_float) ? regexp_float.test(element.value) : regexp.test(element.value)
    let newValue = null
    newValue = element.value.slice(0, -1);
    if (test) {
        return false
    }
    element.value = newValue;
    element.dispatchEvent(event)
}
Vue.directive('digits-only',{
    bind: function(el, binding){
        let currentEl = null;
        if(el.tagName == "INPUT"){
            currentEl = el;
        } else{
            currentEl = el.querySelector('input')
        }
        currentEl.addEventListener('input', function(e){
            handler(e, binding.modifiers)
        })
    },
    unbind: function(el, binding){
        let currentEl = null;
        if(el.tagName == "INPUT"){
            currentEl = el;
        } else{
            currentEl = el.querySelector('input')
        }
        currentEl.removeEventListener('input', function(e){
            handler(e, binding.modifiers)
        })
    }
});
