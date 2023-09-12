import { error } from "console";
import { customAlphabet } from "nanoid";
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid';


export const  generate2FACode6digits=()=>{
    const otp = Math.floor(1234567890 + Math.random()*123456789).toString();
    return otp;
};

export const  generate2FACode4digits=():string=>{
    const nanoid = customAlphabet('1234567890', 6);
    return nanoid();
};

export const randomAlphaNumeric = async (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

//mailer 



export const sendVerificationEail=({id,email})=>{
    const currenturl=`${process.env}`
    const uniqueString= uuidv4()+id

}