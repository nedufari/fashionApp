import { Injectable } from "@nestjs/common";
import { PaymentConfig } from "./payment.config";

@Injectable()
export class PaymentService{
    constructor(private readonly flutterwaveService,
        private readonly paystackService,
        ){}


        async InitiatePaymentwithFlutterWave():Promise<any>{
            const publickey =PaymentConfig.flutterwave.publicKey
        }
}