import NodeRSA from "node-rsa";

const key = new NodeRSA();

let publicKey, privateKey;

function ReadOrGenKeyPair() {
	publicKey = uni.getStorageSync("publicKey");
	privateKey = uni.getStorageSync("privateKey");
	if (!publicKey || !privateKey) {
		uni.showToast({
			title: "正在生成密钥",
			icon: "none",
			mask: true,
			duration: 20000
		});
		key.generateKeyPair();
		publicKey = key.exportKey("public");
		privateKey = key.exportKey("private");
		uni.setStorageSync("publicKey", publicKey);
		uni.setStorageSync("privateKey", privateKey);
		uni.hideToast();
	}
}

ReadOrGenKeyPair();

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
	ReadOrGenKeyPair: ReadOrGenKeyPair,
	sign: sign,
	encrypt: encrypt,
	decrypt: decrypt,
	verify: verify
};