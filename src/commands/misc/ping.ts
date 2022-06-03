import Eris from "eris";
import { BCommand } from "../../structures/Command";

export default new BCommand({
	name: "ping",
	description: "hello",
	type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,

	run: async ({ interaction }) => {
		interaction.createMessage("Pong!");
	},
});
