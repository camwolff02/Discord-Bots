# https://discord.com/api/oauth2/authorize?client_id=1055543912586027018&permissions=8&scope=bot
import cv2
import discord
from discord import app_commands
import os

from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive



data_path = os.path.join(os.path.dirname(__file__), '..', 'data')
test_path = os.path.join(os.path.dirname(__file__), '..', 'test')

class DriveBuddy(discord.Client):
    def __init__(self):
        super().__init__()
        self.synced = False  # use so bot doesn't sync commands more than once

    async def on_ready(self):
        await self.wait_until_ready()

        file_types = {'jpg', 'png', 'mov', 'mp4'}

        # Google Authentification
        gauth = GoogleAuth()
        gauth.LocalWebserverAuth() # Creates local webserver and auto handles authentication.

        # Create GoogleDrive instance with authenticated GoogleAuth instance.
        self.drive = GoogleDrive(gauth)

        print(f'Logged on as {self.user}')

    async def on_message(self, message):
        msg_content = message.content

        # don't respond to ourselves
        if message.author == self.user or not msg_content.startswith('*'):
            return

        if msg_content.startswith('*'):
            # create file and identify content
            gfile = self.drive.CreateFile({
                'parents': [{'id': '1aDZAyqlj_fQB532EW6NlnzdT9dJdnE7Y'}],  # specify folder
                'title': 'CustomeFilename.png'  # specify filename
            })

            # Read file and set it as the content of this instance.
            upload_file = os.path.join(test_path, 'mozart.PNG')
            gfile.SetContentFile(upload_file)
            gfile.Upload() # Upload the file.

            await message.channel.send('File uploaded successfully ✅')
            print('file uploaded successfully')

    async def upload_file(self, ):
        gfile = self.drive.CreateFile({
            'parents': [{'id': '1aDZAyqlj_fQB532EW6NlnzdT9dJdnE7Y'}],  # specify folder
            'title': 'CustomeFilename.png'  # specify filename
        })

def main():
    intents = discord.Intents.default()
    intents.message_content = True 

    bot = DriveBuddy(intents=intents)

    with open(os.path.join(data_path, 'secret_token.txt')) as token:
        bot.run(token.read()) 

if __name__ == '__main__':
    main()

