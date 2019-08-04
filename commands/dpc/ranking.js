const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const path = require('path');
const Canvas = require('canvas');
var Crawler = require("crawler");
const fs = require('fs');
const fetch = require('node-fetch');

const db = require('../../models')




module.exports = class RankingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dpc',
            group: 'pro',
            memberName: 'dpc',
            description: 'classement des équipes',
            examples: ['dpc ranking'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'action',
                    prompt: `pas d'action mentionnée`,
                    type: "string",
                    default: ""
                    
                },
                {
                    key:'id',
                    prompt:`pas d'ID mentionnée`,
                    type: "string",
                    default: ""
                }
            ]
        });    
    }

     run(msg, { action, id }) {
        if(action == "ranking"){
            scrapeLiquipedia(msg)
        }
       
    }
};


//FONCTIONS



function scrapeLiquipedia(msg){
    let teams = []

    var c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                console.log($("title").text());
            }
            done();
        }
    });

   c.queue([{
        uri: 'https://liquipedia.net/dota2/Dota_Pro_Circuit/2018-19/Rankings',
        jQuery: true,
     
        // The global callback won't be called
        callback: function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$

                // console.log($('.wikitable tbody tr').slice(13).text())

                $('.wikitable tbody tr').slice(13).each(function(index,element){
                    teams[index] = {}
                    var rank = $(element).find('td').eq(0).find('b').eq(0).text();
                    // console.log(rank)
                    teams[index]['rank'] = rank;
                   var team = $(element).find('span.team-template-text').text()
                    // console.log(team)
                    teams[index]['team'] = team;
                   var score = $(element).find('td').eq(2).find('b').eq(0).text()
                //    console.log(score)
                   teams[index]['score'] = score;
                });
                
            }
            done();
            embedResult(msg,teams,"Ranking")
        }
    }]);

}

async function embedResult(msg,data,title){

    const canvas = Canvas.createCanvas(800, 800);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(path.join(__dirname,`../../public/img/template-ranking1.png`));
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = '25px sans-serif';
  // Select the style that will be used to fill the text in
  ctx.fillStyle = '#ffffff';
  let y = 45;
  for (i = 0; i < data.length; i++){
       console.log(data[i])
       ctx.fillText(data[i].rank, 95, y); 
    ctx.fillText(data[i].team, 185, y);
    ctx.fillText(data[i].score, 475, y);  
    y += 38;
  }

  const attach = new Discord.Attachment(canvas.toBuffer(), 'profil-dota.png');

  const embed  = new RichEmbed()
  .setColor('#EFFF00')
  .setTitle(title)
  .setURL(`https://liquipedia.net/dota2/Dota_Pro_Circuit/2018-19/Rankings`)
  .setAuthor(msg.author.username, msg.author.displayAvatarURL)
  .setImage(`attachment://${attach.file.name}`)
  .setTimestamp();
console.log(attach.file.attachment)
  msg.say({
              embed,
              files: [{
                  attachment: attach.file.attachment,
               name:attach.file.name
  }]
})


}



