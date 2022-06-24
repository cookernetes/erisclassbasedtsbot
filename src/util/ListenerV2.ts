import { BetterClient } from "../structures/Client";
import EventEmitter from "events";
import { CommandInteraction, ComponentInteraction } from "eris";

interface IOptions {
	time: number;
	filter: (i: ComponentInteraction) => boolean;
	client: BetterClient;
	ogMessageID: string;
	maxMatches?: number;
}

/**
 * A simple Eris interaction collector
 */
export class InteractionHandler extends EventEmitter {
	options: IOptions;
	ended: boolean;
	collected: ComponentInteraction[];
	listener: (interaction: ComponentInteraction) => Promise<boolean>;

	constructor(options: IOptions) {
		super();

		this.options = options;
		this.ended = false;
		this.collected = [];
		this.listener = (interaction) => this.checkPreConditions(interaction);
		this.options.client.on("interactionCreate", this.listener);

		if (options.time) {
			setTimeout(() => this.stopListening("time"), options.time);
		}
	}

	async checkPreConditions(interaction: ComponentInteraction) {
		if (this.options.filter(interaction)) {
			this.emit("collect", interaction);
			await interaction.acknowledge();

			this.collected.push(interaction);

			if (this.collected.length >= this.options.maxMatches) {
				this.stopListening("Maximum Matches Reached");
				return true;
			}
		} else {
			return false;
		}
	}

	/**
	 * Stops collecting interactions and removes the listener from the client
	 */
	stopListening(reason: string) {
		if (this.ended) {
			return;
		}

		this.ended = true;

		this.options.client.removeListener("interactionCreate", this.listener);

		this.emit("end", this.collected, reason);
	}
}
