const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const Discord = require('discord.js');
const path = require('path');
const Canvas = require('canvas');
var Crawler = require("crawler");
const fs = require('fs');
const fetch = require('node-fetch');

const db = require('../../models')




module.exports = class PrizepoolCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prizepool',
            group: 'pro',
            memberName: 'prizepool',
            description: 'classement des équipes',
            examples: ['dpc ranking'],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            }
        });    
    }

     run(msg, { action, id }) {
        // if(action == "ranking"){
            scrapePrizepool(msg)
        // }
       
    }
};


//FONCTIONS



function scrapePrizepool(msg){
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
        uri: 'http://dota2.prizetrac.kr/international2019',
        jQuery: true,
     
        // The global callback won't be called
        callback: function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$

                var prize = $('.ui.green.header').text();

            }
            done();
           return  msg.say(`le Prizepool de TI9 est de : **${prize}**`)
        }
    }]);

}





