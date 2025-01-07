<template>
    <view class="root">
        <view class="container flex-column-xy-center">
            <view class="avatar">
                <image v-if="user.avatar" :src="BaseUrl.file + user.avatar" mode="aspectFill" @tap="uploadImage"></image>
            </view>
            <view v-if="file.progress > 0 && file.progress < 100">上传进度：{{ file.progress }}%</view>
            <view class="nick-name">
                <text>昵称 （接受：中文、英文、数字和下划线）</text>
                <input type="text" placeholder="请输入昵称" v-model="user.nickName" />
            </view>
            <view class="emid">
                <text>EMID （接受：英文、数字和下划线）</text>
                <input type="text" placeholder="请输入EMID" v-model="user.emid" />
            </view>
        </view>
        <view class="flex-center">
            <view class="button save" @tap="save">保 存</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            user: {},
            file: {}
        };
    },
    onLoad() {
        this.getUserInfo();
    },
    methods: {
        async getUserInfo() {
            const resdata = await this.$api.getSelfUserInfo();
            if (!resdata) return;
            this.user = resdata;
            this.$store.commit("setUserInfo", resdata);
        },

        async uploadImage() {
            const files = await this.FileManager.chooseImage(1, true, true);
            if (!files) return;
            if (files[0].width < 200 || files[0].height < 200) {
                uni.showToast({
                    icon: "none",
                    title: "图片尺寸不符合要求"
                });
                return;
            }
            const resFile = await this.FileManager.upload(files[0], this.user.userId, 0);
            if (!resFile) return;
            this.updateAvatar(resFile);
        },

        async updateAvatar(file) {
            // console.log(file);
            const resA = await this.$api.updateUserAvatar( file.fileId );
            if (!resA) return;
            uni.showToast({
                icon: "none",
                title: "头像更新成功"
            });
            this.getUserInfo();
        },

        async save() {
            const resN = await this.$api.updateUserNickName( this.user.nickName );
            if (!resN) return;
            const resE = await this.$api.updateUserEMID( this.user.emid );
            if (!resE) return;
            uni.showToast({
                icon: "none",
                title: "资料更新成功"
            });
            this.getUserInfo();
            // setTimeout(() => {
            // 	this.getUserInfo();
            // }, 600);
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    height: 60vh;
}

.avatar {
    image {
        width: 400rpx;
        height: 400rpx;
        border-radius: 50%;
        // border: 1rpx solid $color-primary;
    }

    margin: 20rpx 0;
}

input {
    text-align: center;
}

.nick-name,
.emid {
    margin: 20rpx 0;

    text {
        color: $uni-text-color-grey;
    }
}

.save {
    font-size: 16px;
    width: 5em;
}
</style>
