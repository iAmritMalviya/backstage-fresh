import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger,
  identity: any,
  database: any,
  config: any,
  reader: any
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const { logger, identity,database, config,reader } = options;

  router.use(express.json());

  router.get('/health', async (req, response) => {
    logger.info('PONG!');
    console.log('config', config.getConfigArray('integrations.github'))
    const userIdentity = await identity.getIdentity({ request: req });
    
    const data = await reader.readUrl('https://github.com/iAmritMalviya/backstage.io/blob/master/examples/entities.yaml' )
    
    const see = await data.buffer().toString()
    console.log("data", see);
    


    response.json({ status: 'ok',
  data: data.buffer,
 stream: data.stream });
  });
  router.use(errorHandler());
  return router;
}
