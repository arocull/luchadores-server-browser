import { Express } from 'express';

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
    // Every minute sweep servers we haven't heard from recently
    setInterval(() => {
      const cutoff = Date.now() - (60 * 2 * 1000);
      Object.entries(this.heartbeats)
        .filter(entry => entry[1].timestamp <= cutoff)
        .forEach(entry => {
          console.log('Sweeping server entry with cutoff', cutoff, ':', entry);
          delete this.heartbeats[entry[0]];
        });
    }, 60 * 1000);
  }

  // Heartbeat collection endpoint
  handler(app: Express) {
    app.post('/heartbeat', (req, res) => {
      Promise.resolve()
        .then(() => {
          console.log('Heartbeat body', req.body);
          return this.parseHeartbeat(req.body);
        })
        .then(data => {
          this.heartbeats[data.address] = data;
          res.status(204).send();
          console.log('New heartbeat list:', this.heartbeats);
        })
        .catch(err => {
          res.status(400).send((err as Error).message);
        });
    });
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
