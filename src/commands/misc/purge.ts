import Eris from "eris";
import { bot } from "../..";
import { BCommand } from "../../structures/Command";

export default new BCommand({
	name: "purge",
	description: "Purge an amount of messages",
	type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
	options: [
		{
			type: Eris.Constants.ApplicationCommandOptionTypes.NUMBER,
			name: "amount",
			description: "The amount of messages to purge",
			required: true,
		},
	],

	run: async ({ interaction }) => {
		const messagesAmount = interaction.data.options[0].value as number;

		await bot.purgeChannel(interaction.channel.id, {
			limit: messagesAmount,
		});

		interaction.createMessage(`Purged ${messagesAmount} messages!`);
	},
});
