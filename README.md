# discord-bot-template

This a template for those getting started with [Discord.js](https://discord.js.org),

I have populated this template with features, snippets, types, and extended classes that I use in my own code.

You are free to modify and use it (MIT license) as long as you keep the original license with the code.

Take a look at my YouTube channel — I may have some videos that could help you.

And finally, read the [docs](https://discord.js.org). You are *so* lucky to be using such an intuitive library with such comprehensive (and beautiful) documentation. I learned to use this library and coded my bot [DisCog](https://github.com/akpi816218/discog) solely by reading the docs.

## Getting started

1. Head over to your [Discord Developer Portal](https://discord.dev). Create an application (you can find tutorials for this elsewhere).
2. Copy your bot token.
3. Put it in a file called `TOKEN.ts`, located in `src/`.
4. Now this is VERY important: before committing the changes (assuming that you are using git), make sure that the `.gitignore` includes a pattern that excludes this file.
5. Start your bot by running `npm start`!

## Creating slash commands

1. Copy the contents of `src/commands/z.command.tstemplate` into another file in the same directory.
2. Edit lines 9-10, making sure the command information is accurate.
3. Adding subcommands or options (optional): see the [Discord.js guide](https://discordjs.guide/creating-your-bot/command-handling.html#executing-commands). Note that the guide uses CJS modules, but this template uses ESM.
4. Write the handler function (`execute`).

When you write commands and restart your bot, the new commands do not become available to Discord users. You must run `npm run build` to manually register your commands with Discord. This may take a while, as it globally registers *all* of your commands. If you have too many commands and would just like to test a couple of commands, run the command like so: `npm run build -- [filename] ...`. You may specify as many files as you want.

## Creating event handlers

1. Copy the contents of `src/events/z.event.tstemplate` into another file in the same directory.
2. Edit line 8 to read something similar to `export const name = Events.GuildCreate`.
3. Edit line 10 to reflect whether you want to handle the event exactly once or normally handle every instance.
4. Write the handler function (`execute`).

You do not need to register events with Discord's servers; your bot gets sent all the events it has permissions for anyways.
