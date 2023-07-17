import { Contract } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, TOKEN_CONTRACT_ADDRESS } from "../Constants";



// retreives ether balance
export const getEtherBalance = async(provider, address, contract = false) => {
    try{
        if(contract){
            const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
            return balance;
        } else{
            const balance = await provider.getBalance(address);
            return balance;
        }
    }
    catch(error){
        console.error(error);
        return 0;
    }
}

export const getCDTokensBalance = async(provider, address) => {
    try{
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
        const balanceOfCDToken = await tokenContract.balanceOf(address);
        return balanceOfCDToken;
    }catch(err){
        console.error(err);
        return 0;
    }
}

export const getLPTokensBalance = async(provider, address) => {
    try{
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        const balanceOfLPToken = await exchangeContract.balanceOf(address);
        return balanceOfLPToken;
    } catch(err){
        console.error(err);
        return 0;
    }
}

export const getReserveOfCDTokens = async(provider) => {
    try{
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
        const balanceOfCDToken = await tokenContract.getReserve();
        return balanceOfCDToken;
    }catch(err){
        console.error(err);
        return 0;
    }
}