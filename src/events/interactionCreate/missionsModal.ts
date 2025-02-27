import { addMission, updateMission } from '../../managers/missions';

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    const { customId } = interaction;

    if (customId === 'addMissionModal') addMission({ interaction });
    if (customId.startsWith('updateMissionModal')) updateMission({ interaction });
};