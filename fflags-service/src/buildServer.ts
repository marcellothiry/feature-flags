import {fastify, FastifyInstance} from 'fastify';
import {getFFlagsRoutes} from './fflags/fflags.routes.js';

export const buildServer = async (): Promise<FastifyInstance> => {
  const server = fastify({
    logger: true,
  });
  server.get('/healthcheck', async () => ({status: 'OK'}));
  await server.register(getFFlagsRoutes, {prefix: 'api/fflags'});
  return server;
};