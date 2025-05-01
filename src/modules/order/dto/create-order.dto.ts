import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from 'src/DB/Models/order.model';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMothod: PaymentMethod;
}
