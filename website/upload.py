import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os

load_dotenv()

# Configuration       
cloudinary.config( 
    cloud_name = "dqaycvt6i", 
    api_key = "785918277914528", 
    api_secret = os.getenv('CLOUDINARY_API_KEY'),
    secure=True
)

def uploadFile(filePath, filename):
    # Upload an image
    upload_result = cloudinary.uploader.upload(filePath,
                                            public_id=filename)
    return upload_result["secure_url"]