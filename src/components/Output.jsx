import React from "react";
import ConsolePanel from "./Console";

export default function Output({
  usercode,
  show,
  setconsole,
  consoledata,
  setconsoledata,
  previewonlyframe,
}) {
  return (
    <div className={`magic-output ${previewonlyframe ? "preview-only" : ""}`}>
      <div className="magic-output-heading">
        <span>LIVE PREVIEW</span>
        <button
          className="console-button"
          onClick={() => setconsole((s) => !s)}
        >
          {show ? "HIDE CONSOLE" : "SHOW CONSOLE"}
        </button>
      </div>
      <iframe
        srcDoc={usercode}
        className={previewonlyframe ? "previewonlyframe" : ""}
      />
      {show && (
        <ConsolePanel
          consoledata={consoledata}
          setconsoledata={setconsoledata}
        />
      )}
    </div>
  );
}
