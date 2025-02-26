"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showMissions = void 0;
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
