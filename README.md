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

**Usage:**  
Access the `React Transcript Extractor` application through the web browser. 