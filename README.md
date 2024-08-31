## Giddy the Kitty bot
This is a hobby project to build a Telegram bot using Nodejs. 

The first (and probably only) game is a flag game, where you can add the bot to your group chat, and ask for a flag, players in that group can then try and answer the question which country this flag belongs to. 

Inspiration was playing too much geoguessr. 
If you want to run it yourself, get a Telegram API key and add it to `api_key.js` in the root foldere and expose it as `TOKEN`. 
Additionally, using Google Maps to calculate the distance between the guess and the solution, for this add `GOOGLE_KEY` to the same file with your api token.

End result might look like this:
```js
export const TOKEN='--your-key---';
export const GOOGLE_KEY='---your-key---';
``` 