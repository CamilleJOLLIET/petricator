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
            (0, targets_1.deleteTargetModal)({ interaction });
        if (subcommand === 'all-targets')
            (0, targets_1.deleteAllTargetsConfirmation)({ interaction });
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('delete')
        .setDescription('Supprime des données du Petricator.')
        .addSubcommand(subcommand => subcommand.setName('target')
        .setDescription('Supprime une cible prioritaire.'))
        .addSubcommand(subcommand => subcommand.setName('all-targets')
        .setDescription('Supprime toute les cibles prioritaires.')),
};
