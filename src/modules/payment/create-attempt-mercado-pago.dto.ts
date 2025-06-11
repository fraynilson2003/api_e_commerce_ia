export interface CreateAttemptMercadoPagoDto {
  amount: number;
  orderId: number;
  description?: string;
}
