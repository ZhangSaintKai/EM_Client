<template>
	<view class="container" :style="{ height: containerHeight + 'px' }">
		<scroll-view class="message-list" scroll-y="true" :scroll-top="scrollBottomHeight">
			<view style="height: 40rpx"></view>
			<view v-for="item in messages" :key="item.messageId" class="flex message" :class="item.memberId === chat.otherMemberId ? 'otherSide' : 'me'">
				<view v-if="item.memberId === chat.otherMemberId" class="avatar">
					<image :src="BaseUrl.file + chat.otherUser.avatar" mode="aspectFill" />
				</view>
				<view v-if="item.messageType === 'text'" class="content-text" @longpress="onLongPressTextMsg(item.content)">
					{{ item.content }}
				</view>
				<view v-else>
					<view v-if="item.messageType === 'image'" class="image">
						<!-- 发送时显示进度 -->
						<image
							:src="item.progress && item.progress !== 100 ? item.source : BaseUrl.file + item.source"
							mode="heightFix"
							@tap="previewImage(item)"
						></image>
						<view v-if="item.progress && item.progress !== 100" class="progress">{{ item.progress }}%</view>
					</view>
					<view v-if="item.messageType === 'video'" class="video">
						<image src="../../../static/icon/video.png" mode="scaleToFill" @tap="playVideo(item)" @longpress="longPressVideo(item)"></image>
						<view class="file-name">
							{{ item.content }}
						</view>
						<view v-if="item.progress > 0 && item.progress < 100" class="progress">{{ item.progress }}%</view>
					</view>
					<view v-if="!['image', 'video'].includes(item.messageType)" class="file">
						<image :src="`../../../static/icon/${item.messageType}.png`" @tap="openFile(item)" mode="scaleToFill"></image>
						<view class="file-name">
							{{ item.content }}
						</view>
						<view v-if="item.progress > 0 && item.progress < 100" class="progress">{{ item.progress }}%</view>
					</view>
				</view>
				<view v-if="item.memberId === chat.memberId" class="avatar">
					<image :src="BaseUrl.file + me.avatar" mode="aspectFill" />
				</view>
			</view>
			<view style="height: 30rpx"></view>
		</scroll-view>
		<view class="input-bar">
			<view class="record-audio" @tap="switchRecordAudio">·</view>
			<textarea v-model="inputValue" placeholder="请输入消息内容" auto-height :adjust-position="false" @focus="chooseMore = false"></textarea>
			<view v-if="inputValue" class="button send" @tap="sendMessage">发送</view>
			<view v-else class="plus" @tap="chooseMore = !chooseMore">+</view>
		</view>
		<view v-if="chooseMore" class="flex-around more">
			<view class="item" @tap="chooseImage">
				<image src="../../../static/icon/image.png" mode="scaleToFill"></image>
				<view class="image">图片</view>
			</view>
			<view class="item" @tap="chooseVideo">
				<image src="../../../static/icon/video.png" mode="scaleToFill"></image>
				<view class="video">视频</view>
			</view>
			<!-- <view class="item" @tap="fileSelectorOpen=true"> -->
			<view class="item" @tap="chooseFile">
				<image src="../../../static/icon/file.png" mode="scaleToFill"></image>
				<view class="other">文件</view>
				<!-- <custom-select-file ref="fileselector" v-model="fileSelectorOpen" @confirm="getFiles"
					btnBgColor="#55aaff" btnText="确定" :filterArr="[]"></custom-select-file> -->
			</view>
		</view>
		<video v-if="video" :src="video.localUrl || BaseUrl.file + video.source" autoplay @error="videoError" object-fit="cover"></video>
	</view>
</template>

