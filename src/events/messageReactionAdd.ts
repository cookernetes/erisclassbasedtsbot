import { Member, Message } from "eris";
import { BEvent } from "../structures/Event";

export interface recievedEmoji {
	animated: boolean;
	id: string;
	name: string;
}

export default new BEvent(
	"messageReactionAdd",
	async (message: Message, emoji: recievedEmoji, reactor: Member) => {}
);
