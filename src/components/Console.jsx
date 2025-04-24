import React from "react";

export default function Console({ consoledata, setconsoledata }) {
  return (
    <div className="magic-console">
      <div className="console-heading">
        CONSOLE OUTPUT
        <button className="magic-clear" onClick={() => setconsoledata([])}>
          CLEAR
        </button>
      </div>
      <div className="magic-console-output">
        {consoledata.map((line, i) => (
          <div key={i} className="magic-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
