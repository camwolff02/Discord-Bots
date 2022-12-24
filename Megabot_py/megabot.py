from googlesearch import search
import discord
import logging

# specify bot privledges
intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)

# logging data to discord.log folder
logger = logging.getLogger('discord')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')
handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
logger.addHandler(handler)
    
class Megabot(discord.Client):
    @client.event
    async def on_ready(self):
        print('Logged on as', self.user)

    @client.event
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

if __name__ == '__main__':
    client = Megabot()
    client.run('6dea79aab77e8f3f86d572376a514c5ced7794ad5b6779378e0f1c16f764ff5c') 