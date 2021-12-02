import Runner from '../modules/Runner.js';
import { basename } from 'path';

export default class compileOne extends Runner {
    static config = {
        file: [ 'alliance_levels', 'planet_levels', 'badge_icons' ],
    }

    run(rawData) {
        const data = Object.fromEntries(
            Object.entries(Runner.compileOne(rawData)).map(([ k, v ]) => [
                k.replaceAll(' ', ''),
                v,
            ]),
        );
        data.Name = basename(this.metadata.originalFile, '.csv');

        return data;
    }
}
