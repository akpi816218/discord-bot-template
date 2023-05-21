/**
 * @fileoverview
 * This file is used to build the commands for the bot.
 * It is not used in production.
 */

import { join } from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { TOKEN } from './TOKEN';
import { argv, cwd } from 'process';
import { clientId } from './config';
import fs from 'fs';

argv.shift();
argv.shift();

const commands = [];
const commandsPath = join(cwd(), 'commands');
let commandFiles;
if (argv.length == 0) {
	commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.ts'));
} else {
	commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.ts') && argv.includes(file));
}
for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const command = await import(filePath);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '10' }).setToken(TOKEN);
await rest.put(Routes.applicationCommands(clientId), { body: [] });
await rest.put(Routes.applicationCommands(clientId), { body: commands });
console.log(await rest.get(Routes.applicationCommands(clientId)));
