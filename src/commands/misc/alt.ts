import Eris, { ActionRow, ComponentInteraction } from "eris";
import { bot } from "../..";
import { BCommand } from "../../structures/Command";
import { InteractionHandler } from "../../util/ListenerV2";

export default new BCommand({
	name: "alt",
	description: "ALT LISTENER TEST",
	type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,

	run: async ({ interaction }) => {
		const customID = "click_me_test";

		const componentsForMsg: ActionRow = {
			type: Eris.Constants.ComponentTypes.ACTION_ROW,
			components: [
				{
					type: Eris.Constants.ComponentTypes.BUTTON,
					label: "Click me!",
					custom_id: customID,
					style: Eris.Constants.ButtonStyles.PRIMARY,
				},
			],
		};

		await interaction.createMessage({
			content: "Respond with a button!",
			components: [componentsForMsg],
		});

		const message = await interaction.getOriginalMessage();

		const collector = new InteractionHandler({
			client: bot,
			time: 10000,
			maxMatches: 2,
			ogMessageID: message.id,
			filter: (i: ComponentInteraction) =>
				i.channel.id === interaction.channel.id &&
				i.data.custom_id === customID &&
				i.member.id === interaction.member.id &&
				i.message.id === message.id,
		});

		collector.on("collect", async (i: ComponentInteraction) => {
			console.log(`${interaction.member.username} clicked the button!`);
		});

		collector.on(
			"end",
			async (collected: ComponentInteraction[], reason: string) => {
				console.log(`Ended Collection.`);

				const disabledComponent = { ...componentsForMsg };
				disabledComponent.components[0].disabled = true;

				await message.edit({ components: [disabledComponent] });
			}
		);
	},
});
