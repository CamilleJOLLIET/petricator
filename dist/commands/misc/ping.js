"use strict";
// module.exports = {
//     name: 'ping',
//     description: 'Replies with the bot ping.',
//     callback: async (client, interaction) => {
//         await interaction.deferReply();
Object.defineProperty(exports, "__esModule", { value: true });
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
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder().setName('ping').setDescription('Replies Pong!'),
    run: ({ interaction }) => {
        interaction.reply('Pong Pang!');
    },
};
