<template>
    <view>
        <uni-nav-bar
            height="96rpx"
            color="#ffffff"
            backgroundColor="#55aaff"
            :statusBar="true"
            :border="false"
            :fixed="true"
            :title="title"
            :leftWidth="leftWidth"
            :left-icon="showBack ? 'left' : ''"
            @clickLeft="back"
        >
            <view v-if="showInput" class="nav-bar-search flex-default flex-y-center">
                <uni-icons class="icon" type="search" :size="18" color="#c1c1c1" />
                <input
                    class="input"
                    confirm-type="search"
                    type="text"
                    :placeholder="placeholder"
                    :placeholder-style="placeholderStyle"
                    v-model="inputValue"
                    @confirm="getInputValue"
                />
            </view>
        </uni-nav-bar>
    </view>
</template>

<script>
export default {
    props: {
        showBack: {
            type: Boolean,
            default: false
        },
        showInput: {
            type: Boolean,
            default: false
        },
        placeholderText: {
            type: String,
            default: "请输入关键字"
        },
        title: {
            type: String,
            default: "EM"
        }
    },
    data() {
        return {
            leftWidth: "0",
            inputValue: "",
            placeholder: this.placeholderText,
            placeholderStyle: "color: #c1c1c1"
        };
    },
    created() {
        if (this.showBack) this.leftWidth = "40rpx";
    },
    methods: {
        back() {
            uni.navigateBack();
        },
        getInputValue(e) {
            if (!e.detail.value) {
                this.placeholderStyle = "color: red";
                this.placeholder = "请输入关键字!";
                setTimeout(() => {
                    this.placeholderStyle = "color: #c1c1c1";
                    this.placeholder = this.placeholderText;
                }, 1500);
                return;
            }
            this.$emit("completeInput", e.detail.value);
        }
    }
};
</script>

<style lang="scss" scoped>
::v-deep {
    .uni-navbar__header,
    .uni-navbar__content {
        // background: linear-gradient(90deg, #f5b3ae 0%, #f48f92 100%);
    }
}
.nav-bar-search {
    .icon {
        margin-right: -16rpx;
        z-index: 2;
        position: relative;
        left: 50rpx;
    }
    .input {
        width: 540rpx;
        height: 60rpx;
        background-color: #ffffff;
        border-radius: 30rpx;
        padding-left: 80rpx;
        flex-wrap: nowrap;
        color: #888888;
    }
}
</style>
