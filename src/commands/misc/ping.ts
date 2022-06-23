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
	type listenerFilterType,
} from "../../util/Mainlistener";

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
			return i.message.id === message.id;
		};

		const options: EmeraldComponentCollectorOptions = {
			client: bot,
			customID: "click_me",
			filter: collectorFilter,
			timeout: 10000,
			ogMessage: message,
		};

		const collector: EmeraldComponentCollector = new EmeraldComponentCollector(
			options
		);

		const collectThem = async (num) => {
			const collected: ComponentInteraction[] = [];

			for (let i = 0; i < num; i++) {
				bot.setMaxListeners(bot.getMaxListeners() + 1);
				collected.push(await collector.awaitButton());
				bot.setMaxListeners(bot.getMaxListeners() - 1);
			}

			return collected;
		};

		const collected = await collectThem(1);

		console.log(collected[0].id);

		const disabledComponent = { ...componentsForMsg };
		disabledComponent.components[0].disabled = true;

		await message.edit({ components: [disabledComponent] });
	},
});