<script>
import throttle from "@/common/throttle.js";
export default {
    data() {
        return {
            screenHeight: 0,
            containerHeight: 0,
            setContainerHeight: null, //设置聊天窗口高度随键盘弹起变化
            scrollBottomHeight: 0, // 用于自动滚动到底部
            me: {},
            chat: {}, // 当前打开的会话信息(不包含消息列表)
            messages: [],
            video: false,
            recordingAudio: false,
            inputValue: "",
            chooseMore: false,
            fileSelectorOpen: false,
            file: {}
        };
    },
    watch: {
        video(newValue) {
            if (newValue) {
                uni.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: "#000000"
                });
                uni.setNavigationBarTitle({
                    title: newValue.content
                });
            } else {
                uni.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: "#55aaff"
                });
                uni.setNavigationBarTitle({
                    title: this.chat.remark || this.chat.otherUser.nickName
                });
            }
        }
        // ,messages: {
            // handler: function (newValue, oldValue) {
            //     console.log(newValue);
            // },
            // deep: true
        // }
    },
    onLoad() {
        uni.getSystemInfo({
            success: (res) => {
                this.screenHeight = res.windowHeight;
                this.containerHeight = res.windowHeight - uni.upx2px(30);
            }
        });
        // 定义监听接收消息
        uni.onSocketMessage((res) => {
            try {
				if (res.data === "服务端已标识WS") return;
				this.getMessageList();
                // res.data = JSON.parse(res.data);
                // this.messages.push(res.data);
                // uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
                console.log("WS：已添加到本地消息");
                // 向服务器确认已接收消息
                // this.$api.readPrivateMessage({
                // 	readList: [res.data]
                // });
                this.$nextTick(() => {
                    this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
                });
            } catch (e) {
                console.log("会话接收：", e, res);
            }
        });
        this.me = this.$store.getters.getUserInfo;
        this.chat = this.$store.getters.getChat || {};
        this.messages = uni.getStorageSync(`${this.me.userId}-${this.chat.conversationId}`) || [];
        this.getMessageList();

        // this.test(1);
    },
    onReady() {
        this.setContainerHeight = (res) => {
            this.containerHeight = this.screenHeight - res.height - uni.upx2px(30);
            // 滚动到底部
            this.$nextTick(() => {
                // 在下次DOM更新循环结束后执行回调函数
                this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
            });
        };
        uni.onKeyboardHeightChange(this.setContainerHeight);
        uni.setNavigationBarTitle({
            title: this.chat.remark || this.chat.otherUser.nickName
        });
    },
    onUnload() {
        // uni.redirectTo、uni.navigateBack到其他页面时取消监听
        uni.offKeyboardHeightChange(this.setContainerHeight);
    },
    // 【【【【【本页进行uni.navigateTo跳转时须取消键盘高度监听】】】】
    methods: {
        async getMessageList() {
            let resdata = await this.$api.getPrivateMessageList({
                    conversationId: this.chat.conversationId
            });
            this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
            if (!resdata) return;
            // 【利用自增消息Id去除客户端与服务器重复部分消息】
            const clientNewestMessage = this.messages.slice(-1)[0];
            if (clientNewestMessage) {
                const id = Number(clientNewestMessage.messageId.slice(1));
                resdata = resdata.filter((elm) => Number(elm.messageId.slice(1)) > id);
            }
            // 【利用自增消息Id去除客户端与服务器重复部分消息】
            resdata.forEach((elm) => {
                if (elm.messageType !== "text") elm.progress = 0;
				try{
				//暂只解密文本类消息
					if(elm.messageType === "text")
					elm.content = this.Encrypt.decrypt(elm.content);
				} catch (e) {
					uni.showModal({
						title: "解密失败",
						content: `${e.errMsg || e}`,
						showCancel: false
					});
				}
            });
            this.messages = this.messages.concat(resdata);
            uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
            // 向服务器确认已接收消息
            this.$api.readPrivateMessage( this.chat.conversationId );
            this.$nextTick(() => {
                this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
            });
        },

        // // 压测【慎用!!!】
        // async test(i) {
        // 	this.inputValue = uuidv4();
        // 	this.sendMessage();
        // 	i++;
        // 	if (i < 100) {
        // 		this.test(i);
        // 	} else {
        // 		setTimeout(() => {
        // 			this.test(1);
        // 		}, 100);
        // 	}
        // },
		
		async onLongPressTextMsg(content) {
			await uni.setClipboardData({
				data: content
			});
			uni.showToast({
				title: "已复制消息",
				icon: "none"
			});
		},

        async previewImage(item) {
            // uni.previewImage只支持预览uniapp沙盒目录下的文件，预览时先缓存于应用沙盒目录
            const to = setTimeout(() => {
                uni.showLoading({
                    mask: true,
                    title: "图片加载中"
                });
            }, 200);
            await this.FileManager.cache(item);
            clearTimeout(to); // 200毫秒内缓存到图片则不显示加载中
            uni.hideLoading();
            // if (!b) {
            // 	// 缓存失败
            // 	return;
            // }
            uni.previewImage({
                urls: [item.localUrl],
                current: 0,
                indicator: "none",
                // 长按保存到用户文件管理器下的目录
                longPressActions: {
                    itemList: ["保存图片"],
                    success: async (res) => {
                        // console.log(res.tapIndex, res.index);
                        if (res.tapIndex === 0) {
                            const b = await this.FileManager.download(item);
                            if (!b) return;
                            uni.showToast({
                                icon: "none",
                                title: `图片保存于${item.localUrl}`,
                                duration: 3000
                            });
                            uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
                        }
                    }
                }
            });
            uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
        },

        async playVideo(item) {
            this.video = item;
            // 预览时缓存于应用沙盒目录
            const b = await this.FileManager.cache(item);
            if (!b) return;
            uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
        },
        videoError(e) {
            console.log("视频出错", this.video.localUrl, this.video.source, e.errMsg);
        },
        longPressVideo(item) {
            // 长按保存到用户文件管理器下的目录
            uni.showModal({
                title: "保存视频？",
                content: item.content,
                success: async (res) => {
                    if (res.cancel) return;
                    const b = await this.FileManager.download(item);
                    if (!b) return;
                    uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
                }
            });
        },

        openFile: throttle(async function (item) {
            const b = await this.FileManager.download(item);
            if (!b) return;
            uni.showModal({
                title: "文件保存于",
                content: item.localUrl,
                confirmText: "打开",
                success: (res) => {
                    if (res.cancel) return;
                    plus.runtime.openFile(item.localUrl, {}, (e) => {
                        uni.showModal({
                            content: e.message,
                            showCancel: false
                        });
                    });
                }
            });
            uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
        }, 2000),

        switchRecordAudio() {
            // this.recordingAudio = !this.recordingAudio;
            // if (this.recordingAudio) {
            // 	this.FileManager.startRecordAudio();
            // } else {
            // 	this.FileManager.stopRecordAudio();
            // 	this.FileManager.playRecordAudio();
            // }
        },

        async chooseImage() {
            const files = await this.FileManager.chooseImage(9);
            if (!files) return;
            this.getFiles(files);
            this.chooseMore = false;
        },

        async chooseVideo() {
            const file = await this.FileManager.chooseVideo();
            if (!file) return;
            this.getFiles([file]);
            this.chooseMore = false;
        },

        async chooseFile() {
            const file = await this.FileManager.chooseFile();
            if (!file) return;
            this.getFiles([file]);
            this.chooseMore = false;
        },

        getFiles(files) {
            files.forEach((elm) => {
                // 文件信息加入本地消息列表
                this.messages.push({
                    conversationId: this.chat.conversationId,
                    memberId: this.chat.memberId, //用于客户端
                    messageType: elm.type,
                    content: elm.name,
					signature: elm.name,
                    source: elm.url,
                    replyFor: null,
                    fileId: elm.idinclient,
                    progress: 0,
                    localUrl: elm.url
                });
                this.uploadFile(elm);
            });
            this.$nextTick(() => {
                this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
                // this.fileSelectorOpen = false; // 文件选择器的双向绑定关闭有延迟，手动关闭
            });
        },

        async uploadFile(file) {
            const message = this.messages.find((elm) => elm.fileId === file.idinclient);
            // 设置监听上传进度
            const i = setInterval(() => {
                message.progress = file.progress;
                // console.log(message.progress);
                if (!file.progress || file.progress === 100) {
                    clearInterval(i);
                }
            }, 1000);
            // 上传文件
            // console.log(file);
            const resFile = await this.FileManager.upload(file, this.chat.conversationId, 1);
            if (!resFile) return;
            message.conversationId = this.chat.conversationId;
            message.source = resFile.fileId;
            message.replyFor = null;
            if (message.progress !== 100) message.progress = 100;
            // 把文件信息发给服务端
            const resdata = await this.$api.sendPrivateMessage(message);
            if (!resdata) {
                message.sendFailed = true;
                return;
            }
            // 更新本地消息文件信息
            message.messageId = resdata.messageId;
            message.sendTime = resdata.sendTime;
            if (message.progress !== 100) message.progress = 100;
            uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
        },

        async sendMessage() {
            if (!this.inputValue) return;
            const message = {
                conversationId: this.chat.conversationId,
                memberId: this.chat.memberId, //用于客户端
                messageType: "text",
                content: this.inputValue,
                source: null,
                replyFor: null
            };
            // 字符串消息加入本地列表(传递引用)
            this.messages.push(message);
            this.inputValue = "";
            this.$nextTick(() => {
                this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
            });
            // 发给服务端
			const tempMessage = {};
			let resdata;
			try {
				Object.assign(tempMessage, message);
				tempMessage.content = this.Encrypt.encrypt(this.chat.otherUser.publicKey, tempMessage.content);
				tempMessage.signature = tempMessage.content;
				resdata = await this.$api.sendPrivateMessage(tempMessage);
			} catch (e) {
				uni.showModal({
					title: "加密失败",
					content: `${e.errMsg || e}`,
					showCancel: false
				});
			}
            if (!resdata) {
                message.sendFailed = true;
                return;
            }
            // 更新本地消息文本信息
            message.messageId = resdata.messageId;
            message.sendTime = resdata.sendTime;
            uni.setStorageSync(`${this.me.userId}-${this.chat.conversationId}`, this.messages);
        }
    },

    onBackPress(option) {
        // 返回值为true时，不执行默认的返回
        if (option.from === "backbutton") {
            if (this.video) {
                // 正在播放视频时按"返回"退出视频
                this.video = false;
                return true;
            }
            // if (this.fileSelectorOpen) {
            // 	// 正打开文件选择器时按“返回”调用选择器内置的返回方法
            // 	this.$refs.fileselector.backAddress();
            // 	return true;
            // }
            if (this.chooseMore) {
                // 正打开发送更多文件时按“返回”，退出选择更多
                this.chooseMore = false;
                return true;
            }
            return false;
        }
        // uni.navigateBack正常返回
        return false;
    }
};
</script>

