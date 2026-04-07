import * as Models from '../models/index.js';
import sequelize from './sequelize-client.js';

async function run() {
    try {
        await sequelize.sync({ force: true });
    }
    catch(error) {
        console.log("Error sync DB", error);
    }
    finally {
        await sequelize.close();
    }
}

await run();