"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const targets_1 = require("../../managers/targets");
const instructions_1 = require("../../managers/instructions");
module.exports = {
    run: async ({ interaction }) => {
        if (!interaction.isChatInputCommand())
            return;
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'target')
            (0, targets_1.addTargetModal)({ interaction });
        if (subcommand === 'instruction')
            (0, instructions_1.addInstructionModal)({ interaction });
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('add')
        .setDescription('Ajouter des données au Petricator.')
        .addSubcommand(subcommand => subcommand.setName('target')
        .setDescription('Ajoute une cible prioritaire.'))
        .addSubcommand(subcommand => subcommand.setName('instruction')
        .setDescription('Ajoute une consigne.')),
};
