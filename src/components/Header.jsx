import React from "react";

export default function Header({
  dark,
  setdarktheme,
  showonlypreview,
  setshowpreview,
}) {
  const buttonMargin = {
    marginLeft: !showonlypreview ? "565px" : "500px",
  };

  return (
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
  );
}
