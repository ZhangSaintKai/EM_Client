import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		networkStatus: true,
		showingModal: false, // 判断是否正在显示模态弹窗，防止重复显示
		userInfo: null,
		chat: null // 当前打开的会话信息(不包含消息列表)
	},
	getters: {
		getNetworkStatus(state) {
			return state.networkStatus;
		},
		getShowingModal(state) {
			return state.showingModal;
		},
		getUserInfo(state) {
			return state.userInfo || uni.getStorageSync("userInfo");
		},
		getChat(state) {
			return state.chat;
		}
	},
	mutations: {
		setNetworkStatus(state, value) {
			state.networkStatus = value;
		},
		setShowingModal(state, value) {
			state.showingModal = value;
		},
		setUserInfo(state, value) {
			uni.setStorageSync("userInfo", value);
			state.userInfo = uni.getStorageSync("userInfo");
		},
		setChat(state, value) {
			state.chat = value;
		}
	},
	actions: {}
});

export default store;