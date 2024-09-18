<template>
	<view class="container" :style="{ height: containerHeight + 'px' }">
		<scroll-view class="message-list" scroll-y="true" :scroll-top="scrollBottomHeight">
			<view style="height: 40rpx;"></view>
			<view v-for="(item, index) in messages" :key="item.MessageID" class="flex message"
				:class="item.PrivateMemberID === chat.PrivateMemberID ? 'otherSide' : 'me'">
				<view v-if="item.PrivateMemberID === chat.PrivateMemberID" class="avatar">
					<image :src="`${BaseUrl.file}image/${chat.Avatar}`" mode="aspectFill" />
				</view>
				<view v-if="item.MessageType==='text'" class="content-text">
					{{item.Content}}
				</view>
				<view v-else>
					<view v-if="item.MessageType==='image'" class="image">
						<!-- 发送时显示进度 -->
						<image
							:src="item.Progress&&item.Progress!==100? item.Source : `${BaseUrl.file}${item.MessageType}/${item.Source}`"
							mode="heightFix" @tap="previewImage(item)">
						</image>
						<view v-if="item.Progress&&item.Progress!==100" class="progress">{{item.Progress}}%</view>
					</view>
					<view v-if="item.MessageType==='video'" class="video">
						<image src="../../../static/icon/video.png" mode="scaleToFill" @tap="playVideo(item)"
							@longpress="longPressVideo(item)">
						</image>
						<view class="file-name">
							{{item.Content}}
						</view>
						<view v-if="item.Progress>0&&item.Progress<100" class="progress">{{item.Progress}}%</view>
					</view>
					<view v-if="!['image','video'].includes(item.MessageType)" class="file">
						<image :src="`../../../static/icon/${item.MessageType}.png`" @tap="openFile(item)"
							mode="scaleToFill">
						</image>
						<view class="file-name">
							{{item.Content}}
						</view>
						<view v-if="item.Progress>0&&item.Progress<100" class="progress">{{item.Progress}}%</view>
					</view>
				</view>
				<view v-if="item.PrivateMemberID === chat.SelfMemberID" class="avatar">
					<image :src="`${BaseUrl.file}image/${me.Avatar}`" mode="aspectFill" />
				</view>
			</view>
			<view style="height: 30rpx;"></view>
		</scroll-view>
		<view class="input-bar">
			<view class="record-audio" @tap="switchRecordAudio">·</view>
			<textarea v-model="inputValue" placeholder="请输入消息内容" auto-height :adjust-position="false"
				@focus="chooseMore=false"></textarea>
			<view v-if="inputValue" class="button send" @tap="sendMessage">发送</view>
			<view v-else class="plus" @tap="chooseMore=!chooseMore">+</view>
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
		<video v-if="video" :src="video.LocalUrl||`${BaseUrl.file}${video.MessageType}/${video.Source}`" autoplay
			@error="videoError" object-fit="cover"></video>
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
			video(newValue, oldValue) {
				if (newValue) {
					uni.setNavigationBarColor({
						frontColor: "#ffffff",
						backgroundColor: "#000000"
					});
					uni.setNavigationBarTitle({
						title: newValue.Content
					});
				} else {
					uni.setNavigationBarColor({
						frontColor: "#ffffff",
						backgroundColor: "#55aaff"
					});
					uni.setNavigationBarTitle({
						title: this.chat.Remark || this.chat.NickName
					});
				}
			},
			messages(newValue, oldValue) {
				console.log(newValue);
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					this.screenHeight = res.windowHeight;
					this.containerHeight = res.windowHeight - uni.upx2px(30);
				}
			});
			// 定义监听接收消息
			uni.onSocketMessage(res => {
				try {
					res.data = JSON.parse(res.data);
					this.messages.push(res.data);
					uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this.messages);
					console.log("WS：已添加到本地消息");
					// 向服务器确认已接收消息
					this.$api.readPrivateMessage({
						readList: [res.data]
					}, false);
					this.$nextTick(() => {
						this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
					});
				} catch (e) {
					console.log("会话接收：", res.data);
				}
			});
			this.me = this.$store.getters.getUserInfo;
			this.chat = this.$store.getters.getChat || {};
			this.messages = uni.getStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`) || [];
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
				title: this.chat.Remark || this.chat.NickName
			});
		},
		onUnload() {
			// uni.redirectTo、uni.navigateBack到其他页面时取消监听
			uni.offKeyboardHeightChange(this.setContainerHeight);
		},
		// 【【【【【本页进行uni.navigateTo跳转时须取消键盘高度监听】】】】
		methods: {

			async getMessageList() {
				let response = await this.$api.getPrivateMessageList({
					otherSideMemberID: this.chat.PrivateMemberID
				}, false);
				this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
				if (!response || !response.pmList.length) return;
				response.pmList.forEach(elm => {
					if (elm.MessageType !== "text") elm.Progress = 0;
				});
				this.messages = this.messages.concat(response.pmList);
				uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this.messages);
				console.log("已添加到本地消息");
				// 向服务器确认已接收消息
				this.$api.readPrivateMessage({
					readList: response.pmList
				}, false);
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



			async previewImage(item) {
				// uni.previewImage只支持预览uniapp沙盒目录下的文件，预览时先缓存于应用沙盒目录
				let to = setTimeout(() => {
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
					urls: [item.LocalUrl],
					current: 0,
					indicator: "none",
					// 长按保存到用户文件管理器下的目录
					longPressActions: {
						itemList: ["保存图片"],
						success: async (res) => {
							// console.log(res.tapIndex, res.index);
							if (res.tapIndex === 0) {
								let b = await this.FileManager.download(item);
								if (!b) return;
								uni.showToast({
									icon: "none",
									title: `图片保存于${item.LocalUrl}`,
									duration: 3000
								});
								uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this
									.messages);
							}
						}
					}
				});
				uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this.messages);
			},

			async playVideo(item) {
				this.video = item;
				// 预览时缓存于应用沙盒目录
				let b = await this.FileManager.cache(item);
				if (!b) return;
				uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this.messages);
			},
			videoError(e) {
				console.log("视频出错", this.video.LocalUrl, this.video.Source);
			},
			longPressVideo(item) {
				// 长按保存到用户文件管理器下的目录
				uni.showModal({
					title: "保存视频？",
					content: item.Content,
					success: async res => {
						if (res.cancel) return;
						let b = await this.FileManager.download(item);
						if (!b) return;
						uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this.messages);
					}
				});
			},

			openFile: throttle(async function(item) {
				let b = await this.FileManager.download(item);
				if (!b) return;
				uni.showModal({
					title: "文件保存于",
					content: item.LocalUrl,
					confirmText: "打开",
					success: res => {
						if (res.cancel) return;
						plus.runtime.openFile(item.LocalUrl, {}, (e) => {
							uni.showModal({
								content: e.message,
								showCancel: false
							});
						});
					}
				});
				uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this.messages);
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
				let files = await this.FileManager.chooseImage(9);
				if (!files) return;
				this.getFiles(files);
				this.chooseMore = false;
			},

			async chooseVideo() {
				let file = await this.FileManager.chooseVideo();
				if (!file) return;
				this.getFiles([file]);
				this.chooseMore = false;
			},

			async chooseFile() {
				let file = await this.FileManager.chooseFile();
				if (!file) return;
				this.getFiles([file]);
				this.chooseMore = false;
			},

			getFiles(files) {
				files.forEach(elm => {
					// 文件信息加入本地消息列表
					this.messages.push({
						PrivateID: this.chat.PrivateID,
						PrivateMemberID: this.chat.SelfMemberID,
						MessageType: elm.type,
						Content: elm.name,
						Source: elm.url,
						ReplyFor: null,
						FileID: elm.idinclient,
						Progress: 0,
						LocalUrl: elm.url
					});
					this.uploadFile(elm);
				});
				this.$nextTick(() => {
					this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
					// this.fileSelectorOpen = false; // 文件选择器的双向绑定关闭有延迟，手动关闭
				});
			},

			async uploadFile(file) {
				let msg = this.messages.find(elm => elm.FileID === file.idinclient);
				// 设置监听上传进度
				let i = setInterval(() => {
					msg.Progress = file.progress;
					// console.log(msg.Progress);
					if (!file.progress || file.progress === 100) {
						clearInterval(i);
					}
				}, 1000);
				// 上传文件
				let resFile = await this.FileManager.upload(file);
				// if (!resFile) return;
				msg.MessageType = resFile.type;
				msg.Source = resFile.filename;
				msg.Content = resFile.originalname;
				if (msg.Progress !== 100) msg.Progress = 100;
				// 把文件信息发给服务端
				let response = await this.$api.addPrivateMessage({
					otherSideMemberID: this.chat.PrivateMemberID,
					messageType: resFile.type,
					content: resFile.originalname,
					source: resFile.filename,
					replyFor: null
				}, false);
				if (!response) return;
				// 更新本地消息文件信息
				msg.MessageID = response.message.MessageID;
				msg.SendTime = response.message.SendTime;
				if (msg.Progress !== 100) msg.Progress = 100;
				uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this.messages);
			},

			async sendMessage() {
				if (!this.inputValue) return;
				let message = {
					PrivateID: this.chat.PrivateID,
					PrivateMemberID: this.chat.SelfMemberID,
					MessageType: "text",
					Content: this.inputValue,
					Source: null,
					ReplyFor: null
				};
				// 字符串消息加入本地列表(传递引用)
				this.messages.push(message);
				let content = this.inputValue;
				this.inputValue = "";
				this.$nextTick(() => {
					this.scrollBottomHeight = this.messages.length * 500 + this.containerHeight;
				});
				// 发给服务端
				let response = await this.$api.addPrivateMessage({
					otherSideMemberID: this.chat.PrivateMemberID,
					messageType: "text",
					content: content,
					replyFor: null
				}, false);
				if (!response) return;
				message.MessageID = response.message.MessageID;
				message.SendTime = response.message.SendTime;
				uni.setStorageSync(`${this.me.UserID}-${this.chat.PrivateID}`, this.messages);
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
					will-change: transform
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