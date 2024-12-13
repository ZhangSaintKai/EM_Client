<template>
    <view class="root">
        <view class="container">
            <text class="title">{{ title }}</text>
            <view class="username">
                <view v-if="rule.test(username)" class="rule">（接受：英文、数字和下划线）</view>
                <input v-model="username" :maxlength="32" focus placeholder="用户名" />
            </view>
            <view class="password">
                <view v-if="rule.test(password)" class="rule">（接受：英文、数字和下划线）</view>
                <input v-model="password" :maxlength="32" password type="text" placeholder="密码" />
            </view>
            <!-- <view class="logo">EM</view> -->
        </view>
        <view class="button login" @tap="login()">登 录</view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            title: "Encrypted Message",
            username: "",
            password: "",
            rule: /[^a-zA-Z0-9_]/ // 英文数字和下划线
        };
    },
    methods: {
        async login() {
            let resdata = await this.$api.login({
                username: this.username,
                password: this.password
            });
            if (!resdata) return;
            if (resdata === "unregistered") {
                uni.showModal({
                    title: "该用户名尚未注册",
                    content: "是否注册？",
                    cancelText: "否",
                    confirmText: "是",
                    success: async (res) => {
                        if (res.cancel) return;
                        const resdataReg = await this.$api.register({
                            username: this.username,
                            password: this.password
                        });
                        if (!resdataReg) return; //"注册成功"
                        uni.showToast({
                            icon: "none",
                            title: "注册成功，正在登录"
                        });
                        const resdataLog = await this.$api.login(
                            {
                                username: this.username,
                                password: this.password
                            },
                            false
                        );
                        if (!resdataLog) return;
                        this.$store.commit("setUserInfo", resdataLog);
                        uni.sendSocketMessage({
                            data: resdataLog.token
                        });
						this.BaseUrl.file = this.BaseUrl.file.replace("fileId=", `fileToken=${resdataLog.fileToken}&fileId=`);
						const publicKey = uni.getStorageSync("publicKey");
						const resdataKey = await this.$api.updateUserPublicKey(JSON.stringify(publicKey));
						if(!resdataKey) return;
                        setTimeout(() => {
                            uni.switchTab({
                                url: "/pages/conversation/conversation"
                            });
                        }, 800);
                    }
                });
                return;
            }
            // 登录成功
            this.$store.commit("setUserInfo", resdata);
            uni.sendSocketMessage({
                data: resdata.token
            });
            // uni.showToast({
            // 	icon: "none",
            // 	title: "正在登录"
            // });
			this.BaseUrl.file = this.BaseUrl.file.replace("fileId=", `fileToken=${resdata.fileToken}&fileId=`);
			const publicKey = uni.getStorageSync("publicKey");
			const resdataKey = await this.$api.updateUserPublicKey(JSON.stringify(publicKey));
			if (!resdataKey) return;
            setTimeout(() => {
                uni.switchTab({
                    url: "/pages/conversation/conversation"
                });
            }, 800);
        }
    },
    onLoad() {}
};
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.container {
    height: 25vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .title {
        font-size: 1.6em;
        font-weight: bold;
        color: $color-primary;
        padding-bottom: 40rpx;
    }

    input {
        padding: 0.5em; // 因为下方类选择器的padding属性不生效
    }

    .username,
    .password {
        font-size: 16px;
        width: 16em;
        text-align: center;
    }

    .rule {
        font-size: 12px;
        color: $uni-color-warning;
    }
}

.login {
    font-size: 20px;
    width: 6em;
}

.logo {
    margin-top: 100rpx;
    width: 2em;
    height: 2em;
    text-align: center;
    line-height: 2em;
    // border-radius: 50%;
    background: $color-primary;
    color: #ffffff;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-weight: bold;
    transform: scale(3);
}
</style>
