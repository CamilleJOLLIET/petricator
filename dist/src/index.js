"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose = __importStar(require("mongoose"));
const path = __importStar(require("path"));
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
