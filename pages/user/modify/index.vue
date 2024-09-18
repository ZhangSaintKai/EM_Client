<template>
	<view class="root">
	</view>
</template>

<script>
	import NodeRSA from "node-rsa";
	export default {
		data() {
			return {
				content: {
					text: "的哇额达伟大aadwedawda！@#￥%……&*（（））、、\\\\||-==+__// 00  ",
					sign: "A"
				}
			};
		},
		onLoad() {

			uni.showLoading({
				title: "准备加密对象"
			});
			let key = new NodeRSA();
			let pubKey = uni.getStorageSync("oldPub");
			let priKey = uni.getStorageSync("oldPri");
			if (!pubKey || !priKey) {
				uni.showLoading({
					title: "正在更新密钥"
				});
				key.generateKeyPair();
				pubKey = key.exportKey("public");
				priKey = key.exportKey("private");
				uni.setStorageSync("oldPub", pubKey);
				uni.setStorageSync("oldPri", priKey);
			} else {
				key.importKey(pubKey, "public");
				key.importKey(priKey, "private");
			}

			// 使用客户端私钥签名
			let signature = key.sign(this.content.sign, "base64", "utf8");
			// 载入服务器公钥以加密
			key.importKey(serverPub, "public");
			let encrypted = key.encrypt(JSON.stringify(this.content), "base64");
			// 返回密文和签名
			// encrypted: encrypted,
			// signature: signature

		},
		methods: {

		}
	};
</script>

<style lang="scss" scoped></style>