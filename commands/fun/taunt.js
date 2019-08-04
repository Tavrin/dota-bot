const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const path = require('path');
const prism = require('prism-media');
const fs = require('fs');
const fetch = require('node-fetch');

const db = require('../../models')

module.exports = class TauntCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'taunt',
            group: 'fun',
            memberName: 'taunt',
            description: 'taunts vocaux',
            examples: ['**sons :** (pour mentionner un channel vocal il faut suivre le format suivant : !db taunt **son** <#**id du channel**>) ','arc1','arc-laugh','og-laugh','welcome','music'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            },
            args: [
                {
                    key: 'son',
                    prompt: `pas d'action mentionnée`,
                    type: "string",
                    default: ""
                    
                },
                {
                    key:'id du channel',
                    prompt:`pas d'ID mentionnée`,
                    type: "string",
                    default: ""
                }
            ]
        });    
    }

     run(msg, { son, id }) {
        var isNum =  /^\d+$/.test(son)
        if (son == "" && id == ""){
            return msg.say(`Pas d'action donnée`)
        }

        else if(son == "arc1"){

            transcodeAudio(msg,"arc1")
        }

        else if(son == "arc-laugh"){

            transcodeAudio(msg,"arc-laugh")
        }
        else if(son == "og-laugh"){

            transcodeAudio(msg,"og-laugh")
        }
        else if(son == "music"){

            transcodeAudio(msg,"stanley-music")
        }
        else if(son == "welcome"){

            transcodeAudio(msg,"stanley-welcome")
        }

        else if(isNum === true){
            return   msg.say("Il faut donner une action avant l'ID")
        }
        else{
            return   msg.say("Mauvais arguments donnés")
        }
    }
};





//FONCTIONS


function transcodeAudio(msg,file){

    const input = fs.createReadStream(__dirname+ `/../../public/sound/${file}.mp3`);

                    const transcoder = new prism.FFmpeg({
                        args: [
                          '-analyzeduration', '0',
                          '-loglevel', '0',
                          '-f', 's16le',
                          '-ar', '48000',
                          '-ac', '2',
                        ],
                      });
                      
                      const opus = new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 });
                      input
                      .pipe(transcoder)
                      .pipe(opus);

    voiceDeliver(msg,opus)
}

function voiceDeliver(msg,opus){
    if (msg.mentions.channels.first()){
        console.log(msg.mentions.channels.first())

            
            const voiceChannel  = msg.mentions.channels.first();

        // if (!voiceChannel) {
        //     return msg.say(`ceci n'est pas un channel vocal`);
        // }

        voiceChannel.join().then(connection => {
            if(connection.speaking === true){
                return msg.say("Le bot est déjà en cours d'utilisation")
            }
            const dispatcher = connection.playOpusStream(opus);

        dispatcher.on('end', () => voiceChannel.leave());

        });

        

    }
    else{
        const { voiceChannel } = msg.member;
    if (!voiceChannel) {
        return msg.say('Il faut rejoindre un chan vocal !');
    }

    voiceChannel.join()
    .then(connection => {

        if(connection.speaking === true){
            return msg.say("Le bot est déjà en cours d'utilisation")
        }
        const dispatcher = connection.playOpusStream(opus);

        dispatcher.on('end', () => voiceChannel.leave());

    })
    .catch(console.error);
    
    // return msg.say("test sans ID")

    }



}