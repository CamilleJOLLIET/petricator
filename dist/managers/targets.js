"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTargetModal = exports.showTargets = void 0;
const discord_js_1 = require("discord.js");
const showTargets = ({ interaction }, targets) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('🎯 Cibles prioritaires 🎯')
        .setColor('#FF69B4');
    if (targets.length) {
        for (const target of targets) {
            embed.addFields({
                name: `[${target.id}] ${target.name}`,
                value: target.details ? target.position + '\n' + target.details : target.position,
            });
        }
        ;
    }
    else {
        embed.setFooter({ text: 'Aucune cible définie' });
    }
    interaction.reply({ embeds: [embed] });
    return;
};
exports.showTargets = showTargets;
const addTargetModal = async ({ interaction }) => {
    const addTargetModal = new discord_js_1.ModalBuilder()
        .setCustomId('addTargetModal')
        .setTitle('Ajoute une cible prioritaire');
    const idInput = new discord_js_1.TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID du bestiau')
        .setPlaceholder("Rend pas fou avé les brackets, juste l'ID.")
        .setStyle(discord_js_1.TextInputStyle.Short);
    const nameInput = new discord_js_1.TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel('Nom du bestiau')
        .setStyle(discord_js_1.TextInputStyle.Short);
    const positionInput = new discord_js_1.TextInputBuilder()
        .setCustomId('positionInput')
        .setLabel('Position du bestiau')
        .setStyle(discord_js_1.TextInputStyle.Short);
    const detailsInput = new discord_js_1.TextInputBuilder()
        .setCustomId('detailsInput')
        .setLabel('Consignes supplémentaires')
        .setRequired(false)
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    addTargetModal
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(idInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(nameInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(positionInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(detailsInput));
    await interaction.showModal(addTargetModal);
};
exports.addTargetModal = addTargetModal;
