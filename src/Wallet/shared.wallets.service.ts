import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { InitializeFundingDto, InitializeWithdrawalDto } from './wallet.dto';
import { Request } from 'express';
import { NotificationsRepository, WalletRepository } from '../auth/auth.repository';
import { Wallet } from '../Entity/wallet/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from '../Entity/Notification/notification.entity';
import { NotificationType } from '../Enums/notificationTypes.enum';

@Injectable()
export class SharedInitializeService {
  constructor(
    @InjectRepository(Wallet) private readonly walletripo: WalletRepository,
    @InjectRepository(Notifications)
    private notificationrepository: NotificationsRepository,
  ) {}

  async InitilizeFunding(dto: InitializeFundingDto) {
    
    //check for wallet id
    const checkID = await this.walletripo.findOne({
      where: { walletid: dto.walletID },
    });
    if (!checkID)
      throw new HttpException(
        `wallet with ${dto.walletID} does not exist`,
        HttpStatus.NOT_FOUND,
      );

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        dto,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // if payment is successful update the balance of the wallet
      if (response.data.status === true) {
        checkID.balance += dto.amount;
        await this.walletripo.save(checkID);
        // await this.addToWallet(dto.walletID, nairaAmount)

        //save the notification
        const notification = new Notifications();
        notification.account = checkID.owner;
        notification.subject = 'wallet funded!';
        notification.notification_type = NotificationType.wallet_funded;
        notification.message = `Hello ${checkID.owner}, just funded his wallet  ${checkID.walletid} and the balance is ${checkID.balance} `;
        await this.notificationrepository.save(notification);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to initalize funding',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async InitializeWithdrawalDto(dto: InitializeWithdrawalDto) {
    const params = {
      source: 'balance',
      reason: 'earnings Withdrawal',
      amount: dto.amount,
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/transfer',
        params,
        {
          headers: {
            Authorization: `Beaerer ${process.env.PAYSTACK_TEST_SECRET}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const createdAccount = response.data;

      if (createdAccount) {
        const verifyResponse = axios.get(
          `https://api.paystack.co/transfer/verify/${createdAccount?.data?.reference}`,
          {
            headers: {
              Authorization: `Beaerer ${process.env.PAYSTACK_TEST_SECRET}`,
            },
          },
        );

        //update the wallet if withdrawal is successful
        if ((await verifyResponse).data.status === true) {
          await this.subtractFromWallet(dto.walletID, dto.amount);
        }
        return (await verifyResponse).data;
      }
    } catch (error) {
      throw error;
    }
  }

  private async addToWallet(walletID: string, amount: number): Promise<Wallet> {
    try {
      // Find the wallet with the specified ID
      const wallet = await this.walletripo.findOne({
        where: { walletid: walletID },
      });

      if (!wallet) throw new Error(`Wallet with ID ${walletID} not found`);

      // Update the wallet balance by adding the specified amount
      wallet.balance += amount;

      await this.walletripo.save(wallet);
      return wallet;
    } catch (error) {
      throw error;
    }
  }

  private async subtractFromWallet(
    walletID: string,
    amount: number,
  ): Promise<Wallet> {
    try {
      // Find the wallet with the specified ID
      const wallet = await this.walletripo.findOne({
        where: { walletid: walletID },
      });

      if (!wallet) {
        // Wallet not found, you can throw an error or handle it as needed
        throw new Error(`Wallet with ID ${walletID} not found`);
      }

      if (wallet.balance < amount) {
        // Insufficient funds, you can throw an error or handle it as needed
        throw new Error(`Insufficient funds in wallet with ID ${walletID}`);
      }

      // Update the wallet balance by subtracting the specified amount
      wallet.balance -= amount;

      // Save the updated wallet to the database
      await this.walletripo.save(wallet);

      return wallet;
    } catch (error) {
      throw error;
    }
  }
}
