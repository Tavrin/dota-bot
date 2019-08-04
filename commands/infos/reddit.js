const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const path = require('path');
const fetch = require('node-fetch');

module.exports = class RedditCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            group: 'infos',
            memberName: 'reddit',
            description: 'Montre les top posts reddit de r/DotA2 du moment',
            examples: ['!reddit'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            }
        });    
    }

     run(msg) {
         var redditList = []
        fetch(`https://www.reddit.com/r/DotA2.json`)
                    .then(res => res.json())
                     .then(function(json){
                     
                        // console.log(json.data.children[0].data.title)
                        for(var i = 0; i < 5; i++){
                            redditList[i] = {}
                            // console.log(json.data.children[i].data.title)
                            redditList[i].title = json.data.children[i].data.title
                            redditList[i].ups = json.data.children[i].data.ups
                            redditList[i].url = json.data.children[i].data.url
                        }
                        
                        if(redditList.length == 5){
                            console.log(redditList)
                            const embed  = new RichEmbed()
                            .setColor('#B72F19')
                            .setTitle("Top posts de r/DotA2 du moment")
                            .setURL(`https://www.reddit.com/r/DotA2/`)
                            .setAuthor(msg.author.username, msg.author.displayAvatarURL)
                            .addField(`:thumbsup: **${redditList[0].ups}**  -  `+redditList[0].title, redditList[0].url)
                            .addBlankField()
                            .addField(`:thumbsup: **${redditList[1].ups}**  -  `+redditList[1].title, redditList[1].url)
                            .addBlankField()
                            .addField(`:thumbsup: **${redditList[2].ups}**  -  `+redditList[2].title, redditList[2].url)
                            .addBlankField()
                            .addField(`:thumbsup: **${redditList[3].ups}**  -  `+redditList[3].title, redditList[3].url)
                            .addBlankField()
                            .addField(`:thumbsup: **${redditList[4].ups}**  -  `+redditList[4].title, redditList[4].url)
                            .setTimestamp();
                            msg.say(embed)
                        }
                        
                 })
                 .catch(err => console.error(err));


    }
};
       
