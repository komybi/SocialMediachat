import GroupLogo from "../assets/group.png";
const getChatName = (chat, authUserId) => {
	if (!chat || !chat.users || !Array.isArray(chat.users) || chat.users.length < 2) {
		return chat?.chatName || "Unknown Chat";
	}
	
	const chatName =
		chat?.chatName == "Messenger"
			? authUserId == chat.users[0]?._id
				? (chat.users[1]?.firstName || "Unknown") + " " + (chat.users[1]?.lastName || "")
				: (chat.users[0]?.firstName || "Unknown") + " " + (chat.users[0]?.lastName || "")
			: chat?.chatName || "Unknown Chat";
	return chatName;
};
export const getChatImage = (chat, authUserId) => {
	if (!chat || !chat.users || !Array.isArray(chat.users) || chat.users.length < 2) {
		return GroupLogo;
	}
	
	const ImageLogo =
		chat?.chatName == "Messenger"
			? authUserId == chat.users[0]?._id
				? (chat.users[1]?.image
					? (chat.users[1].image.startsWith('http')
						? chat.users[1].image
						: `${import.meta.env.VITE_BACKEND_URL}/${chat.users[1].image}`)
					: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")
				: (chat.users[0]?.image
					? (chat.users[0].image.startsWith('http')
						? chat.users[0].image
						: `${import.meta.env.VITE_BACKEND_URL}/${chat.users[0].image}`)
					: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")
			: GroupLogo;
	return ImageLogo;
};
export default getChatName;
