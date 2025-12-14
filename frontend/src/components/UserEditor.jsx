export default function UserEditor({ tab, value, onChange }) {
  return (
    <textarea
      className="user-area"
      value={value}
      onChange={onChange}
      placeholder={`Enter ${tab} here...`}
      spellCheck="false"
    />
  );
}
