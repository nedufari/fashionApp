// webhook.controller.ts

import { Controller, Post, Headers, Body, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('/')
  async handleWebhook(@Headers() headers, @Body() body,@Res() res:Response) {
    // Call the WebhookService to handle the webhook data
    await this.webhookService.handleWebhook(res,body, headers);
  }
}
