import { countries } from "../assets/countries.js";
import { areEqual } from "../helpers/areEqual.js";
import { calculateDistance } from "../helpers/googleMaps.js";

export class FlagGame{

    selectedCountry;
    isGuessed;
    winner;
    guessAmount;

    constructor(){
        this.selectedCountry = countries[Math.floor(Math.random() * countries.length)];
        this.isGuessed = false;
        this.winner = false;
        this.guessAmount = 0;
    }

    startGame(){
        return this.selectedCountry.flag;
    }
    
    guess(guesstimate, player){
        if(!guesstimate){
            return false;
        }
        this.guessAmount++;

        const { countryName, countryCode } = this.selectedCountry;

        if(areEqual(countryName, guesstimate) || areEqual(countryCode, guesstimate) || this.isClose(guesstimate, countryName)){
            this.isGuessed = true;
            this.winner = player;
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
        return this.selectedCountry.countryName;
     }

     getGuessAmount(){
        return this.guessAmount;
     }

     async guessDistance(guess){
        const distance = await calculateDistance(guess, this.selectedCountry.countryName);
        return distance ? `je zit er ${distance} van af` : `kon geen pad vinden tussen het land en ${guess}`;
     }

     isClose(guesstimate, countryName){
        let nameArray = countryName.replace(',', '').toLowerCase().split(' ');
        nameArray = nameArray.filter( word => word!== 'and');
        return nameArray.includes(guesstimate.toLowerCase());
     }

}


