import TelegramBot from 'node-telegram-bot-api/lib/telegram.js';

import { FlagGame } from './src/games/flagGame.js';
import { areEqual } from './src/helpers/areEqual.js';
import { emojiFacepalm } from './src/helpers/emojis.js';
import { TOKEN } from './api_key.js';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, {polling: true});
bot.on('polling_error', console.log);

const commands = ['help', 'start', 'geef-op'];
let instances = {};

bot.onText(/\/giddy (.+)/, async(msg, match) => {
  const { chat, text, from} = msg;
  const command = match[1];
  logEntry(from.first_name, text || '[foto/sticker]', chat.title || 'private chat');
  
  if(command && commands.includes(command.toLowerCase())){

    if (areEqual(command, commands[0])){ // Help
      return bot.sendMessage(chat.id, `Deze commands zijn beschikbaar /giddy ${commands.join(', ')} en /gok`);
    }
    if (areEqual(command, commands[1])){ // start
      const flagGameInstance = instances[chat.id] || undefined;
      if(flagGameInstance && !flagGameInstance.isGuessed){ // Game loopt al
        return bot.sendMessage(chat.id, 'Je hebt al een game lopen, wil je die opgeven? Stuur dan `/giddy geef-op`');
      }
      if(!flagGameInstance || flagGameInstance.isGuessed){
        instances[chat.id] = new FlagGame();
        const flag = await instances[chat.id].startGame();
        return bot.sendPhoto(chat.id, flag);
      }      
    }
    if(areEqual(command, commands[2])){  //geef-op
      instances[chat.id].isGuessed = true;
      instances[chat.id].winner = 'Giddy'; 
      return bot.sendMessage(chat.id, `helaas hebben jullie hem niet geraden :( het juiste antwoord was ${instances[chat.id].getAnswer()}`);
    }
  }else{
    return bot.sendMessage(chat.id, `Ik krijg niet genoeg eten voor ${command}, probeer anders 1 van deze opties: ${commands.join(', ')}`);
  }
});

bot.onText(/\/gok (.+)/, async (msg, match) => {
  const {chat, from, text} = msg;
  const { id } = chat;
  const guess = match[1];
  logEntry(from.first_name, text || '[foto/sticker]', chat.title || 'private chat');

  if(!instances[chat.id]){
    return bot.sendMessage(id, 'Je moet eerst een game starten voordat je kunt gokken.. '+emojiFacepalm);
  }

  if(instances[chat.id].isGuessed){
    return bot.sendMessage(id, `helaas is deze vlag al geraden door ${instances[chat.id].winner}, start een nieuwe game met '/giddy start'`);
  }

  const playerName = from.first_name || from.username;

  if(await instances[chat.id].guess(guess, playerName)){
    return bot.sendMessage(id, `winner winner, chicken dinner! Goed gegokt ${playerName}! Het was inderdaad ${instances[chat.id].getAnswer()}! Je hebt hem gevonden na een totaal van ${instances[chat.id].getGuessAmount()} ${instances[chat.id].getGuessAmount() > 1 ? 'gokken': 'gok'}`);
  }
  else{
    return bot.sendMessage(id, `helaas ${guess} is niet het juiste antwoord, ${await instances[chat.id].guessDistance(guess)}. Dit was poging ${instances[chat.id].getGuessAmount()}`);
  }  
});

bot.on('message', (msg) => {
  const { from, chat, text, sticker } = msg;
  if(from.is_bot || text && (text.includes('gok') || text.includes('/giddy'))){
    return;
  }
  logEntry(from.first_name, text || sticker.emoji || 'undefined', chat.title);
});

const logEntry = (firstName, text, title) => console.log(`${firstName} schreef: "${text}" in ${title}`);