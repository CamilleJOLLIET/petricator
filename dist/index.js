"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose = require("mongoose");
const path = require("path");
const mongodb_1 = require("mongodb");
const discord_js_1 = require("discord.js");
const djs_commander_1 = require("djs-commander");
const uri = process.env.MONGODB_URI;
// require('dotenv').config();
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const { 
//     Client,
//     IntentsBitField,
//     GatewayIntentBits, 
//     EmbedBuilder 
// } = require('discord.js');
// const mongoose = require('mongoose');
// const { CommandHandler } = require('djs-commander');
// const path = require('path');
// const eventHandler = require('./handlers/eventHandler');
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
});
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongo = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
new djs_commander_1.CommandHandler({
    client,
    commandsPath: path.join(__dirname, 'commands'),
    eventsPath: path.join(__dirname, 'events'),
    validationsPath: path.join(__dirname, 'validations'),
    testServer: process.env.GUILD_ID
});
(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri);
        console.log('Connected to DB.');
        client.login(process.env.TOKEN);
    }
    catch (error) {
        console.log(`Error on DB connexion: ${error}`);
    }
})();
// client.on('messageCreate', (message) => {
//     if (message.author.bot) {
//         return;
//     }
//     if (message.content === '!mh') {
//         message.reply('Hey');
//     }
//     if (message.content === '!embed') {
//         const embed = new EmbedBuilder()
//             .setTitle('Embed Title')
//             .setDescription('This is a description')
//             .setColor('#FF69B4')
//             .addFields({ 
//                 name: 'Field Title',
//                 value: 'Some random value',
//                 inline: true
//             }, { 
//                 name: 'Second Field Title',
//                 value: 'Some random value',
//                 inline: true
//             });
//         message.channel.send({ embeds: [embed] });
//     }
// })
// client.on('interactionCreate', (interaction) => {
//     if (!interaction.isChatInputCommand()) return;
//     if (interaction.commandName === 'add') {
//         const num1 = interaction.options.get('first-number')?.value;
//         const num2 = interaction.options.get('second-number')?.value;
//         interaction.reply(`${num1} + ${num2} ça fait ${num1 + num2} aingkulé !`);
//     }
//     if (interaction.commandName === 'embed') {
//         const embed = new EmbedBuilder()
//             .setTitle('Embed Title')
//             .setDescription('This is a description')
//             .setColor('#FF69B4')
//             .addFields({ 
//                 name: 'Field Title',
//                 value: 'Some random value',
//                 inline: true
//             }, { 
//                 name: 'Second Field Title',
//                 value: 'Some random value',
//                 inline: true
//             });
//         interaction.reply({ embeds: [embed] });
//     }
// })
// client.on('messageCreate', (message) => {
// });
