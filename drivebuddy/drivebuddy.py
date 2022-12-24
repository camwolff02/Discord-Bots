# https://discord.com/api/oauth2/authorize?client_id=1055543912586027018&permissions=8&scope=bot
import discord

class DriveBuddy(discord.Client):
    async def on_ready(self):
        print(f'Logged on as {self.user}')
        file_types = {'jpg', 'png', 'mov', 'mp4'}

    async def on_message(self, message):
        msg = message.content

        # don't respond to ourselves
        if message.author == self.user or not msg.startswith('*'):
            return

        if msg.startswith('*upload attached'):
            print('message seen')



intents = discord.Intents.default()
intents.message_content = True 

bot = DriveBuddy(intents=intents)

with open('secret_token.txt', 'r') as token:
    bot.run(token.read()) 

