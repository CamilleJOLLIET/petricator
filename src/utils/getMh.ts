import * as fs from 'fs';
import * as path from 'path';
import { Mh } from '../types/Mh';

export const filePath = path.resolve(__dirname, '../../mh.json');

export const getMh = (): Mh => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};
