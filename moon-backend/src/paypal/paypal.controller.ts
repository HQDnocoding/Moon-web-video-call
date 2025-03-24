import { Controller, Post, Body, Param, Get, Query, InternalServerErrorException, BadRequestException, Req, NotFoundException } from "@nestjs/common";
import { PayPalService } from "./paypal.service";

@Controller("paypal")
export class PayPalController {
  constructor(private readonly payPalService: PayPalService) { }

  @Post('create-subscription')
  async createSubscription(@Body() body: { email: string; planId: string }) {
    if (!body.email || !body.planId) {
      throw new BadRequestException('Email and Plan ID are required');
    }

    try {
      return await this.payPalService.createSubscription(body.email, body.planId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create subscription');
    }
  }


  @Post('cancel-subscription')
  async cancelSubscription(@Body() body: { subscriptionId: string }) {
    return this.payPalService.cancelSubscription(body.subscriptionId);
  }

  @Get('subscription-status/:subscriptionId')
  async getSubscriptionStatus(@Param('subscriptionId') subscriptionId: string) {
    try {
      // Kiểm tra subscriptionId có hợp lệ không (tùy chọn)
      if (!subscriptionId || typeof subscriptionId !== 'string' || subscriptionId.trim() === '') {
        throw new NotFoundException('Subscription ID is invalid or missing');
      }

      // Gọi service để lấy trạng thái subscription
      const subscriptionStatus = await this.payPalService.getSubscriptionDetails(subscriptionId);

      // Nếu không tìm thấy subscription, ném lỗi 404
      if (!subscriptionStatus) {
        throw new NotFoundException(`Subscription ${subscriptionId} not found`);
      }

      return subscriptionStatus;
    } catch (error) {
      // Nếu lỗi từ PayPalService là NotFound, giữ nguyên
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Các lỗi khác (ví dụ: lỗi server, lỗi mạng), trả về 500
      throw new InternalServerErrorException(`Failed to retrieve subscription status: ${error.message}`);
    }
  }

  @Post('webhook')
  async handleWebhook(@Req() req: any) {
    const event = req.body;

    if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
      console.log(`✅ Payment successful for subscription ${event.resource.billing_agreement_id}`);
    }

    if (event.event_type === 'BILLING.SUBSCRIPTION.SUSPENDED') {
      console.log(`⚠️ Subscription ${event.resource.id} is suspended. Notify user.`);
    }

    return { status: 'Webhook received' };
  }

}
