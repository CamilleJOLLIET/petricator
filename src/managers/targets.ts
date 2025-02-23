import { ActionRowBuilder, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Target } from "../types/Target";
import * as fs from 'fs';
import * as path from 'path';

export const showTargets = ({ interaction }, targets: Target[]): void => {
    const embed = new EmbedBuilder()
        .setTitle('🎯 Cibles prioritaires 🎯')
        .setColor('#FF69B4');

    if (targets.length) {
        for (const target of targets) {
            embed.addFields({ 
                name: `[${target.id}] ${target.name}`,
                value: target.details ? target.position + '\n' + target.details : target.position,
            })
        };
    } else {
        embed.setFooter({ text: 'Aucune cible définie'});
    }
    interaction.reply({ embeds: [embed] });
    return;
}

export const addTargetModal = async ({ interaction }): Promise<void> => {
    const addTargetModal = new ModalBuilder()
        .setCustomId('addTargetModal')
        .setTitle('Ajoute une cible prioritaire');

    const idInput = new TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID du bestiau')
        .setPlaceholder("Rend pas fou avé les brackets, juste l'ID.")
        .setStyle(TextInputStyle.Short);

    const nameInput = new TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel('Nom du bestiau')
        .setStyle(TextInputStyle.Short);

    const positionInput = new TextInputBuilder()
        .setCustomId('positionInput')
        .setLabel('Position du bestiau')
        .setStyle(TextInputStyle.Short);

    const detailsInput = new TextInputBuilder()
        .setCustomId('detailsInput')
        .setLabel('Consignes supplémentaires')
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph);

    addTargetModal
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(idInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(positionInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(detailsInput));

    await interaction.showModal(addTargetModal);
};
