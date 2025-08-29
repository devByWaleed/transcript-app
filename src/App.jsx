import { useState } from 'react';

function App() {

  // // States to manage url, transcript feetching, error & dynamic component rendering
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState({});
  const [error, setError] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [search, setSearch] = useState("");

  // New loading state -- true while fetching & translating
  const [loading, setLoading] = useState(false);

  // Save the source language of transcript
  const [sourceLanguage, setSourceLanguage] = useState('');

  // Store translation
  const [translation, setTranslation] = useState({});

  // State to show the translation, else will display original transcript
  const [showTranslation, setShowTranslation] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowTranscript(true);
    setLoading(true); // start loading here


    try {

      // Fetching transcript from backend
      const res = await fetch('http://127.0.0.1:5000/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),  // Send URL as JSON body
      });

      // Parse response as JSON
      const data = await res.json();

      if (!res.ok) {
        // if backend returns an error status
        setError(data.error || 'An error occurred.');
      } else {
        setTranscript(data.transcript);
      }

    } catch (err) {
      setError('An error occurred while fetching transcript.');
      console.log(err);
    } finally {
      setLoading(false); // stop loading once done or error
    }

  };


  const translate = async (text) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          source_lang: sourceLanguage,
          target_lang: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.translated_text || text; // Return original text if translation fails
    } catch (error) {
      console.log(`Error while fetching data!! ${error}`);
      return text; // Return original text on error
    }
  }


  const handleTranslation = async (e) => {
    e.preventDefault();

    if (Object.keys(transcript).length === 0) {
      setError('No transcript available to translate.');
      return;
    }

    setLoading(true);
    setError(''); // Clear previous errors

    try {
      const translatedEntries = await Promise.all(
        Object.entries(transcript).map(async ([timeStamp, text]) => {
          const translatedText = await translate(text);
          return [timeStamp, translatedText];
        })
      );

      setTranslation(Object.fromEntries(translatedEntries));
      setShowTranslation(true);
    } catch (error) {
      console.log("Error during translation:", error);
      setError('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  return (

    <>
      {/* Loading spinner + overlay container */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8"></div>
        </div>
      )}

      <main className={`flex flex-col gap-y-5 h-screen bg-slate-900 relative ${loading ? 'blur-sm' : ''}`} id="app">

        {showTranscript === false ? (
          <section className="flex flex-col gap-y-5 items-left justify-center p-10 m-auto lg:w-3/4
         bg-slate-400 shadow-[0_0_10px_5px_#e6eef0] rounded hover:shadow-[0_0_15px_10px_#e6eef0]">

            <h1 className="m-auto text-2xl text-slate-900 font-bold underline">Yt-Transcriptor Extractor</h1>

            <ol className="list-inside list-decimal text-gray-900">
              <li>Paste the Video URL below.</li>
              <li>Click the Fetch button.</li>
              <li>Get the transcript.</li>
              <li>Select the language from dropdown.</li>
              <li>Translate the transcript to your language.</li>
              <li>Use Search feature for looking specific part.</li>
            </ol>

            <form onSubmit={handleSubmit} className='flex flex-col gap-y-3'>


              <label htmlFor="video-link" className="font-large m-auto text-white">
                YouTube Video URL
              </label>

              <input
                name="video-link"
                type="url"
                className="text-sm rounded-lg block w-full p-2.5
              bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500  
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
              dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(event) => setUrl(event.target.value)}
                required
              />


              <button className="px-5 py-2 border-none rounded-lg font-bold cursor-pointer 
              text-black bg-sky-500 transition duration-300 ease-in-out 
                hover:transform hover:translate-x-2 hover:text-white hover:bg-sky-700" type='Submit'>Fetch</button>

            </form>

          </section>

        ) : (

          <section className='m-auto p-6 bg-gray-50 rounded-lg shadow-md flex flex-col gap-3 lg:w-3/4'>


            <h1 className="m-auto text-2xl text-slate-900 font-bold underline">Transcript Explorer: Search & Translate</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">


              <form className="flex gap-x-2" onSubmit={handleTranslation}>
                {/* <form className="flex gap-x-2"> */}

                <select
                  required
                  className="mb-3 sm:mb-0 px-4 py-2 cursor-pointer 
                border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                  onChange={(event) => setSourceLanguage(event.target.value)}
                >
                  <option >Choose Language</option>
                  <option value="hi">Hindi</option>
                  <option value="tr">Turkish</option>
                  <option value="ar">Arabic</option>
                </select>

                <button className='px-5 py-2 border-none rounded-lg font-bold cursor-pointer
              text-white bg-blue-800 hover:bg-blue-900' type='Submit'>Traslate To English</button>
              </form>

            </div>

            {/* <GoogleTranslateWidget /> */}

            <div className="bg-white rounded-lg shadow-inner flex flex-col gap-3 min-h-[250px]">
              <input
                type="search"
                placeholder="Search transcript..."
                aria-label="Search transcript"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearch(e.target.value)}
              />

              {error && <div className='text-red-700 border-2 border-amber-800 p-2 overflow-y-scroll'>{error}</div>}



              {showTranslation &&

                Object.keys(translation).length > 0 && (
                  <pre className="whitespace-pre-wrap text-sky-600 text-base overflow-y-auto max-h-64">

                    {Object.entries(translation).filter(([_, text]) =>
                      text.toLowerCase().includes(search.toLowerCase())
                    ).map(([timeStamp, text]) => (
                      <p key={timeStamp}>
                        <b className="text-blue-950">{timeStamp}</b> {text}
                      </p>
                    ))}


                  </pre>
                )

              }

              {!showTranslation &&
                Object.keys(transcript).length > 0 && (
                  <pre className="whitespace-pre-wrap text-sky-600 text-base overflow-y-auto max-h-64">

                    {Object.entries(transcript).filter(([_, text]) =>
                      text.toLowerCase().includes(search.toLowerCase())
                    ).map(([timeStamp, text]) => (
                      <p key={timeStamp}>
                        <b className="text-blue-950">{timeStamp}</b> {text}
                      </p>
                    ))}


                  </pre>
                )
              }
            </div>

          </section>
        )}

        <footer className="bg-gray-600 text-center p-5 text-white text-sm">
          <p>Made by <b className='text-gray-950'>Waleed</b> with 🤍 © 2025 All rights reserved</p>
        </footer>
      </main>
    </>
  );
}

export default App;
