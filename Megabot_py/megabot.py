from googlesearch import search
import discord
import logging

# logging data to discord.log folder
logger = logging.getLogger('discord')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')
handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
logger.addHandler(handler)

class Megabot(discord.Client):
    async def on_ready(self):
        print('Logged on as', self.user)

    async def on_message(self, message):
        msg = message.content

        # don't respond to ourselves
        if message.author == self.user or not msg.startswith('*'):
            return

        if msg == "*help":
            await message.channel.send('Commands:\n*find `x` based on `y`')

        # !find ____ from _____ ex. !find harry potter house from favorite food
        if msg.startswith('*find'):
            if msg.find('based on') != -1:
                lhs, rhs = msg[5:].split('based on', 1)
                query = "which " + lhs + " are you based on your " + rhs
            else:
                query = msg[5:]

            for q in search(query, tld="co.in", num=1, stop=1, pause=2):
                await message.channel.send(q)

client = Megabot()
client.run('NTgzNzQzODg1MDQyNTE2MDAx.XPA0Fw.IpYNTkIKbYQuTETFu7SehwJS2zg') 