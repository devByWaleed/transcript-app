# 🎙️ Transcript Translator App

## **Overview**

A simple React-based app that:
- Accepts a youtube video url
- Fetch its transcript (`time-stamped based`).


## 🚀 Features
- Fetches transcript by entering `yt video URL`.
- Displays `trasncript` with `timestamps`.
- Choose **source language** (e.g., `ur`, `hi`, `fr`, etc.).
- Translates text into **English** using a `translation API` for better searching.
- **Search** feature to search for specific word in video.


## 🛠️ Tech Stack
- **React (Vite)**
- **JavaScript (ES6+)**
- **Fetch API:** For displaying transcript & translation in frontend.
- **Flask Backend** for data fetching.
    - *youtube_transcript_api* for fetching `transcript`
    - *API request* for `translation`


## **Tailwind CSS Specifications**
- **Colors**: Applied different color combinations for attractiveness.
- **Font Size & colors**: Applied different font sizes and colors.
- **Loader Animation**: Appears during **fetching transcript** and **translation**, indicating fetching is in progress.


## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## **Usage:**  
Follow the steps to setup app locally (React+Flask Bundled):

1. Clone the repository
2. Install necessary packages
    ```
    pip install flask

    pip install youtube-transcript-api

    pip install requests

    pip install flask-cors
    ```


3. On terminal, run the python file by following command
    ```
    python server.py
    ```
   > Your website will live at **http://127.1.1.0:5000** 
   > If you make any changesin local setup, make sure you build static website by running following commmand
    ```
    npm run build
    ```

---

## **Usage:**  
Follow the steps to setup app locally (React & Flask Separated):

1. Open `server.py` file, remove this block of code
```py
# ---------------- FRONTEND ROUTE ---------------- #
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Always return index.html for root or unknown routes
        return send_from_directory(app.static_folder, "index.html")
```
> Also remove `send_from_directory` from 1st line.

2. `Un-comment` this section
```py
'''
# Creating a flask app (Separate Frontend & Backend)
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
'''
```


3. `Comment / Remove` this section
```py
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
```
> Make sure your dist folder is on root directory, otherwise you have to change `static_folder="./dist"` path.


4. Open 2 terminals. On 1st terminal, run following command
```
npm run dev
```


5. On 2nd terminal, run python file
```
python server.py
```

> Now your app will live at **http://localhost:5173**. Make sure your python file runs, otherwise you will not get transcript.