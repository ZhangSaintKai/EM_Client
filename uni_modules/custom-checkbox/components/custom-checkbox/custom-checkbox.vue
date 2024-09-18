<template>
	<view>
		<view class="checkbox" :class="checked ? 'checkbox-checked' : ''" @tap="change()">
			<uni-icons type="checkmarkempty" color="#ffffff" :size="14"></uni-icons>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		checked: {
			type: Boolean,
			required: true
		}
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {
		change() {
			this.$emit("change", !this.checked);
		}
	}
};
</script>

<style lang="scss" scoped>
.checkbox {
	width: 1.4em;
	height: 1.4em;
	line-height: 1.5em;
	text-align: center;
	background: #ffffff;
	color: #ffffff;
	border: 1rpx solid #e9e9e9;
	border-radius: 50%;
	margin-right: 16rpx;
}
.checkbox-checked {
	background: #55aaff;
}
</style>
