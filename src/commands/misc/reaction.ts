import Eris from "eris";
import { bot } from "../..";
import { BCommand } from "../../structures/Command";
import {
	emeraldCollectedReactions,
	emeraldDisposedReaction,
	EmeraldReactionCollector,
} from "../../util/ReactionListener";

export default new BCommand({
	name: "reaction",
	description: "Collects reactions from a message",
	type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,

	run: async ({ interaction }) => {
		await interaction.createMessage("REACT TO THIS MSG!");

		const msg = await interaction.getOriginalMessage();
		const emoji1 = "👍";
		msg.addReaction(emoji1);

		const emojiFilter = ({
			message,
			emoji,
			reactor,
		}: emeraldCollectedReactions) =>
			message.id === msg.id && emoji.name === emoji1 && !reactor.bot;

		const collector = new EmeraldReactionCollector({
			client: bot,
			filter: emojiFilter,
			time: 10000,
		});

		collector.on(
			"collect",
			({ message, emoji, reactor }: emeraldCollectedReactions) => {
				console.log(`${reactor.user.id} reacted with ${emoji.name}`);
			}
		);

		collector.on(
			"end",
			(collected: emeraldCollectedReactions[], reason: string) => {
				console.log(`Collector Ended with ${collected.length} collections.`);
			}
		);

		collector.on(
			"deleted",
			({ message, emoji, userID }: emeraldDisposedReaction) => {
				console.log(`${userID} removed ${emoji.name}`);
			}
		);
	},
});
