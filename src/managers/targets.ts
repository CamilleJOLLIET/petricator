import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Target } from "../types/Target";
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve(__dirname, '../../mh.json');

export const getTargets = (): Target[] => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')).targets;
};

export const showTargets = ({ interaction }): void => {
    const targets: Target[] = getTargets();
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

export const addTarget = async ({ interaction }): Promise<void> => {
    try {
        const newTarget = {
            id: interaction.fields.getTextInputValue('idInput'),
            name: interaction.fields.getTextInputValue('nameInput'),
            position: interaction.fields.getTextInputValue('positionInput'),
            details: interaction.fields.getTextInputValue('detailsInput'),
        };
    
        const mhFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
        mhFile.targets.push(newTarget);
        fs.writeFileSync(filePath, JSON.stringify(mhFile, null));
    
        await interaction.reply({ content: 'La cible a bien été ajoutée', ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue, veuillez réessayer.', ephemeral: true });        
    }

    return;
}

export const deleteTargetModal = async ({ interaction }): Promise<void> => {
    const deleteTargetModal = new ModalBuilder()
        .setCustomId('deleteTargetModal')
        .setTitle('Supprime une cible prioritaire');

    const idInput = new TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID du bestiau')
        .setPlaceholder("Rend pas fou avé les brackets, juste l'ID.")
        .setStyle(TextInputStyle.Short);

    deleteTargetModal.addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(idInput));

    await interaction.showModal(deleteTargetModal);
};

export const deleteTarget = async ({ interaction }): Promise<void> => {
    try {
        const targetId = interaction.fields.getTextInputValue('idInput');
    
        const targetsFile = JSON.parse(fs.readFileSync(filePath, 'utf-8')).targets;
        const targetObject = targetsFile.find(target => target.id === targetId);
        
        if (!targetObject) {
            await interaction.reply({ content: 'Cible non trouvée.', ephemeral: true });
            return;
        }
    
        const updatedTargetsFile = targetsFile.filter(target => target.id !== targetId);
        fs.writeFileSync(filePath, JSON.stringify(updatedTargetsFile, null, 2));
    
        await interaction.reply({ content: 'La cible a bien été supprimée', ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue, veuillez réessayer.', ephemeral: true });        
    }

    return;
};

export const deleteAllTargetsConfirmation = async ({ interaction }): Promise<void> => {
    const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel(`C'est parti !`)
        .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Oublie ça')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(cancel, confirm);

    const response = await interaction.reply({
        content: `T'es bien sûr de ton coup ? On supprime toutes les cibles ?`,
        components: [row],
        withResponse: true,
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

        if (confirmation.customId === 'confirm') {
            console.log('confirm');
            await confirmation.update({ content: `Allez c'est parti !`, components: [] });
            await deleteAllTargets({ interaction });
            await interaction.editReply({ content: `C'est bon c'est tout clean !` });
        } else if (confirmation.customId === 'cancel') {
            console.log('cancel');
            await confirmation.update({ content: `Y'est pas fou lui...`, components: [] });
            await interaction.editReply({ content: `Allez on fait comme si rien ne s'était passé...` });
        }
    } catch {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }

    return;
};
export const deleteAllTargets = async ({ interaction }): Promise<void> => {
    try {
        const mhFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        mhFile.targets = [];

        fs.writeFileSync(filePath, JSON.stringify(mhFile, null, 2));
    } catch (error) {
        console.error(error);
    }

    return;
};
export const editTargetModal = async ({ interaction }): Promise<void> => {console.log('editTargetModal')};
export const editTarget = async ({ interaction }): Promise<void> => {console.log('editTarget')};