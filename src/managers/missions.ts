import { EmbedBuilder } from "discord.js";
import { Mission } from "../types/Mission";
import { getMh } from "../utils/getMh";

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