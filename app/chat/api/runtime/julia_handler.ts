import { NextApiRequest, NextApiResponse } from 'next';
import { KafkaClient, Producer } from 'kafka-node';
import WebSocket from 'ws';

interface JuliaAnalysisRequest {
  code: string;
  dataSource?: string;
  visualizations?: string[];
  userId: string;
  sessionId: string;
}

class JuliaRuntimeHandler {
  private producer: Producer;
  private wsConnections: Map<string, WebSocket>;

  constructor() {
    const client = new KafkaClient({ kafkaHost: process.env.KAFKA_HOST || 'localhost:9092' });
    this.producer = new Producer(client);
    this.wsConnections = new Map();
  }

  async handleRequest(req: NextApiRequest, res: NextApiResponse) {
    const { code, dataSource, visualizations, userId, sessionId } = req.body as JuliaAnalysisRequest;

    try {
      // Send analysis request to Julia runtime service
      await this.sendToAnalysisQueue({
        code,
        dataSource,
        visualizations,
        userId,
        sessionId,
        runtime: 'julia'
      });

      return res.status(200).json({
        status: 'processing',
        sessionId,
        message: 'Analysis request sent to Julia runtime'
      });

    } catch (error) {
      console.error('Julia runtime error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to process Julia analysis request',
        error: error instanceof Error ? error.message : "Unknown Error occurred!"
      });
    }
  }

  private async sendToAnalysisQueue(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.producer.send([{
        topic: 'julia_analysis_queue',
        messages: JSON.stringify(data)
      }], (err, result) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public registerWebSocket(sessionId: string, ws: WebSocket) {
    this.wsConnections.set(sessionId, ws);

    ws.on('close', () => {
      this.wsConnections.delete(sessionId);
    });
  }

  public sendResult(sessionId: string, result: any) {
    const ws = this.wsConnections.get(sessionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(result));
    }
  }
}

export default new JuliaRuntimeHandler();
