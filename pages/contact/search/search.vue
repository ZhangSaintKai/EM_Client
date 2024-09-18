<template>
	<view class="root">
		<view class="search-bar flex-y-center">

			<input class="input" v-model="searchText" placeholder="请输入用户的EMID" />
			<view class="button search" @tap="search">
				搜索
			</view>
		</view>
		<view class="result">
			<view v-if="alreadySearched && !userList.length" class="none">
				找不到此用户
			</view>
			<view class="user-list">
				<view class="item flex-y-center" v-for="item,index in userList" :key="item.userId"
					@tap="selectUser(item)">
					<view class="avatar">
						<image :src="BaseUrl.file+item.avatar" mode="aspectFill"></image>
					</view>
					<view class="nick-name">
						{{item.nickName}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				alreadySearched: false,
				searchText: "",
				userList: []

			};
		},
		methods: {
			async search() {
				if (!this.searchText) return;
				let response = await this.$api.searchUser({
					searchText: this.searchText
				});
				if (!response) return;
				this.alreadySearched = true;
				this.userList = response;
			},
			selectUser(item) {
				uni.navigateTo({
					url: "/pages/contact/profile/profile?userID=" + item.userId
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.search-bar {
		padding: 16rpx;

		.input {
			flex: 1;
		}

		.search {
			width: 3em;
			margin-left: 10rpx;
		}
	}

	.none {
		text-align: center;
		padding: 2em;
	}

	.user-list {
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
	}
</style>