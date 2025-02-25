"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const targets_1 = require("../../managers/targets");
module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.isChatInputCommand())
            return;
        const subcommand = interaction.options.getSubcommand('target');
        if (subcommand === 'target')
            (0, targets_1.updateTargetModal)({ interaction });
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('update')
        .setDescription('Ajouter des données au Petricator.')
        .addSubcommand(subcommand => subcommand.setName('target')
        .setDescription('Mets à jour une cible prioritaire.')),
};
