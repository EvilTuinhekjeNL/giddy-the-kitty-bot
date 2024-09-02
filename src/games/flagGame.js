import { countries } from "../assets/countries.js";
import { areEqual } from "../helpers/areEqual.js";
import { calculateDistance, getCountry } from "../helpers/googleMaps.js";

export class FlagGame{

    selectedCountry;
    isGuessed;
    winner;
    guessAmount;
    lastGuess;

    constructor(){
        this.selectedCountry = countries[Math.floor(Math.random() * countries.length)];
        this.isGuessed = false;
        this.winner = false;
        this.guessAmount = 0;
    }

    async startGame(){
        try{
         const { formattedAddress, geometry } = await getCountry(this.selectedCountry.countryName);
         this.selectedCountry.formattedAddress = formattedAddress;
         this.selectedCountry.geometry = geometry;
        }catch(error){  
         console.error(error);
        }
        return this.selectedCountry.flag;
    }
    
    async guess(guesstimate, player){
        if(!guesstimate){
            return false;
        }
        this.guessAmount++;

        const { countryCode, formattedAddress } = this.selectedCountry;
        let guesstimateCountry;
        try { 
         guesstimateCountry = await getCountry(guesstimate);
         this.lastGuess = guesstimateCountry;
        }catch(error){
         console.error(error);
        }

        if(guesstimateCountry && formattedAddress && areEqual(guesstimateCountry.formattedAddress, formattedAddress)) {
         return this.winGame(player);
        }
        if(await this.isClose(guesstimateCountry, this.selectedCountry) || areEqual(countryCode, guesstimate)){
         return this.winGame(player);
        }
         
        return this.isGuessed;
     }

     isGuessed(){
        return this.isGuessed;
     }

     getWinner(){
        return this.winner;
     }

     getAnswer(){
        return this.selectedCountry?.formattedAddress || this.selectedCountry.countryName;
     }

     getGuessAmount(){
        return this.guessAmount;
     }

     winGame(player){
      this.isGuessed = true;
      this.winner = player;
      return true;
     }

     async guessDistance(guess){
         try{ 
            const distance = await calculateDistance(this.lastGuess.geometry, this.selectedCountry.geometry);
            return distance ? `je zit er ${distance} km van af` : `kon geen pad vinden tussen het land en ${guess}`;
         }catch(error){
            return `Kun je mij uitleggen waar ${guess} ligt..?`;
         }
     }

     async isClose(guesstimate, answer){
      try{
         const distance = await calculateDistance(guesstimate.geometry, answer.geometry);
         if(isNaN(parseFloat(distance))){
          return false;
         }
         console.info(`the distance between ${guesstimate.formattedAddress} and ${answer.formattedAddress} is ${distance}`);
         return distance <= 0.1;
      }catch(error){
         return false;
      }
     }

}


