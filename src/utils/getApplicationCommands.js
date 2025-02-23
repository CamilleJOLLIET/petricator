module.exports = async (client, guildId) => {
    let applicationCommands;

    if (guildId) {
        const guild = await client.guilds.fetch(guildId);
        applicationCommands = guild.commands;
    } else {
        applicationCommands = await client.application.commands;
    }

    await applicationCommands.fetch();
    return applicationCommands;
}

// const { REST, Routes } = require('discord.js');
// import 'dotenv/config';

// const rest = new REST().setToken(process.env.TOKEN);

// // ...

// // for guild-based commands
// rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] })
// 	.then(() => console.log('👍 Successfully deleted all guild commands.'))
// 	.catch(console.error);

// // for global commands
// rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
// 	.then(() => console.log('👍 Successfully deleted all application commands.'))
// 	.catch(console.error);