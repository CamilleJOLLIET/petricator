import * as fs from 'fs';
import * as path from 'path';

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'addTargetModal') {
        const newTarget = {
            id: interaction.fields.getTextInputValue('idInput'),
            name: interaction.fields.getTextInputValue('nameInput'),
            position: interaction.fields.getTextInputValue('positionInput'),
            details: interaction.fields.getTextInputValue('detailsInput'),
        };

        const filePath = path.resolve(__dirname, '../../../mh.json');
        const mhFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        mhFile.targets.push(newTarget);
        fs.writeFileSync(filePath, JSON.stringify(mhFile, null));

        await interaction.reply({ content: 'La cible a bien été ajouté' });
	}
};