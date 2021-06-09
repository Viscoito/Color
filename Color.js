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

let c = new ChatClient(opts);

c.on("ready", () => {
  console.log(`Conectado ao chat com sucesso DankMods`);
});
c.on("close", error => {
  if (error != null) {
    console.error("Erro ", error);
  }
});
c.use(new SlowModeRateLimiter(c), 2);
c.use(new AlternateMessageModifier(c));

c.connect();
c.joinAll(opts.channels);

var rainbow = new Rainbow()

// as cores que fazem o degradê 
rainbow.setSpectrum('red', 'FF00E4', '00DEFF', '00FF2A', 'FFEA00', 'red');

var n = 0
c.on("PRIVMSG", async msg => {
  if (msg.senderUsername == opts.username) {
    n += 5
    c.privmsg(opts.username, "/color #" + rainbow.colourAt(n))
    if (n >= 100) {
      n = 0
    }
  }
});