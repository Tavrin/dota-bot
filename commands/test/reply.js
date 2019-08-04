const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reply',
            group: 'test',
            memberName: 'reply',
            description: 'Répond avec un message',
            examples: ['reply'],
            guildOnly: true
        });
    }
    run(msg) {
        return msg.say('Hi, I\'m awake!');
    }
};