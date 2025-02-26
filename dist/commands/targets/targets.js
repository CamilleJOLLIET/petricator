"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const targets_1 = require("../../managers/targets");
module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand())
            return;
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'show')
            (0, targets_1.showTargets)({ interaction });
        if (subcommand === 'add')
            (0, targets_1.addTargetModal)({ interaction });
        if (subcommand === 'delete')
            (0, targets_1.deleteTargetChoices)({ interaction });
        if (subcommand === 'delete-all')
            (0, targets_1.deleteAllTargetsConfirmation)({ interaction });
        if (subcommand === 'update')
            (0, targets_1.updateTargetChoices)({ interaction });
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('targets')
        .setDescription('Gère les cibles.')
        .addSubcommand(subcommand => subcommand.setName('show')
        .setDescription('Consulte les cibles prios.'))
        .addSubcommand(subcommand => subcommand.setName('add')
        .setDescription('Ajoute une cible prioritaire.'))
        .addSubcommand(subcommand => subcommand.setName('delete')
        .setDescription('Supprime une cible prioritaire.'))
        .addSubcommand(subcommand => subcommand.setName('delete-all')
        .setDescription('Supprime toute les cibles prioritaires.'))
        .addSubcommand(subcommand => subcommand.setName('update')
        .setDescription('Mets à jour une cible prioritaire.')),
};
