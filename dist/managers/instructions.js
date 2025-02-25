"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInstructionModal = exports.showInstructions = void 0;
const getMh_1 = require("../utils/getMh");
const discord_js_1 = require("discord.js");
const showInstructions = ({ interaction }) => {
    const instructions = (0, getMh_1.getMh)().instructions;
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📝 Consignes 📝')
        .setColor('#FF69B4');
    if (instructions.length) {
        for (const instruction of instructions) {
            embed.addFields({
                name: instruction.content,
                value: instruction.usersConcerned?.length ?
                    instruction.usersConcerned.join(', ') + '\n' + instruction.date :
                    instruction.date,
            });
        }
        ;
    }
    else {
        embed.setFooter({ text: 'Aucune consigne en cours. Instant free boobs !' });
    }
    interaction.reply({ embeds: [embed] });
    return;
};
exports.showInstructions = showInstructions;
const addInstructionModal = async ({ interaction }) => {
    const addInstructionModal = new discord_js_1.ModalBuilder()
        .setCustomId('addInstructionModal')
        .setTitle('Ajoute une consigne');
    const contentInput = new discord_js_1.TextInputBuilder()
        .setCustomId('contentInput')
        .setLabel('La dite consigne')
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    const usersConcerned = new discord_js_1.TextInputBuilder()
        .setCustomId('usersConcerned')
        .setLabel('Joueur(s) concerné(s)')
        .setRequired(false)
        .setStyle(discord_js_1.TextInputStyle.Short);
    addInstructionModal
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(contentInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(usersConcerned));
    await interaction.showModal(addInstructionModal);
};
exports.addInstructionModal = addInstructionModal;
