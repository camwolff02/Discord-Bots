import cv2
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

# Google Authentification
gauth = GoogleAuth()
gauth.LocalWebserverAuth() # Creates local webserver and auto handles authentication.

# Create GoogleDrive instance with authenticated GoogleAuth instance.
drive = GoogleDrive(gauth)

# create file and identify content
upload_file = '../test/mozart.PNG'
gfile = drive.CreateFile({
    'parents': [{'id': '1aDZAyqlj_fQB532EW6NlnzdT9dJdnE7Y'}],  # specify folder
    'title': 'CustomeFilename.png'  # specify filename
})

# Read file and set it as the content of this instance.
gfile.SetContentFile(upload_file)
gfile.Upload() # Upload the file.
print('Upload successful.')
