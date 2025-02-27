"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMission = exports.updateMissionModal = exports.updateMissionChoices = exports.deleteAllMissions = exports.deleteAllMissionsConfirmation = exports.deleteMissionChoices = exports.addMission = exports.addMissionModal = exports.showMissions = void 0;
const discord_js_1 = require("discord.js");
const getMh_1 = require("../utils/getMh");
const showMissions = ({ interaction }) => {
    const missions = (0, getMh_1.getMh)().missions;
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📜 Missions 📜')
        .setColor('#FF69B4');
    if (missions.length) {
        for (const mission of missions) {
            embed.addFields({
                name: `[${mission.id}] Mission de ${mission.owner}`,
                value: `Leader: ${mission.leader}\nEtape en cours: ${mission.currentStep}\nMembres: ${mission.members?.join(', ')}`,
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
exports.showMissions = showMissions;
const addMissionModal = async ({ interaction }) => {
    const addMissionModal = new discord_js_1.ModalBuilder()
        .setCustomId('addMissionModal')
        .setTitle('Ajoutes une mission');
    const idInput = new discord_js_1.TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID de la mission')
        .setPlaceholder("Rend pas fou avé les brackets, juste l'ID.")
        .setStyle(discord_js_1.TextInputStyle.Short);
    const ownerInput = new discord_js_1.TextInputBuilder()
        .setCustomId('ownerInput')
        .setLabel('Propriétaire de la mission')
        .setPlaceholder('Le nom du ou des proprios')
        .setStyle(discord_js_1.TextInputStyle.Short);
    const leaderInput = new discord_js_1.TextInputBuilder()
        .setCustomId('leaderInput')
        .setLabel('Leader de la mission')
        .setPlaceholder('Le nom du leader')
        .setStyle(discord_js_1.TextInputStyle.Short);
    const currentStepInput = new discord_js_1.TextInputBuilder()
        .setCustomId('currentStepInput')
        .setLabel('Etape en cours')
        .setPlaceholder('Intitulé de l\'étape en cours')
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    const membersInput = new discord_js_1.TextInputBuilder()
        .setCustomId('membersInput')
        .setLabel('Trolls participants')
        .setPlaceholder('Noms des trolls participants')
        .setRequired(false)
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    addMissionModal
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(idInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(ownerInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(leaderInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(currentStepInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(membersInput));
    await interaction.showModal(addMissionModal);
};
exports.addMissionModal = addMissionModal;
const addMission = ({ interaction }) => {
    try {
        const id = interaction.fields.getTextInputValue('idInput');
        const owner = interaction.fields.getTextInputValue('ownerInput');
        const leader = interaction.fields.getTextInputValue('leaderInput');
        const currentStep = interaction.fields.getTextInputValue('currentStepInput');
        const members = interaction.fields.getTextInputValue('membersInput');
        const newMission = {
            id,
            owner,
            leader,
            currentStep,
            members: members.length ? members.split(',') : [],
        };
        const mh = (0, getMh_1.getMh)();
        mh.missions.push(newMission);
        (0, getMh_1.saveMh)(mh);
        interaction.reply({ content: `Mission [${id}] de ${owner} ajoutée !` });
    }
    catch (error) {
        console.log(error);
        interaction.reply({ content: `Erreur lors de l'ajout de la mission.` });
    }
    return;
};
exports.addMission = addMission;
const deleteMissionChoices = async ({ interaction }) => {
    const response = await buildMissionsChoices({ interaction }, 'supprimer');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, time: 3_600_000 });
    try {
        collector.on('collect', async (i) => {
            const selection = i.values[0];
            const mh = (0, getMh_1.getMh)();
            mh.missions.splice(parseInt(selection), 1);
            (0, getMh_1.saveMh)(mh);
            await i.reply(`La consigne a été supprimée !`);
        });
    }
    catch (error) {
        await interaction.editReply({
            content: `Une erreur est survenue pendant le choix de l'instruction à supprimer: ${error}`,
            components: []
        });
    }
    return;
};
exports.deleteMissionChoices = deleteMissionChoices;
const deleteAllMissionsConfirmation = async ({ interaction }) => {
    const confirm = new discord_js_1.ButtonBuilder()
        .setCustomId('confirm')
        .setLabel(`C'est parti !`)
        .setStyle(discord_js_1.ButtonStyle.Danger);
    const cancel = new discord_js_1.ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Oublie ça')
        .setStyle(discord_js_1.ButtonStyle.Secondary);
    const row = new discord_js_1.ActionRowBuilder()
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
            await (0, exports.deleteAllMissions)({ interaction });
            await interaction.editReply({ content: `C'est bon c'est tout clean !` });
        }
        else if (confirmation.customId === 'cancel') {
            await confirmation.update({ content: `Y'est pas fou lui...`, components: [] });
            await interaction.editReply({ content: `Allez on fait comme si rien ne s'était passé...` });
        }
    }
    catch {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }
    return;
};
exports.deleteAllMissionsConfirmation = deleteAllMissionsConfirmation;
const deleteAllMissions = async ({ interaction }) => {
    try {
        const mhFile = (0, getMh_1.getMh)();
        mhFile.missions = [];
        (0, getMh_1.saveMh)(mhFile);
    }
    catch (error) {
        console.error(error);
    }
    return;
};
exports.deleteAllMissions = deleteAllMissions;
const updateMissionChoices = async ({ interaction }) => {
    const response = await buildMissionsChoices({ interaction }, 'mettre à jour');
    const collector = response.resource.message.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, time: 3_600_000 });
    try {
        collector.on('collect', async (i) => {
            const selection = i.values[0];
            const missions = (0, getMh_1.getMh)().missions;
            const mission = missions[parseInt(selection)];
            await (0, exports.updateMissionModal)(i, mission, selection);
        });
    }
    catch (error) {
        console.log(error);
        await interaction.editReply({
            content: `Une erreur est survenue pendant le choix de la mission.`,
            components: []
        });
    }
    return;
};
exports.updateMissionChoices = updateMissionChoices;
const updateMissionModal = async (interaction, mission, selection) => {
    const updateMissionModal = new discord_js_1.ModalBuilder()
        .setCustomId(`updateMissionModal-${selection}`)
        .setTitle(`Mets à jour la mission [${mission.id}] de ${mission.owner}`);
    const idInput = new discord_js_1.TextInputBuilder()
        .setCustomId('idInput')
        .setLabel('ID de la mission')
        .setValue(mission.id)
        .setStyle(discord_js_1.TextInputStyle.Short);
    const ownerInput = new discord_js_1.TextInputBuilder()
        .setCustomId('ownerInput')
        .setLabel('Propriétaire de la mission')
        .setValue(mission.owner)
        .setStyle(discord_js_1.TextInputStyle.Short);
    const leaderInput = new discord_js_1.TextInputBuilder()
        .setCustomId('leaderInput')
        .setLabel('Leader de la mission')
        .setValue(mission.leader)
        .setStyle(discord_js_1.TextInputStyle.Short);
    const currentStepInput = new discord_js_1.TextInputBuilder()
        .setCustomId('currentStepInput')
        .setLabel('Etape en cours')
        .setValue(mission.currentStep)
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    const membersInput = new discord_js_1.TextInputBuilder()
        .setCustomId('membersInput')
        .setLabel('Trolls participants')
        .setPlaceholder('Noms des trolls participants')
        .setRequired(false)
        .setStyle(discord_js_1.TextInputStyle.Paragraph);
    if (mission.members)
        membersInput.setValue(mission.members.join(','));
    updateMissionModal
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(idInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(ownerInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(leaderInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(currentStepInput))
        .addComponents(new discord_js_1.ActionRowBuilder().addComponents(membersInput));
    await interaction.showModal(updateMissionModal);
};
exports.updateMissionModal = updateMissionModal;
const updateMission = async ({ interaction }) => {
    try {
        const id = interaction.fields.getTextInputValue('idInput');
        const owner = interaction.fields.getTextInputValue('ownerInput');
        const leader = interaction.fields.getTextInputValue('leaderInput');
        const currentStep = interaction.fields.getTextInputValue('currentStepInput');
        const members = interaction.fields.getTextInputValue('membersInput');
        const mhFile = (0, getMh_1.getMh)();
        const missionObject = mhFile.missions.find(mission => mission.id === id);
        if (!missionObject) {
            await interaction.reply({ content: 'Cible non trouvée.', ephemeral: true });
            return;
        }
        const updatedTargetObject = mhFile.missions.map(mission => {
            if (mission.id === id) {
                if (owner)
                    mission.owner = owner;
                if (leader)
                    mission.leader = leader;
                if (currentStep)
                    mission.currentStep = currentStep;
                if (members)
                    mission.members = members.length ? members.split(',') : [];
            }
            return mission;
        });
        mhFile.missions = updatedTargetObject;
        (0, getMh_1.saveMh)(mhFile);
        await interaction.reply({ content: 'La mission a bien été modifiée', ephemeral: true });
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Une erreur est survenue, veuillez réessayer.', ephemeral: true });
    }
    return;
};
exports.updateMission = updateMission;
const buildMissionsChoices = async ({ interaction }, action) => {
    const mhFile = (0, getMh_1.getMh)();
    const missions = mhFile.missions;
    if (!missions.length) {
        interaction.reply({ content: 'Aucune mission à mettre à jour.', ephemeral: true });
        return;
    }
    const selectMissionInput = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('selectMissionInput')
        .setPlaceholder("Liste des missions existantes");
    for (let index = 0; index < missions.length; index++) {
        const element = missions[index];
        const label = `[${element.id}] - Mission de ${element.owner}`;
        selectMissionInput.addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel(label)
            .setValue(index.toString()));
    }
    const row = new discord_js_1.ActionRowBuilder()
        .addComponents(selectMissionInput);
    return await interaction.reply({
        content: `Choisis la mission à ${action}.`,
        components: [row],
        withResponse: true,
        ephemeral: true
    });
};
