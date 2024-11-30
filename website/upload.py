import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename

load_dotenv()

# Configuration       
cloudinary.config( 
    cloud_name = os.getenv('CLOUD_NAME'), 
    api_key = os.getenv('API_SECRET'), 
    api_secret = os.getenv('CLOUDINARY_API_KEY'),
    secure=os.getenv('SECURE')
)

def uploadPhoto(file, id):
    fileUrl = uploadFile(file, id)
        
    return fileUrl

def uploadFile(filePath, filename):
    upload_result = cloudinary.uploader.upload(filePath,
                                            public_id=filename)
    return upload_result["secure_url"]