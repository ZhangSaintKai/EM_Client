import user from "./module/user.js";
import contact from "./module/contact.js";
import conversation from "./module/conversation.js";
import message from "./module/message.js";
import update from "./module/update.js";

const apiList = {
	...user,
	...contact,
	...conversation,
	...message,
	...update
};

export default apiList;