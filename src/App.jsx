import { useState,useEffect } from 'react'
import './App.css'

function App(){
  const [htmlcode,set_html_code] = useState("<h1>Hello World!</h1>")
  const source_code=`
  <html>
  <head></head>
  <body>${htmlcode}</body
  </html>
  `
  function handlechange(e){
    set_html_code(e.target.value)
  }
  return(
    <div >
      <header className="heading">
      <div>
        <h1>CODE EDITOR</h1>
        <p>Write and preview HTML, CSS, and JavaScript code in real-time</p>
      </div>
      </header>

      <div>html</div>
      <textarea
      onChange={handlechange}
      />
      <div>live preview</div>
      <iframe srcDoc={source_code}></iframe>
    </div>
  );
}
export default App