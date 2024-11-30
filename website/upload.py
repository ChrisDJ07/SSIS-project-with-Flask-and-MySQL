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

def uploadFile(filePath, filename):
    # Upload an image
    upload_result = cloudinary.uploader.upload(filePath,
                                            public_id=filename)
    return upload_result["secure_url"]

def uploadPhoto(file, id):
    UPLOAD_FOLDER = 'C:/Users/ASUS/Documents/- COLLEGE -/3rd Year/CCC181 - Application Development and Emerging Technologies/SSIS - Flask/Janiola_SSIS using Flask/website/static/temp-images'
    filename = secure_filename(file.filename)
    # save file
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    # upload file
    fileUrl = uploadFile(f"{UPLOAD_FOLDER}/{filename}", id)
    # remove file
    os.remove(os.path.join(UPLOAD_FOLDER, filename))
        
    return fileUrl