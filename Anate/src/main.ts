import "./assets/main.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// I don't care about the package size. not my problem.
import ElementPlus from "element-plus";
import { createPinia, type StateTree } from "pinia";
import { createApp, toRaw } from "vue";
import App from "./App.vue";
import router from "./router/index.ts";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import localforage from "localforage";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

const pinia = createPinia();
pinia.use(async ({ store }) => {
    await store.initialise();
    store.$subscribe((mutation, state: StateTree) => {
        // TODO: not generic. breaks immediately on second store.
        // maybe we shouldn't be universally storing state? maybe we can call $subscribe on the actual store dec?
        // まあ、分からないよおうううう
        localforage.setItem(mutation.storeId, toRaw(state.rankings));
    });
});

app.use(ElementPlus);
app.use(pinia);
app.use(router);

app.mount("#app");
