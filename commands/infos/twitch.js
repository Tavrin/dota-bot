const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const path = require('path');
const fetch = require('node-fetch');

module.exports = class TwitchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'twitch',
            group: 'infos',
            memberName: 'twitch',
            description: 'Montre les top streams de Dota 2 sur Twitch',
            examples: ['!twitch'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            }
        });    
    }

     run(msg) {
         var twitchList = []
         var dotaId = "29595"
         var url = "https://api.twitch.tv/helix/streams?game_id=29595&first=6"
        fetch(url,{method: 'GET',
                    headers: {"Client-ID": process.env.TWITCH_ID}
                    })
                    .then(res => res.json())
                     .then(function(json){
                     

                        console.log(json)
                        for(var i = 0; i < 6; i++){
                            twitchList[i] = {}
                            // console.log(json.data.children[i].data.title)
                            twitchList[i].user_name = json.data[i].user_name
                            twitchList[i].title = json.data[i].title
                            twitchList[i].url = `https://www.twitch.tv/${json.data[i].user_name}`
                            twitchList[i].thumbnail = json.data[i].thumbnail_url
                        }
                        
                        if(twitchList.length == 6){
                            const embed  = new RichEmbed()
                            .setColor('#4B367C')
                            .setTitle("Top streams Twitch de Dota 2")
                            .setURL(`https://www.twitch.tv/directory/game/Dota%202`)
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL)
                            .addBlankField()
                            .addField(`**${twitchList[0].user_name}**  -  `+twitchList[0].title, twitchList[0].url)
                            .addBlankField()
                            .addField(`**${twitchList[1].user_name}**  -  `+twitchList[1].title, twitchList[1].url)
                            .addBlankField()
                            .addField(`**${twitchList[2].user_name}**  -  `+twitchList[2].title, twitchList[2].url)
                            .addBlankField()
                            .addField(`**${twitchList[3].user_name}**  -  `+twitchList[3].title, twitchList[3].url)
                            .addBlankField()
                            .addField(`**${twitchList[4].user_name}**  -  `+twitchList[4].title, twitchList[4].url)
                            .addBlankField()
                            .addField(`**${twitchList[5].user_name}**  -  `+twitchList[5].title, twitchList[5].url)
                            .setTimestamp();
                            msg.say(embed)
                        }
                        
                 })
                 .catch(err => console.error(err));


    }
};
       
