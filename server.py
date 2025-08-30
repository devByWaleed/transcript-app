# Importing necessary libraries
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import re
import requests
import os


'''
Creating Flask App
Bundled with React static website
'''
app = Flask(
    __name__,
    static_folder="./dist",      # path to your built React files
    static_url_path="/"
)
CORS(app, resources={r"/api/*": {"origins": "*"}})


'''
# Creating a flask app (Separate Frontend & Backend)
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
'''


# Fetch video id from yt video url
def id_extractor(url):

    # video = pafy.new(url)

    # Regex pattern to match YouTube video ID
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"

    matched = re.search(pattern, url)

    if matched:
        return matched.group(1)
    return None


# Converting time into timestamps
def format_timestamp(seconds):
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))


# Creating an api for sending  fetching 
@app.route('/api/transcript', methods=['POST'])
def get_transcript():

    language_codes = [
    "af",  # Afrikaans
    "am",  # Amharic
    "ar",  # Arabic
    "az",  # Azerbaijani
    "be",  # Belarusian
    "bg",  # Bulgarian
    "bn",  # Bengali
    "bs",  # Bosnian
    "ca",  # Catalan
    "ceb", # Cebuano
    "co",  # Corsican
    "cs",  # Czech
    "cy",  # Welsh
    "da",  # Danish
    "de",  # German
    "el",  # Greek
    "en",  # English
    "eo",  # Esperanto
    "es",  # Spanish
    "et",  # Estonian
    "eu",  # Basque
    "fa",  # Persian
    "fi",  # Finnish
    "fr",  # French
    "fy",  # Frisian
    "ga",  # Irish
    "gd",  # Scottish Gaelic
    "gl",  # Galician
    "gu",  # Gujarati
    "ha",  # Hausa
    "haw", # Hawaiian
    "he",  # Hebrew
    "hi",  # Hindi
    "hmn", # Hmong
    "hr",  # Croatian
    "ht",  # Haitian Creole
    "hu",  # Hungarian
    "hy",  # Armenian
    "id",  # Indonesian
    "ig",  # Igbo
    "is",  # Icelandic
    "it",  # Italian
    "ja",  # Japanese
    "jv",  # Javanese
    "ka",  # Georgian
    "kk",  # Kazakh
    "km",  # Khmer
    "kn",  # Kannada
    "ko",  # Korean
    "ku",  # Kurdish (Kurmanji)
    "ky",  # Kyrgyz
    "la",  # Latin
    "lb",  # Luxembourgish
    "lo",  # Lao
    "lt",  # Lithuanian
    "lv",  # Latvian
    "mg",  # Malagasy
    "mi",  # Maori
    "mk",  # Macedonian
    "ml",  # Malayalam
    "mn",  # Mongolian
    "mr",  # Marathi
    "ms",  # Malay
    "mt",  # Maltese
    "my",  # Myanmar (Burmese)
    "ne",  # Nepali
    "nl",  # Dutch
    "no",  # Norwegian
    "ny",  # Chichewa
    "or",  # Odia
    "pa",  # Punjabi
    "pl",  # Polish
    "ps",  # Pashto
    "pt",  # Portuguese
    "ro",  # Romanian
    "ru",  # Russian
    "rw",  # Kinyarwanda
    "sd",  # Sindhi
    "si",  # Sinhala
    "sk",  # Slovak
    "sl",  # Slovenian
    "sm",  # Samoan
    "sn",  # Shona
    "so",  # Somali
    "sq",  # Albanian
    "sr",  # Serbian
    "st",  # Sesotho
    "su",  # Sundanese
    "sv",  # Swedish
    "sw",  # Swahili
    "ta",  # Tamil
    "te",  # Telugu
    "tg",  # Tajik
    "th",  # Thai
    "tk",  # Turkmen
    "tl",  # Tagalog
    "tr",  # Turkish
    "tt",  # Tatar
    "ug",  # Uyghur
    "uk",  # Ukrainian
    "ur",  # Urdu
    "uz",  # Uzbek
    "vi",  # Vietnamese
    "xh",  # Xhosa
    "yi",  # Yiddish
    "yo",  # Yoruba
    "zh",  # Chinese (Simplified)
    "zh-TW", # Chinese (Traditional)
    "zu"   # Zulu
]

    # Get url from frontend
    data = request.get_json()
    url = data.get('url', '')

    # Get video id
    video_id = id_extractor(url)

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=language_codes)

        transcript_obj = {}     # Save trasncript to object

        for entry in transcript:
            timestamp = format_timestamp(entry['start'])
            transcript_obj[timestamp] = entry['text']

        return jsonify({
            "transcript": transcript_obj
        })      # Sending the data to backend

    # Handling Errors
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Translation endpoint to proxy external API
@app.route('/api/translate', methods=['POST'])
def translate_text():
    
    # Get data from frontend
    data = request.get_json()
    text = data.get('text', '')
    source_lang = data.get('source_lang', 'auto')
    target_lang = data.get('target_lang', 'en')
    
    try:
        # Make request to external translation API
        response = requests.get(
            f"https://ftapi.pythonanywhere.com/translate?sl={source_lang}&dl={target_lang}&text={text}"
        )
        
        if response.status_code == 200:
            translation_data = response.json()
            return jsonify({
                "translated_text": translation_data.get('destination-text', text)
            })
        else:
            return jsonify({"error": "Translation service unavailable"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ---------------- FRONTEND ROUTE ---------------- #
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Always return index.html for root or unknown routes
        return send_from_directory(app.static_folder, "index.html")



# Create host for flask app
if __name__ == '__main__':
    app.run()