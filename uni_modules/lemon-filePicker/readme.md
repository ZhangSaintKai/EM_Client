# lemon-filePicker


# 一、使用
### 1.在页面引入
```js
1.重要（安卓）：使用前先勾选文件读取权限，具体步骤：打开manifest.json,选择App权限配置,在Android权限配置中勾选<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
2.若HBuilderX中没有uts编译运行插件，在第一次运行时会自动下载.
3.如果使用出错,请优先检查HBuilderX是否成功安装了uts编译运行插件,并检查HBuilderX是否更新到了最新版
4.本插件已做权限检查（安卓），支持跳转到APP权限设置页
5.支持设置Mime类型（安卓），实现限制文件类型选取
6.支持访问指定目录（安卓），方便用户在指定目录快速选取
7.支持将APP作为其他应用的打开方式（安卓，具体说明请看【fileSelect可配置参数说明】中的action属性）：
	一种使用场景：
		在微信中好友发送了一个文件，你想让用户可以将该文件保存到本APP中
		或用户想在本app中处理该文件。本插件会自动把你的app展示在其他应用的打开方式中，供用户选择。
		q：为什么不直接使用选择文件的方式来拿到文件，而是要通过此方式呢？
		a: 使用该方式免去了用户在复杂的文件选择器中查找所需的文件，如果文件所在的位置层级过深，
		或者是在部分无法访问的目录中，只会导致用户放弃使用。
		此方式还可以在未启动你的APP的情况下保存文件到你的APP中，因此用户可以在任何时候任何其他应用中将文件保存到你的APP中
		q：如何开启此功能？
		a: 本插件默认开启该功能，使用该功能需要云打包自定义调试基座！云打包自定义调试基座！云打包自定义调试基座！
		q：如何关闭该功能？
		a: 删除AndroidManifest.xml文件即可，该文件所在路径为：'/uni_modules/lemon-filePicker/utssdk/app-android/AndroidManifest.xml'
import fileSelect from "@/uni_modules/lemon-filePicker"
```
### 2.唤起文件选择
```js
	fileSelect({
		scope:"/Download",  //具体配置说明见下方 【fileSelect可配置参数说明】
		permission: false,
		//实践：
		//1.用户点击选择文件，调用本选取文件插件，
		//2.插件会自动检查是否有文件读取权限（没有会弹窗让用户选择）
		//3.已有权限（或用户点击了同意），直接弹出文件选择
		//4.没有权限（或用户点击了拒绝），配置了permission:true，会自动跳转到当前APP的权限设置页面，如果需要更好的用户体验（跳转前给用户一个帮助说明或图文操作步骤），请配置permission:false，并在fail回调中处理提示用户的逻辑，用户确认后再次调用本插件,这次请设置permission:true
		mimetype: "*/*",
		success(res) {
			console.log(res);	
			//返回数据格式说明见下方 【fileSelect返回值说明】				
			uni.getSystemInfo({
				success(info) {
					if (info.osName == 'ios') {
						console.log("我是ios")
						// 由于ios文件沙盒机制，需要使用uni.downloadFile下载后，获取到的文件临时路径（_doc/xxx）后使用该路径去上传
						// 或使用原生插件版文件选择，免此步骤：  https://ext.dcloud.net.cn/plugin?id=14059
						uni.downloadFile({
							url: res.filePath,
							success(e) {
								console.log(e);
								// ios请使用该路径（e.tempFilePath）
								
							}
						})
					} else {
						console.log("我是安卓")
						//安卓可以直接使用  res.filePath
					}
				}
			})
		},
		fail(err) {
			console.log(err);
			// err.code=1001  未授权文件读取权限,可以提示用户未打开读取文件权限（仅安卓）
			if(err.code==1001){
				uni.showModal({
					title:"需要文件访问权限",
					content:"您还未授权本应用读取文件。为保证您可以正常上传文件，请在权限设置页面打开文件访问权限（不同手机厂商表述可能略有差异）请根据自己手机品牌设置",
					confirmText:"去授权",
					cancelText:"算了",
					success(e) {
						if(e.confirm){
							fileSelect({permission: true})
						}
					}
				})
			}
		}
	})
```
| fileSelect可配置参数说明 |  |  |  |
| --- | --- | --- | --- |
| 属性 | 类型 | 说明 | 兼容性 |
| scope | string | 【可选】访问指定目录，不需要则不要声明该属性，默认显示顶级目录<br />例：<br />- /DCIM/Camera 相机 <br />-  /Download 下载    <br /> | 仅安卓 （部分目录由于安全策略无法访问,如"Android/data"，请自行测试，可以参考自己手机的目录进行设置） |
| permission | Boolean | 【可选】当读取文件的权限被用户拒绝，是否自动跳转到当前APP的权限设置页面,默认为false(不跳转) | 仅安卓 |
| mimetype | string | 【必填】限制选取的文件类型，不限制需设为"*/*"，更多类型请参照Mime类型对照表,暂时仅支持设置单个类型<br />例: <br />-  image/*    （图片） <br />-  text/plain  （文本）<br />- application/vnd.openxmlformats-officedocument.wordprocessingml.document （word）<br /> | 仅安卓 |
| action | string | 【可选】打开的行为配置，目前暂时只支持暂时'openWithFile'，'openWithFile'行为用于获取用户最近一次在其他应用选择本应用作为打开方式选择的文件 | 仅安卓 |


| fileSelect返回值说明 |  |  |  |
| --- | --- | --- | --- |
| 属性 | 类型 | 说明 | 兼容性 |
| code | string | 状态码:<br />- 0 成功<br />- 1001 未授权文件读取权限（仅安卓）<br />- 1002 文件不存在（仅安卓）<br />- 1004 用户取消了选择(仅ios)  - 1005 文件选取出错(仅安卓)  <br /> | <br /> |
| filePath | string | 选取的文件的绝对路径,可以直接提供给uniapp的上传等api使用（使用该路径时,请确认自己的项目有读取访问文件的权限） |  |
| fileName | string | 选取的文件的名称 |  |
| fileSize | string | 选取的文件的大小（单位：字节） |  |
| fileExt | string | 选取的文件的后缀名 | 仅安卓 |
| errMsg | string | 选择完成后的状态信息  |  |
| detail | string | 具体的文字说明 |  |

# 兼容性说明
### 目前仅测试了部分真机(安卓13.0 、ios13),其他系统版本兼容性未知，请自行测试.
# 问题反馈与收集
```js
感谢使用，本插件已停止维护，若遇到问题请加qq群466852060讨论交流
本uts插件为开放源代码插件，可自行在 uni_modules->lemon-filePicker->utssdk 直接修改对应平台的源代码，以满足个性化需求

# 已上线[原生插件]版文件选取,同样支持安卓和ios双端,支持更多功能
前往使用：https://ext.dcloud.net.cn/plugin?id=14059（请根据自己实际真机测试选择使用uts版或原生插件版）


目前收集的问题（Q&A）：
1.文件查找失败：'@/uni_modules/lemon-filePicker'  大概率你是在浏览器上打开的吧？运行请选择【运行到手机或模拟器】，本插件仅用于安卓和ios的APP使用，不支持任何h5,不支持任何浏览器运行。
2.（已解决，ios,应该？）Error: undefined class: UTSSDKModulesLemonFilePickerIndexSwift
遇到问题2，大概率是你用的window电脑，直接用基本调试基座运行的。
   一、官方文档说明如下：
	  运行到ios平台，uts插件编译需要XCode环境，因此在mac电脑安装了XCode工具时支持直接使用标准基座真机运行。 
	  在windows电脑或者mac电脑没有安装XCode工具时，需要提交云端打包生成自定义基座后才能调用uts插件
   二、简单来说：
    1.你是windows电脑？请点击 运行->原生APP-云打包->选择ios(ipa),填写相关苹果证书配置，选择打自定义基座调试包。打包完成后，运行时选择使用自定义基座运行
	2.你是mac电脑？
	  2.1 有xcode环境？参考这个[xcode配置](https://uniapp.dcloud.net.cn/tutorial/run/uts-development-ios.html)配置后，直接标准基座运行
	  2.2 没有xcode环境？安装完成后参考2.1，不想安装参考1

3.（已解决，安卓）u盘文件无法选择
4.（已解决，安卓）文件类型筛选
5.（已解决，安卓）权限检查
6. HbuilderX编辑器报错 xxx与uts相关的模块未找到,请重新下载最新的HbuilderX再运行
```