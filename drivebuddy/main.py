import cv2 as cv
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive


gauth = GoogleAuth()
drive = GoogleDrive(gauth)

upload_file = 'mozart.PNG'
gfile = drive.CreateFile({'parents': [{'id': '1aDZAyqlj_fQB532EW6NlnzdT9dJdnE7Y'}]})

# Read file and set it as the content of this instance.
gfile.SetContentFile(upload_file)
gfile.Upload() # Upload the file.
