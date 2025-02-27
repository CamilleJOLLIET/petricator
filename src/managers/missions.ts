import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Mission } from "../types/Mission";
import { getMh, saveMh } from "../utils/getMh";

export const showMissions = ({ interaction }): void => {
    const missions: Mission[] = getMh().missions;
    const embed = new EmbedBuilder()
        .setTitle('📜 Missions 📜')
        .setColor('#FF69B4');

    if (missions.length) {
        for (const mission of missions) {
            embed.addFields({ 
                name: `[${mission.id}] Mission de ${mission.owner}`,
                value: `Leader: ${mission.leader}\nEtape en cours: ${mission.currentStep}\nMembres: ${mission.members?.join(', ')}`,
            })
        };
    } else {
        embed.setFooter({ text: 'Aucune consigne en cours. Instant free boobs !'});
    }
    interaction.reply({ embeds: [embed] });
    return;
}

export const addMissionModal = async ({ interaction }): Promise<void> => {
    const addMissionModal = new ModalBuilder()
        .setCustomId('addMissionModal')
        .setTitle('Ajoutes une mission');
    
    const idInput = new TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID de la mission')
        .setPlaceholder("Rend pas fou avé les brackets, juste l'ID.")
        .setStyle(TextInputStyle.Short);
    
    const ownerInput = new TextInputBuilder()
        .setCustomId('ownerInput')
        .setLabel('Propriétaire de la mission')
        .setPlaceholder('Le nom du ou des proprios')
        .setStyle(TextInputStyle.Short);
    
    const leaderInput = new TextInputBuilder()
        .setCustomId('leaderInput')
        .setLabel('Leader de la mission')
        .setPlaceholder('Le nom du leader')
        .setStyle(TextInputStyle.Short);

    const currentStepInput = new TextInputBuilder()
        .setCustomId('currentStepInput')
        .setLabel('Etape en cours')
        .setPlaceholder('Intitulé de l\'étape en cours')
        .setStyle(TextInputStyle.Paragraph);
    
    const membersInput = new TextInputBuilder()
        .setCustomId('membersInput')
        .setLabel('Trolls participants')
        .setPlaceholder('Noms des trolls participants')
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph);
    
    addMissionModal
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(idInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ownerInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(leaderInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(currentStepInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(membersInput))

    await interaction.showModal(addMissionModal);
};

export const addMission = ({ interaction }): void => {
    try {
        const id = interaction.fields.getTextInputValue('idInput');
        const owner = interaction.fields.getTextInputValue('ownerInput');
        const leader = interaction.fields.getTextInputValue('leaderInput');
        const currentStep = interaction.fields.getTextInputValue('currentStepInput');
        const members = interaction.fields.getTextInputValue('membersInput');
        
        const newMission: Mission = {
            id,
            owner,
            leader,
            currentStep,
            members: members.length ? members.split(',') : [],
        };

        const mh = getMh();
        
        mh.missions.push(newMission);
        saveMh(mh);

        interaction.reply({ content: `Mission [${id}] de ${owner} ajoutée !` });
    } catch (error) {
        console.log(error);
        interaction.reply({ content: `Erreur lors de l'ajout de la mission.` });
    }
    return;
}

export const deleteMissionChoices = async ({ interaction }): Promise<void> => {
    const response = await buildMissionsChoices({ interaction }, 'supprimer');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
    
    try {
        collector.on('collect', async i => {
            const selection = i.values[0];
            const mh = getMh();
            mh.missions.splice(parseInt(selection), 1);
            saveMh(mh);
            await i.reply(`La consigne a été supprimée !`);
        });
    } catch (error) {
        await interaction.editReply({ 
            content: `Une erreur est survenue pendant le choix de l'instruction à supprimer: ${error}`,
            components: [] 
        });
    }

    return;
};

export const deleteAllMissionsConfirmation = async ({ interaction }): Promise<void> => {
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
        content: `T'es bien sûr de ton coup ? On supprime toutes les missions ?`,
        components: [row],
        withResponse: true,
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

        if (confirmation.customId === 'confirm') {
            await confirmation.update({ content: `Allez c'est parti !`, components: [] });
            await deleteAllMissions({ interaction });
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

export const deleteAllMissions = async ({ interaction }): Promise<void> => {
    try {
        const mhFile = getMh();
        mhFile.missions = [];
        saveMh(mhFile);
    } catch (error) {
        console.error(error);
    }

    return;
};

export const updateMissionChoices = async ({ interaction }): Promise<void> => {
    const response = await buildMissionsChoices({ interaction }, 'mettre à jour');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
    
    try {
        collector.on('collect', async i => {
            const selection = i.values[0];
            const missions = getMh().missions;
            const mission = missions[parseInt(selection)];

            await updateMissionModal(i, mission, selection);
        });
    } catch (error) {
        console.log(error);
        await interaction.editReply({ 
            content: `Une erreur est survenue pendant le choix de la mission.`,
            components: [] 
        });
    }

    return;
};

export const updateMissionModal = async (interaction, mission, selection): Promise<void> => {
    const updateMissionModal = new ModalBuilder()
        .setCustomId(`updateMissionModal-${selection}`)
        .setTitle(`Mets à jour la mission [${mission.id}] de ${mission.owner}`);

        const idInput = new TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID de la mission')
        .setValue(mission.id)
        .setStyle(TextInputStyle.Short);
    
    const ownerInput = new TextInputBuilder()
        .setCustomId('ownerInput')
        .setLabel('Propriétaire de la mission')
        .setValue(mission.owner)
        .setStyle(TextInputStyle.Short);
    
    const leaderInput = new TextInputBuilder()
        .setCustomId('leaderInput')
        .setLabel('Leader de la mission')
        .setValue(mission.leader)
        .setStyle(TextInputStyle.Short);

    const currentStepInput = new TextInputBuilder()
        .setCustomId('currentStepInput')
        .setLabel('Etape en cours')
        .setValue(mission.currentStep)
        .setStyle(TextInputStyle.Paragraph);
    
    const membersInput = new TextInputBuilder()
        .setCustomId('membersInput')
        .setLabel('Trolls participants')
        .setPlaceholder('Noms des trolls participants')
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph);

    if (mission.members) membersInput.setValue(mission.members.join(','));

    updateMissionModal
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(idInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ownerInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(leaderInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(currentStepInput))
        .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(membersInput));

    await interaction.showModal(updateMissionModal);
};

export const updateMission = async ({ interaction }): Promise<void> => {
    try {
        const id = interaction.fields.getTextInputValue('idInput');
        const owner = interaction.fields.getTextInputValue('ownerInput');
        const leader = interaction.fields.getTextInputValue('leaderInput');
        const currentStep = interaction.fields.getTextInputValue('currentStepInput');
        const members = interaction.fields.getTextInputValue('membersInput');

        const mhFile = getMh();
        const missionObject = mhFile.missions.find(mission => mission.id === id);
        
        if (!missionObject) {
            await interaction.reply({ content: 'Cible non trouvée.', ephemeral: true });
            return;
        }
    
        const updatedTargetObject = mhFile.missions.map(mission => {
            if (mission.id === id) {
                if (owner) mission.owner = owner;
                if (leader) mission.leader = leader;
                if (currentStep) mission.currentStep = currentStep;
                if (members) mission.members = members.length ? members.split(',') : [];
            }
            return mission;
        });

        mhFile.missions = updatedTargetObject;
    
        saveMh(mhFile);
    
        await interaction.reply({ content: 'La mission a bien été modifiée', ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue, veuillez réessayer.', ephemeral: true });        
    }

    return;
};


const buildMissionsChoices = async ({ interaction }, action: string) => {
    const mhFile = getMh();
        const missions = mhFile.missions;
    
        if (!missions.length) {
            interaction.reply({ content: 'Aucune mission à mettre à jour.', ephemeral: true });
            return;
        }
    
        const selectMissionInput = new StringSelectMenuBuilder()
            .setCustomId('selectMissionInput')
            .setPlaceholder("Liste des missions existantes");
    
        for (let index = 0; index < missions.length; index++) {
            const element = missions[index];
            const label = `[${element.id}] - Mission de ${element.owner}`;
            
            selectMissionInput.addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel(label)
                .setValue(index.toString())
            )
        }
            
        const row = new ActionRowBuilder()
            .addComponents(selectMissionInput);
    
        return await interaction.reply({
            content: `Choisis la mission à ${action}.`,
            components: [row],
            withResponse: true,
            ephemeral: true
        });
};