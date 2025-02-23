"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const mh_json_1 = __importDefault(require("../../../mh.json"));
const targets_1 = require("../../managers/targets");
module.exports = {
    run: ({ interaction }) => {
        if (!interaction.isChatInputCommand())
            return;
        const subcommand = interaction.options.getSubcommand('targets');
        if (subcommand === 'targets')
            (0, targets_1.showTargets)({ interaction }, mh_json_1.default.targets);
    },
    data: new discord_js_1.SlashCommandBuilder()
        .setName('show')
        .setDescription('Consulter Petricator.')
        .addSubcommand(subcommand => subcommand.setName('targets')
        .setDescription('Consulter les cibles prio.')),
};
