import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Target } from "../types/Target";
import * as fs from 'fs';
import { getMh, filePath, saveMh } from "../utils/getMh";

export const showTargets = ({ interaction }): void => {
    const targets: Target[] = getMh().targets;
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
    
        const mhFile = getMh();
    
        mhFile.targets.push(newTarget);
        fs.writeFileSync(filePath, JSON.stringify(mhFile, null));
    
        await interaction.reply({ content: 'La cible a bien été ajoutée', ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue, veuillez réessayer.', ephemeral: true });        
    }

    return;
}

export const deleteTargetChoices = async ({ interaction }): Promise<void> => {
    const response = await buildTargetsChoices({ interaction }, 'supprimer');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
    
    try {
        collector.on('collect', async i => {
            const selection = i.values[0];
            const mh = getMh();
            mh.targets.splice(parseInt(selection), 1);
            saveMh(mh);
            await i.reply({
                content: `La cible a été supprimée !`,
                ephemeral: true
            });
        });
    } catch (error) {
        await interaction.editReply({ 
            content: `Une erreur est survenue pendant le choix de la cible à supprimer: ${error}`,
            components: [] 
        });
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
            await confirmation.update({ content: `Allez c'est parti !`, components: [] });
            await deleteAllTargets({ interaction });
            await interaction.editReply({ content: `C'est bon c'est tout clean !` });
        } else if (confirmation.customId === 'cancel') {
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
        const mhFile = getMh();
        mhFile.targets = [];

        fs.writeFileSync(filePath, JSON.stringify(mhFile, null, 2));
    } catch (error) {
        console.error(error);
    }

    return;
};

const buildTargetsChoices = async ({ interaction }, action) => {
    const mhFile = getMh();
    const targets = mhFile.targets;

    if (!targets.length) {
        interaction.reply({ content: 'Aucune cible à mettre à jour.', ephemeral: true });
        return;
    }

    const selectTargetInput = new StringSelectMenuBuilder()
        .setCustomId('selectTargetInput')
        .setPlaceholder("Liste des cibles existantes");

    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        const label = element.name.length > 50 ? `${element.name.slice(0, 50)}...` : element.name;
        
        selectTargetInput.addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(index.toString())
        )
    }
        
    const row = new ActionRowBuilder()
        .addComponents(selectTargetInput);

    return await interaction.reply({
        content: `Choisis la cible à ${action}.`,
        components: [row],
        withResponse: true,
        ephemeral: true
    });
}

export const updateTargetChoices = async ({ interaction }): Promise<void> => {
    const response = await buildTargetsChoices({ interaction }, 'mettre à jour');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
    
    try {
        collector.on('collect', async i => {
            const selection = i.values[0];
            const targets = getMh().targets;
            const target = targets[parseInt(selection)];

            await updateTargetModal(i, target, selection);
        });
    } catch (error) {
        await interaction.editReply({ 
            content: `Une erreur est survenue pendant le choix de l'instruction à supprimer: ${error}`,
            components: [] 
        });
    }

    return;
};

export const updateTargetModal = async (interaction, target, selection): Promise<void> => {
    const updateTargetModal = new ModalBuilder()
        .setCustomId(`updateTargetModal-${selection}`)
        .setTitle(`Modifie une cible prioritaire numéro ${parseInt(selection) + 1}`);

    const idInput = new TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID du bestiau')
        .setPlaceholder("Rend pas fou avé les brackets, juste l'ID.")
        .setValue(target.id)
        .setStyle(TextInputStyle.Short);

    const nameInput = new TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel('Nom du bestiau')
        .setPlaceholder("Laisse le champ vide si tu veux pas le changer.")
        .setValue(target.name)
        .setStyle(TextInputStyle.Short);

    const positionInput = new TextInputBuilder()
        .setCustomId('positionInput')
        .setLabel('Position du bestiau')
        .setPlaceholder("Laisse le champ vide si tu veux pas le changer.")
        .setValue(target.position)
        .setStyle(TextInputStyle.Short);

    const detailsInput = new TextInputBuilder()
        .setCustomId('detailsInput')
        .setLabel('Consignes supplémentaires')
        .setPlaceholder("Laisse le champ vide si tu veux pas le changer.")
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph);

    if (target.details) detailsInput.setValue(target.details);

    updateTargetModal
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(idInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(positionInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(detailsInput));

    await interaction.showModal(updateTargetModal);
};

export const updateTarget = async ({ interaction }): Promise<void> => {
    try {
        const targetId = interaction.fields.getTextInputValue('idInput');
        const name = interaction.fields.getTextInputValue('nameInput');
        const position = interaction.fields.getTextInputValue('positionInput');
        const details = interaction.fields.getTextInputValue('detailsInput');
    
        const mhFile = getMh();
        const targetObject = mhFile.targets.find(target => target.id === targetId);
        
        if (!targetObject) {
            await interaction.reply({ content: 'Cible non trouvée.', ephemeral: true });
            return;
        }
    
        const updatedTargetObject = mhFile.targets.map(target => {
            if (target.id === targetId) {
                if (name) target.name = name;
                if (position) target.position = position;
                if (details) target.details = details;
            }
            return target;
        });

        mhFile.targets = updatedTargetObject;
    
        fs.writeFileSync(filePath, JSON.stringify(mhFile, null, 2));
    
        await interaction.reply({ content: 'La cible a bien été modifiée', ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue, veuillez réessayer.', ephemeral: true });        
    }

    return;
};