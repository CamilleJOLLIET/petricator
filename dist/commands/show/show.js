"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const targets_1 = require("../../managers/targets");
module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand())
            return;
        const subcommand = interaction.options.getSubcommand('targets');
        if (subcommand === 'targets')
            (0, targets_1.showTargets)({ interaction });
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('show')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => subcommand.setName('targets')
        .setDescription('Consulter les cibles prio.')),
};
