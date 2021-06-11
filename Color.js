const {
  ChatClient,
  AlternateMessageModifier,
  SlowModeRateLimiter
} = require("dank-twitch-irc");

const config = require("./config.json")
const Rainbow = require("rainbowvis.js")
const opts = {
  username: config.username.toLowerCase(),
  password: config.oauth.replace("oauth:", ""),
  rateLimits: "default",
  channels: config.channels.map(chn => chn.toLowerCase())
};

let client = new ChatClient(opts);

client.on("ready", () => {
  console.log(`Conectado ao chat com sucesso DankMods`);
});
client.on("close", error => {
  if (error != null) {
    console.error("Erro ", error);
  }
});
client.use(new SlowModeRateLimiter(client), 2);
client.use(new AlternateMessageModifier(client));

client.connect();
client.joinAll(opts.channels);

var rainbow = new Rainbow()

// as cores que fazem o degradê 
rainbow.setSpectrum('red', 'FF00E4', '00DEFF', '00FF2A', 'FFEA00', 'red');

var n = 0
client.on("PRIVMSG", async msg => {
  if (msg.senderUsername == opts.username) {
    n += 5
    client.privmsg(opts.username, "/color #" + rainbow.colourAt(n))
    if (n >= 100) {
      n = 0
    }
  }
});