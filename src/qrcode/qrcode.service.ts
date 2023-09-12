import { Injectable } from '@nestjs/common';
import * as qr from 'qrcode'

@Injectable()
export class QrcodeService {
    constructor(){}

    async generateContractQrCode(contractData:any):Promise<string>{
        try {
            const qrCodeDataUrl = await qr.toDataUrl(JSON.stringify(contractData))
            return qrCodeDataUrl
            
        } catch (error) {
            throw error 
            
        }
    }
}
