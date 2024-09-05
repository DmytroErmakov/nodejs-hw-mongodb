import { startServer } from "./server.js";
import { initMongoBD } from "./db/initMongoDB.js";

const bootstrap = async () => {
    await initMongoBD();
    startServer();

};

bootstrap();

