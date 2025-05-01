import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/common/constants/constants';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async createCheckoutSession({
    line_items,
    customer_email,
    discounts,
    metadata,
  }: Stripe.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer_email,
      discounts,
      success_url: 'http://localhost:5000/success',
      cancel_url: 'http://localhost:5000/cancel',
      metadata,
    });

    return session;
  }

  async createCoupon({ currency, percent_off }: Stripe.CouponCreateParams) {
    return this.stripe.coupons.create({ currency, percent_off });
  }
}
