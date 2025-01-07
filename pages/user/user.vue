<template>
    <view class="root">
        <view>
            <view class="profile flex-between flex-y-center" @tap="toModify">
                <view class="flex-y-center">
                    <view class="avatar">
                        <image v-if="user.avatar" :src="BaseUrl.file + user.avatar" mode="aspectFill"></image>
                    </view>
                    <view class="nick-name">
                        {{ user.nickName }}
                    </view>
                </view>
                <view class="icon">〉</view>
            </view>
            <view class="menu EMID">EMID：{{ user.emid }}</view>
            <view class="menu password" @tap="toUpdatePassword">修改密码</view>
        </view>
        <view class="button logout" @tap="logout">退出登录</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            user: {}
        };
    },
    onLoad() {},
    onShow() {
        this.getUserInfo();
    },
    methods: {
        async getUserInfo() {
            const resdata = await this.$api.getSelfUserInfo();
            if (!resdata) return;
            this.user = resdata;
            this.$store.commit("setUserInfo", resdata);
            // console.log(resdata);
        },
        async logout() {
            uni.showModal({
                content: "确定退出登录？",
				success: (res)=>{
					if(!res.confirm) return;
					this.$api.logout();
					this.$store.commit("setUserInfo", null);
					uni.clearStorageSync(); //暂调试用，后做选择
					// bug：退出登录未重启再重新登录时，fileToken未更新
					uni.reLaunch({
						url: "/pages/user/login/login"
					});
				}
            });
			
        },
        toModify() {
            uni.navigateTo({
                url: "/pages/user/modify/modify"
            });
        },
        toUpdatePassword() {
            uni.navigateTo({
                url: "/pages/user/update-passowrd/update-passowrd"
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.profile {
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

.menu {
    padding: 20rpx;
    background: #ffffff;
    color: $color-primary;
    border: 1rpx solid $color-background;
    text-align: center;
    font-size: 15px;
}

.logout {
    margin: 90rpx;
    font-size: 16px;
}
</style>
