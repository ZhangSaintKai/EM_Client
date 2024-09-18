export default {
	mounted() {
		uni.getNetworkType({
			success: res => {
				if (res.networkType === "none") {
					uni.showToast({
						title: "EM：当前无网络连接，请联网",
						icon: "none",
						duration: 3000
					});
					this.$store.commit("setNetworkStatus", false);
				}
			}
		});
		uni.onNetworkStatusChange(res => {
			if (res.isConnected) {
				this.$store.commit("setNetworkStatus", true);
			} else {
				uni.showToast({
					title: "EM：当前无网络连接，请联网",
					icon: "none",
					duration: 3000
				});
				this.$store.commit("setNetworkStatus", false);
			}
		});
	},
	destroyed() {
		uni.offNetworkStatusChange(() => {});
	}
};
