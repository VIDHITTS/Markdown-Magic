export default function Selector({ tab, settab }) {
  return (
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
  );
}
