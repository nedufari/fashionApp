import { IsNumber, MinLength, MaxLength, IsNotEmpty, Equals, Length, IsString } from 'class-validator';
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
