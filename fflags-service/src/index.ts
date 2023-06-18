import {buildServer} from './buildServer.js';
import {connectToDB} from './connectToDB.js';

const main = async (): Promise<void> => {
  try {
    const PORT = 3000;
    await connectToDB();
    const server = await buildServer();
    await server.listen({port: PORT});
    console.log(`Server ready at port: ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main().catch(console.log);