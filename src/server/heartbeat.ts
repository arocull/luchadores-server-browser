import { Express } from 'express';

import logger from './logger';

interface HeartbeatData {
  title: string;
  address: string;
  playerCount: number;
  playerCapacity: number;
  timestamp: number;
}

interface HeartbeatMap {
  [address: string]: HeartbeatData;
}

class Heartbeat {
  private heartbeats: HeartbeatMap = {};

  constructor() {
    // Every interval, sweep servers we haven't heard from recently
    setInterval(() => {
      const cutoff = Date.now() - (30 * 1000);
      Object.entries(this.heartbeats)
        .filter(entry => entry[1].timestamp <= cutoff)
        .forEach(entry => {
          logger.debug('Sweeping server entry: %s @ %s', entry[1].title, entry[1].address);
          delete this.heartbeats[entry[0]];
        });
    }, 10 * 1000);
  }

  registerEndpoints(app: Express) {
    // Heartbeat list endpoint
    app.get('/list', (req, res): void => {
      logger.debug('Request to get servers');
      res.status(200).json(this.getServerList());
    });

    // Heartbeat collection endpoint
    app.post('/heartbeat', (req, res): void => {
      Promise.resolve()
        .then(() => {
          logger.silly('Heartbeat body', req.body);
          return this.parseHeartbeat(req.body);
        })
        .then(data => {
          if (!this.heartbeats[data.address]) {
            logger.info('New server added: %s @ %s', data.title, data.address);
          }
          this.heartbeats[data.address] = data;
          logger.silly('New heartbeat list: %j', this.heartbeats);
          res.status(204).send();
        })
        .catch(err => {
          logger.error('Heartbeat endpoint error: %o', err);
          res.status(400).send((err as Error).message);
        });
    });
  }

  getServerList(): HeartbeatData[] {
    return Object.values(this.heartbeats);
  }

  // Parses and validates heartbeat data
  private parseHeartbeat(data: any): HeartbeatData {
    if (data == null) {
      throw new Error('Empty data provided');
    }
    const title = String.prototype.trim.apply(data.title || '');
    const address = String.prototype.trim.apply(data.address || '');
    const playerCount = parseInt(data.playerCount) || 0;
    const playerCapacity = parseInt(data.playerCapacity) || 0;
  
    if (title.length == 0) {
      throw new Error('Invalid server title - must not be empty');
    }
    if (address.length == 0) {
      throw new Error('Invalid server address - must not be empty');
    }
    if (playerCapacity <= 0) {
      throw new Error('Invalid player capacity - must be > 0');
    }
  
    return {
      title,
      address,
      playerCount,
      playerCapacity,
      timestamp: Date.now(),
    };
  }
}

export { Heartbeat as default };
