module.exports = {
	"plugins": [
		"html"
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		},
		"allowImportExportEverywhere": false
	},
	"extends": [
		"eslint:recommended", // 一般内容
		"plugin:vue/base" // vue内容
	],
	"settings": {
		"html/html-extensions": [
			".erb",
			".handlebars",
			".hbs",
			".htm",
			".html",
			".mustache",
			".nunjucks",
			".php",
			".tag",
			".twig",
			".wxml",
			".we"
		]
	},
	// 可读的全局变量，不提示未定义
	// "globals": {
	// 	"process": true,
	// 	"module": true,
	// 	"uni": true
	// },
	"rules": {
		// 句末需要分号
		"semi": ["error", "always"],
		// 字符串使用双引号
		"quotes": ["error", "double"],
		// 允许未声明变量
		"no-undef": "off",
		// 警告未使用变量
		"no-unused-vars": ["error", {"args": "all"}],
		// 禁用拖尾逗号
		"comma-dangle": ["error", "never"],
		// 警告嵌套的三元表达式
		"no-nested-ternary": "error",
		// 警告超过四层的嵌套
		"max-depth": ["error", 4],
		// 调用无参构造时需加括号
		"new-parens": ["error", "always"],
		// 警告类型不安全操作符
		"eqeqeq": "error",
		// 警告使用let声明且未被重新赋值的变量
		// "prefer-const":"error",
		
		// eslint-plugin-vue插件规则：
		//在computed properties中禁用异步actions
		"vue/no-async-in-computed-properties": "error",
		//不允许重复的keys
		"vue/no-dupe-keys": "error",
		//不允许重复的attributes
		"vue/no-duplicate-attributes": "error",
		//在 <template> 标签下不允许解析错误
		"vue/no-parsing-error": ["error", {
			"x-invalid-end-tag": false
		}],
		//不允许覆盖保留关键字
		"vue/no-reserved-keys": "error",
		//强制data必须是一个带返回值的函数
		// 'vue/no-shared-component-data': 'error',
		//不允许在computed properties中出现副作用。
		"vue/no-side-effects-in-computed-properties": "error",
		//<template>不允许key属性
		"vue/no-template-key": "error",
		//在 <textarea> 中不允许mustaches
		"vue/no-textarea-mustache": "error",
		//不允许在v-for或者范围内的属性出现未使用的变量定义
		"vue/no-unused-vars": "error",
		//<component>标签需要v-bind:is属性
		"vue/require-component-is": "error",
		// render 函数必须有一个返回值
		"vue/require-render-return": "error",
		//保证 v-bind:key 和 v-for 指令成对出现
		"vue/require-v-for-key": "error",
		// 检查默认的prop值是否有效
		"vue/require-valid-default-prop": "error",
		// 保证computed属性中有return语句 
		"vue/return-in-computed-property": "error",
		// 强制校验 template 根节点
		"vue/valid-template-root": "error",
		// 强制校验 v-bind 指令
		"vue/valid-v-bind": "error",
		// 强制校验 v-cloak 指令
		"vue/valid-v-cloak": "error",
		// 强制校验 v-else-if 指令
		"vue/valid-v-else-if": "error",
		// 强制校验 v-else 指令 
		"vue/valid-v-else": "error",
		// 强制校验 v-for 指令
		"vue/valid-v-for": "error",
		// 强制校验 v-html 指令
		"vue/valid-v-html": "error",
		// 强制校验 v-if 指令
		"vue/valid-v-if": "error",
		// 强制校验 v-model 指令
		"vue/valid-v-model": "error",
		// 强制校验 v-on 指令
		"vue/valid-v-on": "error",
		// 强制校验 v-once 指令
		"vue/valid-v-once": "error",
		// 强制校验 v-pre 指令
		"vue/valid-v-pre": "error",
		// 强制校验 v-show 指令
		"vue/valid-v-show": "error",
		// 强制校验 v-text 指令
		"vue/valid-v-text": "error",
		"vue/comment-directive": 0
	}
};
