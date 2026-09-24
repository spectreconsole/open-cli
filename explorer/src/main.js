import { defineCustomElement } from 'vue'
import Explorer from './Explorer.ce.vue'

const tag = 'opencli-explorer'

if (!customElements.get(tag)) {
  customElements.define(tag, defineCustomElement(Explorer))
}
