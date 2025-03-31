require('dotenv').config(); const express = require('express'); const session = require('express-session'); const passport = require('passport'); const DiscordStrategy = require('passport-discord').Strategy; const path = require('path'); const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent ] });

const app = express();

app.set('view engine', 'ejs'); app.set('views', path.join(__dirname, 'views'));

app.use(session({ secret: process.env.SESSION_SECRET || 'supersecret', resave: false, saveUninitialized: false }));

passport.serializeUser((user, done) => done(null, user)); passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({ clientID: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, callbackURL: process.env.CALLBACK_URL, scope: ['identify', 'guilds'] }, (accessToken, refreshToken, profile, done) => { process.nextTick(() => done(null, profile)); }));

app.use(passport.initialize()); app.use(passport.session());

// Bot stats route 
app.get('/stats', async (req, res) => { try { const guildCount = client.guilds.cache.size; const userCount = client.users.cache.size; const uptime = Math.floor(client.uptime / 1000); const ping = client.ws.ping;

res.render('index', {
  guildCount,
  userCount,
  uptime,
  ping
});

} catch (err) { console.error('Failed to render stats:', err); res.status(500).send('Error loading stats'); } });

app.get('/', (req, res) => res.redirect('/stats'));

app.get('/guilds', async (req, res) => {
  try {
    const guilds = client.guilds.cache.map(guild => ({
      name: guild.name,
      id: guild.id,
      memberCount: guild.memberCount,
      iconURL: guild.iconURL({ dynamic: true, size: 128 }) || null
    }));

    res.render('guilds', { guilds });
  } catch (err) {
    console.error("Error loading guilds:", err);
    res.status(500).send("Failed to load guilds.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));

client.login(process.env.BOT_TOKEN);

