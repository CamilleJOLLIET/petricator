"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const instructions_1 = require("../../managers/instructions");
module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand())
            return;
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'show')
            (0, instructions_1.showInstructions)({ interaction });
        if (subcommand === 'add')
            (0, instructions_1.addInstructionModal)({ interaction });
        if (subcommand === 'delete')
            (0, instructions_1.deleteInstructionChoices)({ interaction });
        if (subcommand === 'delete-all')
            (0, instructions_1.deleteAllInstructionsConfirmation)({ interaction });
        if (subcommand === 'update')
            (0, instructions_1.updateInstructionChoices)({ interaction });
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('instructions')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => subcommand.setName('show')
        .setDescription('Consulte les cibles prio.'))
        .addSubcommand(subcommand => subcommand.setName('add')
        .setDescription('Ajoute une consigne.'))
        .addSubcommand(subcommand => subcommand.setName('delete')
        .setDescription('Supprime une consigne.'))
        .addSubcommand(subcommand => subcommand.setName('delete-all')
        .setDescription('Supprime toutes les consignes.'))
        .addSubcommand(subcommand => subcommand.setName('update')
        .setDescription('Mets à jour une consigne.')),
};
