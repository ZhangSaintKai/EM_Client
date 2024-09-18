<template>
	<view>
		<view class="root">
			<view>登录</view>
			<view
				id="printArea"
				style="text-align: center;
				border: 10px solid #000;
				height: 3200px;"
			>
				打印内容
				<view id="notPrint">不打印的</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad() {},
	onReady() {},
	methods: {
		// 将页面截图的base64数据转换为图片并保存到相册
		saveImage(base64) {
			const bitmap = new plus.nativeObj.Bitmap("BITMAP"); // 参数为Bitmap对象的标识，可更改
			bitmap.loadBase64Data(
				base64,
				// 成功回调
				() => {
					let name = "ScreeShoot_" + new Date().getTime() + ".png";
					bitmap.save(
						name,
						{
							overwrite: true, // 是否覆盖
							quality: 100 // 图片质量
						},
						info => {
							console.log("图片信息：", info);
							uni.saveImageToPhotosAlbum({
								filePath: info.target,
								success: res => {
									uni.showModal({
										title: "导出成功",
										content: "图片已保存到相册",
										showCancel: false
									});
									console.log("保存路径：", res.path);
									bitmap.clear();
								}
							});
						},
						e => {
							console.log(JSON.stringify(e));
						}
					);
				},
				e => {
					console.log(JSON.stringify(e));
				}
			);
		}
	}
};
</script>

<script module="render" lang="renderjs">
import html2canvas from 'html2canvas';
export default {
	data() {
		return {};
	},
	mounted() {
		this.printPage();
	},
	methods: {
		printPage() {
			let dom = document.getElementById('printArea');
			//两个参数：所需要截图的元素id，截图后要执行的函数， canvas为截图后返回的最后一个canvas
			html2canvas(dom, {
				width: dom.offsetWidth, //画布的宽
				height: dom.offsetHeight, //画布的高
				scale: 2, //处理模糊问题
				useCORS: true, //开启跨域，这个是必须的
				ignoreElements: elm => elm.id === 'notPrint'
			}).then(canvas => {
				let url = canvas.toDataURL('image/png');
				// console.log(url);
				console.log('准备保存');
				this.$ownerInstance.callMethod('saveImage', url);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.root {
}
</style>
