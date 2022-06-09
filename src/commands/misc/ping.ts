import Eris, {
	ActionRow,
	CommandInteraction,
	ComponentInteraction,
	Interaction,
	InteractionButton,
	Message,
} from "eris";
import { bot } from "../..";

// import BetterComponentCollector from "../../functions/custom_collectors/ComponentCollector";

import { BCommand } from "../../structures/Command";
import EmeraldComponentCollector, {
	EmeraldComponentCollectorOptions,
} from "../../util/AltListener";
import getButtonCollections, {
	listenerFilterType,
} from "../../util/AltListener";

export default new BCommand({
	name: "ping",
	description: "hello",
	type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,

	run: async ({ interaction }) => {
		const componentsForMsg: ActionRow = {
			type: Eris.Constants.ComponentTypes.ACTION_ROW,
			components: [
				{
					type: Eris.Constants.ComponentTypes.BUTTON,
					label: "Click me!",
					custom_id: "click_me",
					style: Eris.Constants.ButtonStyles.PRIMARY,
				},
			],
		};

		await interaction.createMessage({
			content: "Respond with a button!",
			components: [componentsForMsg],
		});

		const message = await interaction.getOriginalMessage();

		const collectorFilter: listenerFilterType = (i) => {
			return i.message.id === message.id /* && i.channel.id === channel */;
		};

		const options: EmeraldComponentCollectorOptions = {
			client: bot,
			customID: "click_me",
			filter: collectorFilter,
			timeout: 3000,
			ogMessage: message,
		};

		const collector = new EmeraldComponentCollector(options);

		const collectThem = async () => {
			const press = await collector.awaitButton();
			return [press];
		};

		const collected = await collectThem();

		console.log(collected[0].id);

		const disabledComponent = { ...componentsForMsg };
		disabledComponent.components[0].disabled = true;

		await message.edit({ components: [disabledComponent] });
	},
});
