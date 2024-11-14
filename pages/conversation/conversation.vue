<template>
    <view class="root">
        <view v-for="item in conversationList" :key="item.conversationId" class="item flex-between" @tap="selectConversation(item)">
            <view class="left flex">
                <view class="avatar">
                    <image :src="item ? BaseUrl.file + item.otherUser.avatar : ''" mode="aspectFill"></image>
                </view>
            </view>
            <view class="right flex-column-around">
                <view class="flex-between">
                    <view class="conversation-name">{{ item.remark || item.otherUser.nickName }}</view>
                    <view class="send-time">{{ item.sendTime | formatDateTime }}</view>
                </view>
                <view class="flex-between">
                    <view v-if="item.messageType === 'text'" class="newest-message">{{ item.content }}</view>
                    <view v-if="item.messageType === 'audio'" class="newest-message">[音频]{{ item.content }}</view>
                    <view v-if="item.messageType === 'image'" class="newest-message">[图片]</view>
                    <view v-if="item.messageType === 'video'" class="newest-message">[视频]{{ item.content }}</view>
                    <view v-if="item.messageType && !['text', 'audio', 'image', 'video'].includes(item.messageType)" class="newest-message">
                        [文件]{{ item.content }}
                    </view>
                    <view v-else style="height: 1em"></view>
                    <view class="unread-count">
                        <text v-if="item.unreadCount">
                            {{ item.unreadCount }}
                        </text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { optimizeFormatDateTime } from "@/common/util.js";
export default {
    data() {
        return {
            conversationList: [],
            userInfo: false
        };
    },
    computed: {
        // userInfo() {
        // 	return this.$store.state.userInfo;
        // }
        // // 相当于上面三行(需import引入mapState)
        // ...mapState(["userInfo"])
    },
    onLoad() {
        if (!this.$store.getters.getUserInfo)
            uni.redirectTo({
                url: "/pages/user/login/login"
            });
    },
    onShow() {
        this.userInfo = this.$store.getters.getUserInfo;
        if (!this.userInfo) return;
        // 因为同样的监听，后定义的生效，所以每次页面显示都需要重新定义
        uni.onSocketMessage((res) => {
            // console.log("列表接收", res.data);
            if (res.data !== "服务端已标识WS") this.getGetConversationList();
        });
        this.getGetConversationList();
    },
    filters: {
        formatDateTime(value) {
            return optimizeFormatDateTime(value);
        }
    },
    methods: {
        async getGetConversationList() {
            let resdata = await this.$api.getPrivateConversationList(null, false);
            if (!resdata) return;
            resdata.forEach((elm) => {
                if (!elm.newestMessageId) {
                    // 没有获取到最新消息的，从本地消息的最新一条填充
                    let messages = uni.getStorageSync(`${this.userInfo.userId}-${elm.conversationId}`);
                    let newest = messages[messages.length - 1];
                    if (newest) {
                        elm.newestMessageId = newest.messageId;
                        elm.senderMemberId = newest.memberId;
                        elm.messageType = newest.messageType;
                        elm.content = newest.content;
                        elm.source = newest.source;
                        elm.replyFor = newest.replyFor;
                        elm.sendTime = newest.sendTime;
                        elm.read = newest.read;
                    }
                }
            });
            resdata.sort((a, b) => {
                if (a.sendTime === null && b.sendTime === null) {
                    return 0;
                } else if (a.sendTime === null) {
                    return 1;
                } else if (b.sendTime === null) {
                    return -1;
                } else {
                    return new Date(b.sendTime) - new Date(a.sendTime);
                }
            });
            this.conversationList = resdata;
            // console.log(this.conversationList);
        },
        selectConversation(item) {
            this.$store.commit("setChat", item);
            uni.navigateTo({
                url: "/pages/conversation/chat/chat"
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
    background: #ffffff;
    border-bottom: 1rpx solid $color-background;
    padding: 6rpx 10rpx;

    .left {
        .avatar {
            margin-right: 10rpx;

            image {
                width: 4em;
                height: 4em;
                border-radius: 50%;
                // border: 1rpx solid $color-primary;
            }
        }
    }

    .right {
        /* 占满剩余空间 */
        flex: 1;

        .newest-message {
            font-size: 12px;
            color: $uni-text-color-grey;
            width: 500rpx;
            /* 设置容器的固定宽度 */
            overflow: hidden;
            /* 隐藏溢出的文本 */
            white-space: nowrap;
            /* 强制文本在一行显示 */
            text-overflow: ellipsis;
            /* 使用省略号表示溢出的文本 */
        }

        .send-time {
            font-size: 12px;
            color: $uni-text-color-grey;
        }

        .unread-count {
            padding-right: 6rpx;
            text-align: right;

            text {
                color: #ffffff;
                background: red;
                padding: 0 0.5em;
                border-radius: 1em;
            }
        }
    }
}
</style>
