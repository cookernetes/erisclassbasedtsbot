import Eris, { Client, type ApplicationCommand } from "eris";
import { botToken, guildID } from "../config.json";
import { BetterClient } from "./structures/Client";

export const otype = Eris.Constants.ApplicationCommandOptionTypes;

export const bot = new BetterClient(
	botToken,
	{
		intents: ["allNonPrivileged"],
	},
	guildID
);

(async () => {
	await bot.start();
})();
