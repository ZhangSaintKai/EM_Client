<template>
    <view class="root">
        <view class="container flex-column-xy-center">
            <view class="original-password">
                <text>原密码</text>
                <input type="text" password placeholder="请输入原密码" v-model="originalPassword" />
            </view>
            <view class="new-password">
                <text>新密码</text>
                <input type="text" password placeholder="请输入新密码" v-model="newPassword" />
            </view>
            <view class="confirm-password">
                <text>确认新密码</text>
                <input type="text" password placeholder="请再次输入新密码" v-model="confirmPassword" />
                <view v-if="showMismatch" class="rule">两次输入的新密码不一致</view>
            </view>
        </view>
        <view class="flex-center">
            <view class="button confirm-change" @tap="confirmChange">确认修改</view>
        </view>
    </view>
</template>

<script>
import debounce from "@/common/debounce.js";
export default {
    data() {
        return {
            originalPassword: "",
            newPassword: "",
            confirmPassword: "",
            showMismatch: false
        };
    },
    watch: {
        newPassword: debounce(function (newValue, oldValue) {
            this.showMismatch = this.confirmPassword !== this.newPassword;
        }, 1000),
        confirmPassword: debounce(function (newValue, oldValue) {
            this.showMismatch = this.confirmPassword !== this.newPassword;
        }, 1000)
    },
    onLoad() {},
    methods: {
        onConfirmPassword: debounce(function (e) {
            this.showMismatch = this.confirmPassword !== this.newPassword;
        }, 1000),

        async confirmChange() {
            let response = await this.$api.updateUserPassword({
                originalPassword: this.originalPassword,
                newPassword: this.newPassword
            });
            if (!response) return;
            uni.showToast({
                icon: "none",
                mask: true,
                title: "修改成功"
            });
            setTimeout(async () => {
                let res = await this.$api.logout();
                if (!res) return;
                this.$store.commit("setUserInfo", null);
                uni.redirectTo({
                    url: "/pages/user/login/login"
                });
            }, 1000);
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    height: 60vh;
}

input {
    text-align: center;
}

.original-password,
.new-password,
.confirm-password {
    margin: 20rpx 0;

    text {
        color: $uni-text-color-grey;
    }
}

.rule {
    font-size: 12px;
    color: $uni-color-error;
}

.confirm-change {
    font-size: 16px;
    width: 5em;
}
</style>
