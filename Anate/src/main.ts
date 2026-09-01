import './assets/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createApp, toRaw } from 'vue'
import { createPinia, type StateTree } from 'pinia'

import App from './App.vue'
import router from './router/index.ts'

// I don't care about the package size. not my problem.
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import localforage from 'localforage'
import { Chart } from 'chart.js'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia();
pinia.use(({ store }) => {
  store.$subscribe((mutation, state: StateTree) => {
    localforage.setItem(mutation.storeId, state.getImmutableStore)
  })
})

app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')

