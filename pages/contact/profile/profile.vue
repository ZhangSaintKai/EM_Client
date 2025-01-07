<template>
    <view class="root">
        <view class="container flex-column-x-center">
            <view class="avatar">
                <image v-if="user.avatar" :src="BaseUrl.file + user.avatar" mode="aspectFill"></image>
            </view>
            <view class="nick-name">
                {{ user.nickName }}
            </view>
            <view class="EMID">EMID：{{ user.emid }}</view>
            <view v-if="self.emid !== user.emid" class="option flex-around">
                <view v-if="user.isContact" class="button send" @tap="sendMessage">发送消息</view>
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
            userId: "",
            user: { isContact: true }
        };
    },
	computed:{
		self(){
			return this.$store.getters.getUserInfo;
		}
	},
    onLoad(option) {
        this.userId = option.userId;
        this.getUserProfileByID();
    },
    methods: {
        async getUserProfileByID() {
            const resdata = await this.$api.getUserProfileByID({
                userId: this.userId
            });
            // this.user = resdata;
			// this.checkContact();
			this.user = resdata.user;
			this.user.isContact = resdata.isContact;
        },
        async checkContact() {
            const resdata = await this.$api.checkContact({
                targetUserId: this.userId
            });
            this.user.isContact = resdata;
			console.log(this.user.isContact);
        },
        async sendMessage() {
            const resdata = await this.$api.addPrivateConversation( this.userId );
            if (!resdata) return;
            // 获取会话对象
            this.$store.commit("setChat", resdata);
            uni.navigateTo({
                url: "/pages/conversation/chat/chat"
            });
        },
        async addContact() {
            const resdata = await this.$api.addContact( this.userId );
            if (!resdata) return;
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
