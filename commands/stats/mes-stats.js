const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const path = require('path');
const heros = require('../../config/heros.json')
const fetch = require('node-fetch');
const Canvas = require('canvas');
const db = require('../../models')

module.exports = class MesStatsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mes-stats',
            group: 'stats',
            memberName: 'mes-stats',
            description: 'profil dotabuff',
            examples: ['mes-stats associer'],
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
                    prompt:`pas d'ID steam mentionnée`,
                    type: "string",
                    default: ""
                }
            ]
        });    
    }

     run(msg, { action, id }) {
        var isNum =  /^\d+$/.test(action)
        if (action == "" && id == ""){
            console.log(msg.author.avatarURL)
            db.User.findOne({userId: msg.author.id}, function(err, user){
                console.log(user)
                if(!user || user == null ){
                
                 db.User.create({userId:msg.author.id, username: msg.author.username, steamId: id, avatar: msg.author.avatarURL},function(err,user){
                    if(err){
                        console.log(err);
                    }
                    console.log(user)
                    return   msg.say("Ajout de l'utilisateur en base de donnée")
                })
                 
                }
                else if((user || user != null) && (!user.steamId || user.steamId == null || user.steamId == undefined)){
                    console.log('bug : ' + user)
                    return msg.say("Aucune ID Steam n'a été associée")
                }
                else if(user || user != null || user.steamId){
                    fetchProfile(msg,user.steamId)
                }
                
                if(err){
                    console.log(err)
                }
            })
            .catch(function(err){
                console.log(err)
            })
        }

        else if(action == "associer"){
            if (id == ""){
                return msg.say(`Il faut donner une ID dota a associer`)
            }
            db.User.findOneAndUpdate({userId: msg.author.id}, {steamId: id},  {new: true}, function(err, user){
                console.log(user)
                if(!user || user == null || user == undefined){
                
                 db.User.create({userId:msg.author.id, username: msg.author.username, steamId: id, avatar: msg.author.avatarURL},function(err,user){
                    if(err){
                        console.log(err);
                    }
                    console.log(user)
                    return   msg.say("Ajout de l'utilisateur en base de donnée")
                })
                 
                }
                else if(err){
                    console.log(err)
                }
                else{
                    console.log(user)
                    return   msg.say("Utilisateur mis à jour : https://www.dotabuff.com/players/" + user.steamId)
                }
                
            })
            
        }
        else if(action == "dissocier"){

            db.User.findOneAndUpdate({userId: msg.author.id}, {steamId: undefined},  {new: true}, function(err, user){
                console.log(user)
                if(!user){
                
                 db.User.create({userId:msg.author.id, username: msg.author.username, steamId: id, avatar: msg.author.avatarURL},function(err,user){
                    if(err){
                        console.log(err);
                    }
                    console.log(user)
                    return   msg.say("Ajout de l'utilisateur en base de donnée")
                })
                 
                }
                if(err){
                    console.log(err)
                }
                return   msg.say("Utilisateur mis à jour : steamId = " +user.steamId )
            })

        }
        else if(isNum === true){
            return   msg.say("Il faut donner une action avant l'ID")
        }
        else{
            return   msg.say("Mauvais arguments donnés")
        }
    }
};
       
        function associateHero(arr){
            for(a = 0; a< arr.length; a++){
                for(i = 0; i < heros.length; i++){
                    if (heros[i].id==arr[a].hero_id){
                        arr[a].heroWinrate = parseInt((arr[a].win /arr[a].games) * 100)
                        arr[a].heroName = heros[i].localized_name
                    }
                }
            }
           return arr
        }
        function compare(a,b) {
            if (a.matchCount < b.matchCount)
              return 1;
            if (a.matchCount > b.matchCount)
              return -1;
            return 0;
          }
        
          function fetchProfile(msg,id){
            console.log("test")
            fetch(`https://api.opendota.com/api/players/${id}`)
                 
            .then(res => res.json())
            .then(function(json){
                console.log(json)
               let profile = json;
            fetch(`https://api.opendota.com/api/players/${id}/wl`)
            .then(res => res.json())
                .then(function(json){
                    var winrate = (json.win /(json.win + json.lose) ) * 100
                    winrate = winrate.toFixed(2)
                    console.log("winrate " + winrate)
                    fetch(`https://api.opendota.com/api/players/${id}/heroes`)
                    .then(res => res.json())
                     .then(function(json){
                     
                    
                      
                    // var sorted = json.sort(compare);
                    var heroData = associateHero(json.slice(0,6))
                    console.log(heroData)
                    createImage(profile,heroData,winrate,msg)
             
          
                 })
                 .catch(err => console.error(err));


                })
               
            
             
           })
            .catch(err => console.error(err));
          }
        
          async function createImage(profile,heroData,winrate,msg,err){
              console.log("test")
              console.log(profile)
            if(profile.steamId == 27592450){
                profile.name = "Ahh le Roquet"
            }
            // let winrate = parseInt((profile.winCount/profile.matchCount) * 100)
        
            const canvas = Canvas.createCanvas(800, 800);
            const ctx = canvas.getContext('2d');
        
            const background = await Canvas.loadImage(path.join(__dirname,`../../public/img/profil-template1.png`));
            const rank = await Canvas.loadImage(path.join(__dirname,`../../public/img/rank/${profile.rank_tier}.png`));
            
          
        console.log(profile.rank_tier)
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(rank,670,18, 120, 120);
            let buffer = profile.profile.avatarfull;
            console.log(profile.profile.avatarfull)
                // Select the font size and type from one of the natively available fonts
            ctx.font = '30px sans-serif';
            // Select the style that will be used to fill the text in
            ctx.fillStyle = '#ffffff';
            // Actually fill the text with a solid color
            
            
            const avatar = await  Canvas.loadImage(buffer);
            console.log(avatar)
            
            // Move the image downwards vertically and constrain its height to 200, so it's a square
            ctx.drawImage(avatar, 25, 25, 100, 100);
            ctx.fillText(profile.profile.personaname, 135, 55);
            ctx.fillText(`Winrate`, 535, 55);
            ctx.fillText(`${winrate}%`, 535, 95);
            ctx.fillText(`Héros les plus joués`, 25, 190);
            ctx.font = '20px sans-serif';
            ctx.fillText(heroData[0].heroName, 55, 230);
            ctx.fillText(heroData[1].heroName, 335, 230);
            ctx.fillText(heroData[2].heroName, 625, 230);
            ctx.fillText(heroData[3].heroName, 55, 330);
            ctx.fillText(heroData[4].heroName, 335, 330);
            ctx.fillText(heroData[5].heroName, 625, 330);
        
            ctx.font = '15px sans-serif';
            ctx.fillStyle = '#e8e8e8';
        
            ctx.fillText(`Matchs totaux : ${heroData[0].games}`, 55, 250);
            ctx.fillText(`Matchs totaux : ${heroData[1].games}`, 335, 250);
            ctx.fillText(`Matchs totaux : ${heroData[2].games}`, 625, 250);
            ctx.fillText(`Matchs totaux : ${heroData[3].games}`, 55, 350);
            ctx.fillText(`Matchs totaux : ${heroData[4].games}`, 335, 350);
            ctx.fillText(`Matchs totaux : ${heroData[5].games}`, 625, 350);
        
            ctx.fillText(`Winrate : ${heroData[0].heroWinrate}%`, 55, 270);
            ctx.fillText(`Winrate : ${heroData[1].heroWinrate}%`, 335, 270);
            ctx.fillText(`Winrate : ${heroData[2].heroWinrate}%`, 625, 270);
            ctx.fillText(`Winrate : ${heroData[3].heroWinrate}%`, 55, 370);
            ctx.fillText(`Winrate : ${heroData[4].heroWinrate}%`, 335, 370);
            ctx.fillText(`Winrate : ${heroData[5].heroWinrate}%`, 625, 370);
            const attach = new Discord.Attachment(canvas.toBuffer(), 'profil-dota.png');
        
            const embed  = new RichEmbed()
               .setColor('#EFFF00')
               .setTitle(profile.profile.personaname)
               .setURL(`https://www.opendota.com/players/${profile.profile.account_id}`)
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
            // msg.say(`profil de : ${profile.name}`, attachment);
            if(err){
                console.log(err)
            }
          }
       
        