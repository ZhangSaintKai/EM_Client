import NodeRSA from "node-rsa";

uni.showLoading({
	title: "加载中"
});
var key = new NodeRSA();
key.generateKeyPair();
var pubKey = key.exportKey("public");

var key2 = new NodeRSA();
key2.generateKeyPair();
var pubKey2 = key2.exportKey("public");

uni.setStorageSync("lastTimePriKey", key.exportKey("private"));

uni.hideLoading();


const content = {
	text: "的哇额达伟大aadwedawda！@#￥%……&*（（））、、\\\\||-==+__// 00  ",
	sign: "A"
};

// A 私钥签名
const signature = key.sign(content.sign, "base64", "utf8");
console.log("A 私钥签名:", signature);

key.importKey(pubKey2, "public");
const encrypted = key.encrypt(JSON.stringify(content), "base64");
console.log("B 公钥加密:", encrypted);



const temp = key2.decrypt(encrypted, "utf8");
const decrypted = JSON.parse(temp);
console.log("B 私钥解密:", decrypted);

key2.importKey(pubKey, "public");
const isFromA = key2.verify(decrypted.sign, signature, "utf8", "base64");
console.log("A 公钥验签:", isFromA);

export default {
	signature: signature,
	encrypted: encrypted,
	decrypted: decrypted,
	isFromA: isFromA
};
