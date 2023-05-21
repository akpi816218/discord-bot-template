/**
 * @fileoverview The extended discord classes and types
 */

import {
	ChatInputCommandInteraction,
	Client,
	ClientOptions,
	Collection,
	SlashCommandBuilder
} from 'discord.js';
import { ReadonlyCollection } from '@discordjs/collection';

export type EventExecuteHandler = (...args: unknown[]) => Promise<void>;

// We are creating an event interface to help the typings.
export interface Event {
	name: string;
	once: boolean;
	execute: EventExecuteHandler;
}

// We are extending the Collection class from discord.js to add a freeze method.
// This method will freeze the collection, and all of its values.
// This is useful for caching, as it prevents the collection from being modified.
/**
 * The collection class.
 * @class ExtendedCollection
 * @classdesc The collection class.
 * @extends {Collection}
 * @method {ReadonlyCollection<K, V>} freeze - Freezes the collection.
 */
export class ExtendedCollection<K, V> extends Collection<K, V> {
	constructor(entries?: Iterable<readonly [K, V]> | null) {
		super(entries);
	}
	public freeze(): ReadonlyCollection<K, V> {
		return Object.freeze(this);
	}
}

// We are creating a command handler, which will be called when our command is executed.
// The command handler is an async function that takes one argument: the interaction that triggered the command.
export type CommandExecuteHandler = (
	// The interaction object contains information about the command execution, including the command's arguments.
	interaction: ChatInputCommandInteraction
) => Promise<void>;

// We are creating a command interface to help with typings.
// The command is an object with two properties: data and execute.
export interface Command {
	// The command to register with Discord
	data: SlashCommandBuilder;

	// The function to run when the command is executed
	execute: CommandExecuteHandler;
}

// We are extending the Client class from discord.js to add a commands property.
// This property is a collection of commands.
/**
 * The client class.
 * @class ExtendedClient
 * @classdesc The client class.
 * @extends {Client}
 * @property {ClientOptions} options - The client options.
 * @property {ExtendedCollection<string, Command>} commands - A collection of commands.
 */
export class ExtendedClient extends Client {
	commands: ExtendedCollection<string, Command>;

	constructor(options: ClientOptions) {
		super(options);

		this.commands = new ExtendedCollection<string, Command>();
	}
}

export { ExtendedClient as CommandClient };