<style lang="scss" scoped>
.container {
	font-size: 14px;
	background: $color-background;
	display: flex;
	flex-direction: column;
}

.message-list {
	flex: 1;
	overflow-y: auto;

	.message {
		align-items: flex-end;
		margin-bottom: 20rpx;

		.avatar {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;

			image {
				width: 3em;
				height: 3em;
				border-radius: 50%;
				margin: 0 0.5em;
			}
		}

		.content-text {
			font-size: 16px;
			max-width: 60%;
			background: #ffffff;
			padding: 0.3em 0.6em;
			border-radius: 0.6em;
			white-space: normal;
			word-break: break-all;
		}

		.image {
			border-radius: 0.3em;
			text-align: right;
			position: relative;

			image {
				height: 252rpx; // 16:9比例的图片不变形
				max-width: 450rpx;
				border-radius: 0.3em;
				margin-bottom: -0.4em;
				will-change: transform;
			}
		}

		.video {
			border-radius: 0.4em;
			text-align: center;
			position: relative;

			image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 0.3em;
				margin-bottom: -0.4em;
			}

			.progress {
				color: $color-primary;
			}
		}

		.file {
			border-radius: 0.4em;
			width: 160rpx;
			padding: 0.1em;
			background: #ffffff;
			text-align: center;
			position: relative;

			image {
				width: 100rpx;
				height: 120rpx;
				border-radius: 0.3em;
				margin-bottom: -0.4em;
			}
		}

		.file-name {
			font-size: 10px;
			width: 160rpx;
			/* 设置容器的固定宽度 */
			overflow: hidden;
			/* 隐藏溢出的文本 */
			white-space: nowrap;
			/* 强制文本在一行显示 */
			text-overflow: ellipsis;
			/* 使用省略号表示溢出的文本 */
		}

		.progress {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.me {
		justify-content: flex-end;

		.content-text,
		.file {
			color: #ffffff;
			background: $color-primary;
		}
	}

	.otherSide {
		justify-content: flex-start;
	}
}

.input-bar {
	display: flex;
	align-items: flex-end;
	padding: 16rpx;
	background: #ffffff;

	.record-audio {
		font-size: 34px;
		width: 1em;
		height: 1em;
		border-radius: 50%;
		text-align: center;
		line-height: 0.9em;
		color: $color-primary;
		background: $color-background;
		margin-bottom: 0.1em;
	}

	textarea {
		height: 1em;
		flex: 1;
		background: #f5f5f5;
		border-radius: 1.2em;
		margin: 4rpx 10rpx;
		padding: 0.4em 0.6em;
	}

	.plus {
		font-size: 34px;
		// font-weight: bold;
		width: 1em;
		height: 1em;
		border-radius: 50%;
		text-align: center;
		line-height: 0.9em;
		color: #ffffff;
		background: $color-primary;
		margin-bottom: 3rpx;
	}

	.send {
		width: 3em;
	}
}

.more {
	background: #ffffff;

	image {
		width: 60rpx;
		height: 60rpx;
		// border-radius: 12rpx;
	}
}

video {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
