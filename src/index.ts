import 'dotenv/config';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { 
    Client,
    IntentsBitField,
    GatewayIntentBits, 
    EmbedBuilder 
} from 'discord.js';
import { CommandHandler } from 'djs-commander';

const uri = process.env.MONGODB_URI as string;
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

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongo = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

new CommandHandler({
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
    } catch (error) {
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
