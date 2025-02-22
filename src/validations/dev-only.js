require('dotenv').config();

module.exports = (interaction, commandObj) => {
    if (commandObj.devOnly) {
        if (interaction.member.id !== process.env.DEV_ID) {
            interaction.reply("This command is for dev only.");
            return true;
        }
    }
};