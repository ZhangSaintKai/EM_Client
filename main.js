import App from "./App";
import Vue from "vue";

import store from "./store";
import api from "@/api";

// import watchRoute from "@/common/watch-route.js";
// Vue.mixin(watchRoute);
// import watchNetwork from "@/common/watch-network.js";
// Vue.mixin(watchNetwork);


Vue.prototype.$store = store;
Vue.prototype.$api = api;



import BaseUrl from "@/api/base-url.js";
Vue.prototype.BaseUrl = BaseUrl;
import FileManager from "@/common/file-manager.js";
Vue.prototype.FileManager = FileManager;



Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
	...App,
	store,
	api
});
app.$mount();