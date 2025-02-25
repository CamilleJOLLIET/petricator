"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const targets_1 = require("../../managers/targets");
const instructions_1 = require("../../managers/instructions");
module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand())
            return;
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'targets')
            (0, targets_1.showTargets)({ interaction });
        if (subcommand === 'instructions')
            (0, instructions_1.showInstructions)({ interaction });
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('show')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => subcommand.setName('targets')
        .setDescription('Consulte les cibles prio.'))
        .addSubcommand(subcommand => subcommand.setName('instructions')
        .setDescription('Consulte les consignes.')),
};
