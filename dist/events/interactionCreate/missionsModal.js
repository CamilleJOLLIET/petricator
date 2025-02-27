"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const missions_1 = require("../../managers/missions");
module.exports = async (interaction) => {
    if (!interaction.isModalSubmit())
        return;
    const { customId } = interaction;
    if (customId === 'addMissionModal')
        (0, missions_1.addMission)({ interaction });
    if (customId.startsWith('updateMissionModal'))
        (0, missions_1.updateMission)({ interaction });
};
