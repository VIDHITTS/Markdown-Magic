"use client";
import React, { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import "./App.css";
import Header from "./components/Header.jsx";
import Selector from "./components/Selector.jsx";
import UserEditor from "./components/UserEditor.jsx";
import Output from "./components/Output.jsx";

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
        setconsoledata((prev) => {
          const message = e.data.args.join(" ");
          return [...prev, message];
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

  return (
    <div className="markdown-magic">
      <Header
        dark={dark}
        setdarktheme={setdarktheme}
        showonlypreview={showonlypreview}
        setshowpreview={setshowpreview}
      />

      {showonlypreview ? (
        <Output
          usercode={usercode}
          show={show}
          setconsole={setconsole}
          consoledata={consoledata}
          setconsoledata={setconsoledata}
        />
      ) : (
        <div className="main-magic">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <div className="user-magic">
                <Selector tab={tab} settab={settab} />
                <UserEditor tab={tab} value={value} onChange={onChange} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <Output
                usercode={usercode}
                show={show}
                setconsole={setconsole}
                consoledata={consoledata}
                setconsoledata={setconsoledata}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}
