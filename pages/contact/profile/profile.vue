<template>
    <view class="root">
        <view class="container flex-column-x-center">
            <view class="avatar">
                <image v-if="user.Avatar" :src="BaseUrl.file + user.avatar" mode="aspectFill"></image>
            </view>
            <view class="nick-name">
                {{ user.NickName }}
            </view>
            <view class="EMID">EMID：{{ user.EMID }}</view>
            <view v-if="self.EMID !== user.EMID" class="option flex-around">
                <view v-if="user.IsContact" class="button send" @tap="sendMessage">发送消息</view>
                <view v-else class="button add" @tap="addContact">添加</view>
                <view class="button ban">拉黑</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userID: "",
            user: {},
            self: {}
        };
    },
    onLoad(option) {
        this.userID = option.userID;
        this.getUserProfileByID();
        this.self = this.$store.getters.getUserInfo;
    },
    methods: {
        async getUserProfileByID() {
            let response = await this.$api.getUserProfileByID({
                userID: this.userID
            });
            this.user = response.user;
        },
        async sendMessage() {
            let response = await this.$api.addPrivateConversation({
                userID: this.user.UserID
            });
            if (!response) return;
            // 获取会话对象
            this.$store.commit("setChat", response.privateConversation);
            uni.navigateTo({
                url: "/pages/conversation/chat/chat"
            });
        },
        async addContact() {
            let response = await this.$api.addContact({
                userID: this.user.UserID
            });
            if (!response) return;
            uni.showToast({
                icon: "none",
                title: "已添加联系人"
            });
            setTimeout(() => {
                uni.switchTab({
                    url: "/pages/contact/contact"
                });
            }, 800);
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding-top: 20rpx;
    background: #fff;
}

.avatar {
    image {
        width: 400rpx;
        height: 400rpx;
        border-radius: 50%;
        // border: 1rpx solid $color-primary;
    }
}

.nick-name,
.EMID,
.option {
    width: 750rpx;
    font-size: 18px;
    padding: 1em;
    // background: $color-background;
    border-top: 4rpx solid $color-background;
    text-align: center;
}

.send {
    width: 6em;
}

.add,
.ban {
    width: 4em;
}

.ban {
    background: $uni-text-color-grey;
}
</style>
