<template>
	<view class="root">
		<view class="item flex-y-center" v-for="item in contactList" :key="item.contactId" @tap="selectContact(item)">
			<view class="avatar">
				<image :src="`${BaseUrl.file}image/${item.contactUser.avatar}`" mode="aspectFill"></image>
			</view>
			<view class="nick-name">
				{{item.remark}}
			</view>
		</view>
		<view class="button add" @tap="toSearch()">
			添加
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				contactList: []
			};
		},
		onLoad() {},
		onShow() {
			this.getList();
		},
		methods: {
			async getList() {
				let resdata = await this.$api.getContactList({}, false);
				if (!resdata) return;
				this.contactList = resdata;
			},
			selectContact(item) {
				uni.navigateTo({
					url: "/pages/contact/profile/profile?userID=" + item.OtherSide
				});
			},
			toSearch() {
				uni.navigateTo({
					url: "/pages/contact/search/search"
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.root {
		// padding-bottom: 6.5vh;
	}

	.item {
		padding: 20rpx;
		background: #ffffff;
		border-bottom: 1rpx solid $color-background;

		.avatar {
			margin-right: 20rpx;

			image {
				width: 3em;
				height: 3em;
				border-radius: 50%;
			}
		}

		.nick-name {
			font-size: 16px;
		}

		.icon {
			font-size: 18px;
			// font-weight: bold;
		}
	}

	.add {
		position: fixed;
		right: 60rpx;
		bottom: 120rpx;
		font-size: 16px;
		width: 3em;
		height: 3em;
		border-radius: 50%;
		text-align: center;
		line-height: 3em;
		box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.35);
	}
</style>