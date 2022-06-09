//TODO: Make this support multiple clicks and not end on first click

import Eris, { ComponentInteraction, Constants, Message, User } from "eris";
import { BetterClient } from "../structures/Client";

// Promise Resolver
type ResolveToInteraction = (d: ComponentInteraction) => void;

export type listenerFilterType = (i: ComponentInteraction) => boolean;

export interface EmeraldComponentCollectorOptions {
	client: BetterClient;
	customID: string;
	timeout: number;
	ogMessage?: Message<Eris.TextableChannel>;
	filter: listenerFilterType;
	maxCollected?: number;
}

export default class EmeraldComponentCollector {
	client: BetterClient;
	customID: string;
	timeout: number;
	ogMessage?: Message<Eris.TextableChannel>;
	filter: listenerFilterType;
	listening = false;
	buttons: Record<string, ResolveToInteraction> = {};
	maxCollected: number;

	constructor(options: EmeraldComponentCollectorOptions) {
		Object.assign(this, options);
	}

	async awaitButton(): Promise<ComponentInteraction> {
		if (!this.listening) {
			this.client.on("interactionCreate", (interaction) => {
				if (interaction.type !== Constants.InteractionTypes.MESSAGE_COMPONENT)
					return;
				if (interaction.data.component_type !== Constants.ComponentTypes.BUTTON)
					return;

				if (!this.buttons[interaction.data.custom_id]) return;

				if (this.filter && !this.filter(interaction)) return;

				interaction.acknowledge();

				this.buttons[interaction.data.custom_id](interaction);
				delete this.buttons[interaction.data.custom_id];
			});
		}
		this.listening = true;

		try {
			return new Promise((resolve, reject) => {
				this.buttons[this.customID] = resolve;

				setTimeout(() => {
					if (!this.buttons[this.customID]) return;

					delete this.buttons[this.customID];
					reject(console.log("Timed out"));
				}, this.timeout);
			});
		} catch (e) {
			console.log(e);
		}
	}
}

/* 
export default async function getButtonCollections(
	maxCollected: number,
	options: EmeraldComponentCollectorOptions
): Promise<ComponentInteraction[]> {
	if (maxCollected < 1) {
		throw new Error(
			"[EMERALD COMPONENT COLLECTOR] Max collected value must be greater than 0"
		);
	}

	const collected: ComponentInteraction[] = [];

	for (let i = 0; i < maxCollected; i++) {
		const _collector = new EmeraldComponentCollector(options);
		collected.push(await _collector.awaitButton());
	}

	return collected;
}
 */
