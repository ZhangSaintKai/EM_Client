import NodeRSA from "node-rsa";

const key = new NodeRSA();

let publicKey = uni.getStorageSync("publicKey");
let privateKey = uni.getStorageSync("privateKey");
if (!publicKey || !privateKey) {
	uni.showLoading({
		title: "正在生成密钥"
	});
	key.generateKeyPair();
	publicKey = key.exportKey("public");
	privateKey = key.exportKey("private");
	uni.setStorageSync("publicKey", publicKey);
	uni.setStorageSync("privateKey", privateKey);
	uni.hideLoading();
}
key.importKey(privateKey, "private");


function sign(content) {
	return key.sign(content, "base64", "utf8");
}

function encrypt(targetPubKey, content) {
	key.importKey(targetPubKey, "public");
	const encryptedContent = key.encrypt(content, "base64");
	key.importKey(publicKey, "public");
	return encryptedContent;
}

function decrypt(encryptedContent) {
	return key.decrypt(encryptedContent, "utf8");
}

function verify(targetPubKey, decryptedContent, signature) {
	key.importKey(targetPubKey, "public");
	const verifyResult = key.verify(decryptedContent, signature, "utf8", "base64");
	key.importKey(publicKey, "public");
	return verifyResult;
}



export default {
	sign: sign,
	encrypt: encrypt,
	decrypt: decrypt,
	verify: verify
};