import * as paypal from "@paypal/checkout-server-sdk";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Cron } from "@nestjs/schedule";
import { UsersService } from "src/users/users.service";

@Injectable()
export class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private webUrl: string;

  constructor(private configService: ConfigService, private readonly usersService: UsersService) {

    this.clientId = this.configService.get("PAYPAL_CLIENT_ID") || "";
    this.clientSecret = this.configService.get("PAYPAL_SECRET") || "";
    this.baseUrl = this.configService.get("PAYPAL_API_URL") || ""; // Sandbox URL
    this.webUrl = this.configService.get("URL_WEB") || ""; // Sandbox URL

  }

  async getAccessToken(): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: { username: this.clientId, password: this.clientSecret },
      },
    );
    return response.data.access_token;
  }


  async createSubscription(userEmail: string, planId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await axios.post(
      `${this.baseUrl}/v1/billing/subscriptions`,
      {
        plan_id: planId,
        subscriber: { email_address: userEmail },
        application_context: {
          return_url: `${this.webUrl}`,
          cancel_url: `${this.webUrl}`
        }
      },
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      },
    );

    await this.usersService.updatePaymentMethod(userEmail, response.data.id);

    return response.data;
  }

  async getSubscriptionDetails(subscriptionId: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const response = await axios.get(
      `${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    return response.data;
  }

  async getNextBillingDate(subscriptionId: string): Promise<string> {
    const subscription = await this.getSubscriptionDetails(subscriptionId);
    return subscription.next_billing_time; // Ngày thanh toán tiếp theo
  }



  async cancelSubscription(subscriptionId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    try {
      // Gọi API PayPal để hủy subscription
      await axios.post(
        `${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`,
        { reason: 'User requested cancellation' },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      // Cập nhật subscriptionId trong MongoDB
      const updatedUser = await this.usersService.updateSubscriptionId(subscriptionId, "");
      if (!updatedUser) {
        throw new NotFoundException(`User with subscription ${subscriptionId} not found`);
      }

      return { message: 'Subscription cancelled successfully' };
    } catch (error) {
      console.error(`Error cancelling subscription ${subscriptionId}:`, error.response?.data || error.message);
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }


  // Lấy trạng thái Subscription
  async getSubscriptionStatus(subscriptionId: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const response = await axios.get(
      `${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return {
      status: response.data.status,
      next_billing_time: response.data.start_time,
    };
  }
}
