export interface IRabbitMQService {
  connect(): Promise<void>;
  close(): Promise<void>;
}
