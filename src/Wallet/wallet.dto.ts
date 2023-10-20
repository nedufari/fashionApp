import { IsNumber, MinLength, MaxLength, IsNotEmpty, Equals, Length, IsString, IsEmail } from 'class-validator';
import { Match } from '../match.decorator';

export class CreateWalletDto {
  @IsString()
  @Length(4,4)
  @IsNotEmpty({message:'please privide a secure PIN for trasactions'})
  PIN: string;

  @IsString()
  @Length(4,4)
  @IsNotEmpty({message:'please confirm your pin'})
  @Match('PIN', { message: 'Confirmation PIN does not match the transaction PIN.' })
  confirmPIN: string;

}

export class InitializeFundingDto{
  @IsNumber()
  @IsNotEmpty()
  amount:number

  @IsString()
  @IsNotEmpty()
  walletID:string

  @IsEmail()
  @IsNotEmpty()
  email:number

}

export class InitializeWithdrawalDto{
  @IsNumber()
  @IsNotEmpty()
  amount:number

  @IsEmail()
  @IsNotEmpty()
  email:number

  @IsString()
  @IsNotEmpty()
  walletID:string
}


export class ComfirmPaymentDto{
  @IsString()
  @IsNotEmpty()
  reference:number

 
}