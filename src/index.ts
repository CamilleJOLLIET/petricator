import 'dotenv/config';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { 
    Client,
    IntentsBitField,
    GatewayIntentBits, 
    EmbedBuilder, 
    Events
} from 'discord.js';
import { CommandHandler } from 'djs-commander';

const uri = process.env.MONGODB_URI as string;

export const client = new Client({
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