
require('dotenv').config()
// const Discord = require('discord.js');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
var opus = require('node-opus');
const mongoose = require('mongoose')
const Commando = require('discord.js-commando');
const client = new Commando.Client({
    commandPrefix: '!db',
    owner: process.env.BOT_OWNER,
    disableEveryone: true
});

var options = { useNewUrlParser: true, keepAlive: 1, connectTimeoutMS: 30000, reconnectTries: 30, reconnectInterval: 5000 } ;
let uri = process.env.DATABASEURL;
mongoose.set('useCreateIndex', true);
mongoose.connect(uri, options);
mongoose.connection.on('connected', function(){
  dbConnexion = true;
  console.log("db connectée")
})
mongoose.connection.on('disconnected', function(){
  dbConnexion = false;
  console.log("db non connectée")
})

var rate = 48000;
var encoder = new opus.OpusEncoder( rate );

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name + " - " + guild.id)
        if(guild.id === "420824931312467979"){
          const channel = guild.channels.find('id', '422954735595814912');
          channel.send(`Dota Bot initialisé`)
        }
    })
    client.user.setActivity(`!db help pour obtenir de l'aide`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.registry
    // Registers your custom command groups
    .registerGroups([
        ['stats', 'Commandes de Stats'],
        ['fun', 'Commandes fun'],
        ['infos', 'Commandes pour avoir des infos par rapport à Dota'],
        ['test', 'Commandes de test'],
        ['pro', 'Commandes concernant le circuit pro de Dota']
    ])

    // Registers all built-in groups, commands, and argument types
    .registerDefaults()

    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'));


    client.on('error', console.error);

client.login(process.env.BOT_TOKEN);