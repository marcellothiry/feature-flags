import {FastifyInstance} from 'fastify';
import {
  createFFlagHandler,
  deleteFFlagHandler,
  getAllFFlagsForCachingHandler,
  getFFlagByIdHandler,
  updateFFlagHandler
} from './fflags.controller.js';

export const getFFlagsRoutes = async (server: FastifyInstance): Promise<FastifyInstance> => {
  server.post('/', createFFlagHandler);
  server.put('/:fflagId', updateFFlagHandler);
  server.delete('/:fflagId', deleteFFlagHandler);
  server.get('/:fflagId', getFFlagByIdHandler);
  server.get('/caching/:environmentName', getAllFFlagsForCachingHandler);
  return server;
};