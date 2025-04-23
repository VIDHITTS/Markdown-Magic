import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [htmlcode, sethtmlcode] = useState("<h1>Hello World!</h1>");
  const [csscode, setcsscode] = useState("h1{color:#00ff00}");
  const [jscode, setjscode] = useState('console.log("Hello from JS")');
  const [tab, settab] = useState("html");
  const [consoledata, setconsoledata] = useState([]);
  const [show, setconsole] = useState(false);
  const [dark, setdarktheme] = useState(true);
  const [showonlypreview, setshowpreview] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data.type === "console") {
        setconsoledata((prevData) => {
          const message = e.data.args.join(" ");
          return [...prevData, message];
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const usercode = `<html>
    <head><style>${csscode}</style></head>
    <body>${htmlcode}
      <script>
        const _log=console.log
        console.log=(...a)=>{_log(...a);parent.postMessage({type:'console',args:a},'*')}
        try{${jscode}}catch(e){console.log('Error:',e.message)}
      </script>
    </body>
    </html>`;

  const value = tab === "html" ? htmlcode : tab === "css" ? csscode : jscode;

  const onChange = (e) => {
    if (tab === "html") sethtmlcode(e.target.value);
    else if (tab === "css") setcsscode(e.target.value);
    else setjscode(e.target.value);
  };

  const buttonMargin = {
    marginLeft: !showonlypreview ? "565px" : "500px",
  };

  return (
    <div className="markdown-magic">
      <header className="magic-heading">
        <div>
          <h1>CODE EDITOR</h1>
          <p>Write and preview HTML, CSS, and JavaScript code in real-time</p>
        </div>
        <button
          className="only-button"
          style={buttonMargin}
          onClick={() => setshowpreview((s) => !s)}
        >
          {showonlypreview ? "SHOW EDITOR AND PREVIEW" : "SHOW ONLY PREVIEW"}
        </button>
        <button className="darkmagic" onClick={() => setdarktheme((d) => !d)}>
          {dark ? "☀️ LIGHT MODE" : "🌙 DARK MODE"}
        </button>
      </header>

      {showonlypreview ? (
        <div className="magic-output preview-only">
          <div className="magic-output-heading">
            <span>LIVE PREVIEW</span>
            <button
              className="console-button"
              onClick={() => setconsole((s) => !s)}
            >
              {show ? "HIDE CONSOLE" : "SHOW CONSOLE"}
            </button>
          </div>
          <iframe srcDoc={usercode} className="previewonlyframe" />
          {show && (
            <div className="magic-console">
              <div className="console-heading">
                CONSOLE OUTPUT
                <button
                  className="magic-clear"
                  onClick={() => setconsoledata([])}
                >
                  CLEAR
                </button>
              </div>
              <div className="magic-console-output">
                {consoledata.map((l, i) => (
                  <div key={i} className="magic-line">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="main-magic">
          <div className="user-magic">
            <div className="option-bar">
              {["html", "css", "js"].map((t) => (
                <button
                  key={t}
                  className={tab === t ? "active" : ""}
                  onClick={() => settab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              className="user-area"
              value={value}
              onChange={onChange}
              placeholder={`Enter ${tab} here...`}
              spellCheck="false"
            />
          </div>

          <div className="magic-output">
            <div className="magic-output-heading">
              <span>LIVE PREVIEW</span>
              <button
                className="console-button"
                onClick={() => setconsole((s) => !s)}
              >
                {show ? "HIDE CONSOLE" : "SHOW CONSOLE"}
              </button>
            </div>
            <iframe srcDoc={usercode} />
            {show && (
              <div className="magic-console">
                <div className="console-heading">
                  CONSOLE OUTPUT
                  <button
                    className="magic-clear"
                    onClick={() => setconsoledata([])}
                  >
                    CLEAR
                  </button>
                </div>
                <div className="magic-console-output">
                  {consoledata.map((l, i) => (
                    <div key={i} className="magic-line">
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}