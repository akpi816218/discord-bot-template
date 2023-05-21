/**
 * @fileoverview The main file for the application
 */

import {
	ActivityType,
	Events,
	GatewayIntentBits,
	PresenceUpdateStatus
} from 'discord.js';
import { Command, CommandClient } from './struct/discord/Extend';
import { Method, createServer } from './server';
import { argv, cwd } from 'process';
import { Event } from './struct/discord/Extend';
import { TOKEN } from './TOKEN';
import { inviteLink } from './config';
import { join } from 'path';
import { logger } from './logger';
import { readdir } from 'fs/promises';

argv.shift();
argv.shift();
if (argv.includes('-d')) logger.level = 'debug';

const server = createServer(
	{
		handler: (_req, res) => res.redirect(inviteLink),
		method: Method.GET,
		route: '/invite'
	},
	{
		handler: (_req, res) =>
			res
				.status(200)
				.end(
					startDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
				),
		method: Method.GET,
		route: '/'
	}
);

const client = new CommandClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildScheduledEvents
	],

	// Set the bot's presence.
	presence: {
		activities: [
			{
				name: 'Custom status',
				type: ActivityType.Playing
			}
		],
		afk: false,
		status: PresenceUpdateStatus.Online
	}
});

const commandsPath = join(cwd(), 'src', 'commands');
const commandFiles = (await readdir(commandsPath)).filter((file) =>
	file.endsWith('.ts')
);
for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const command: Command = await import(filePath);
	client.commands.set(command.data.name, command);
}
client.commands.freeze();

const eventsPath = join(cwd(), 'src', 'events');
const eventFiles = (await readdir(eventsPath)).filter((file) =>
	file.endsWith('.ts')
);
for (const file of eventFiles) {
	const filePath = join(eventsPath, file);
	const event: Event = await import(filePath);
	if (event.once)
		client.once(event.name, async (...args) => await event.execute(...args));
	else client.on(event.name, async (...args) => await event.execute(...args));
}

client
	.on(Events.ClientReady, () => logger.info('Client#ready'))
	.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.user.bot) return;
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) {
				await interaction.reply('Internal error: Command not found');
				return;
			}
			try {
				await command.execute(interaction);
			} catch (e) {
				logger.error(e);
				if (interaction.replied || interaction.deferred) {
					await interaction.editReply(
						'There was an error while running this command.'
					);
				} else {
					await interaction.reply({
						content: 'There was an error while running this command.',
						ephemeral: true
					});
				}
			}
		}
	})
	.on(Events.Debug, (m) => logger.debug(m))
	.on(Events.Error, (m) => logger.error(m))
	.on(Events.Warn, (m) => logger.warn(m));

await client.login(TOKEN);

process.on('SIGINT', () => {
	client.destroy();
	logger.info('Destroyed Client.');
	process.exit(0);
});

const startDate = Object.freeze(new Date());

logger.info('Process setup complete.');

server.listen(8000);
