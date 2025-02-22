// module.exports = {
//     name: 'ping',
//     description: 'Replies with the bot ping.',
//     callback: async (client, interaction) => {
//         await interaction.deferReply();

//         const reply = await interaction.fetchReply();

//         const ping = reply.createdTimestamp - interaction.createdTimestamp;

//         interaction.editReply(
//             `Pong ! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`
//         );
//     },
// };

// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder().setName('ping').setDescription('Replies Pong!'),
//     run: ({ interaction }) => {
//         interaction.reply('Pong Pang!');
//     },
// }

import { SlashCommandBuilder, Interaction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies Pong!'),
    run: ({interaction}) => {
        interaction.reply('Pong Pang!');
    },
}