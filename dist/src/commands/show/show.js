"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const mh_json_1 = __importDefault(require("../../../mh.json"));
module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand())
            return;
        const subcommand = interaction.options.getSubcommand('targets');
        if (subcommand === 'targets') {
            const targets = mh_json_1.default.targets;
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('🎯 Cibles prioritaires 🎯')
                .setColor('#FF69B4');
            if (targets.length) {
                for (const target of targets) {
                    embed.addFields({
                        name: `[${target.id}] ${target.name}`,
                        value: target.position,
                    });
                }
                ;
            }
            else {
                embed.setFooter({ text: 'Aucune cible définie' });
            }
            interaction.reply({ embeds: [embed] });
        }
        return;
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('show')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => subcommand.setName('targets')
        .setDescription('Consulter les cibles prio.')),
};
