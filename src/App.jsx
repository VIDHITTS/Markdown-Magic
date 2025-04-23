import React,{useState,useEffect}from'react'
import'./App.css'

export default function App(){

const[htmlcode,sethtmlcode]=useState('<h1>Hello World!</h1>')
const[csscode,setcsscode]=useState('h1{color:#00ff00}')
const[jscode,setjscode]=useState('console.log("Hello from JS")')
const[tab,settab]=useState('html')
const[consoledata,setconsoledata]=useState([])
const[show,setconsole]=useState(false)
const[dark,setdarktheme]=useState(true)

useEffect(()=>{
  document.documentElement.setAttribute('theme',dark?'dark':'light')
},[dark])

useEffect(()=>{
  const handler=e=>{
    if(e.data.type==='console')
      {setconsoledata((prevData) => {
        const message = e.data.args.join(' ');
        return [...prevData, message];
      })}
  }
  window.addEventListener('message',handler)
  return()=>window.removeEventListener('message',handler)
},[])

let usercode=`<html>
    <head><style>${csscode}</style></head>
    <body>${htmlcode}
      <script>
        const _log=console.log
        console.log=(...a)=>{_log(...a);parent.postMessage({type:'console',args:a},'*')}
        try{${jscode}}catch(e){console.log('Error:',e.message)}
        </script>
    </body>
    </html>`

let value=null
if(tab==='html')
  {value=htmlcode}
else if(tab==='css')
  {value=csscode}
else 
  {value=jscode}

const onChange=e=>{
  if(tab==='html')
    {sethtmlcode(e.target.value)}
  else if(tab==='css')
    {setcsscode(e.target.value)}
  else 
    {setjscode(e.target.value)}
}

return(
  <div className="app-container">

    <header className="app-header">
      <div>
        <h1>CODE EDITOR</h1>
        <p>Write and preview HTML, CSS, and JavaScript code in real-time</p>
      </div>
      <button className="theme-toggle" onClick={()=>setdarktheme(d=>!d)}>
        {dark?'☀️ LIGHT MODE':'🌙 DARK MODE'}
      </button>
    </header>

    <div className="main-content">

      <div className="editor-panel">

        <div className="tab-bar">
          {['html','css','js'].map(t=>(
            <button
              key={t}
              className={tab===t?'active':''}
              onClick={()=>settab(t)}>
              {t}
            </button>
          ))}
        </div>

        <textarea
          className="editor-textarea"
          value={value}
          onChange={onChange}
          placeholder={`Enter ${tab} here...`}
          spellCheck="false"/>
      </div>

      <div className="preview-panel">

        <div className="preview-header">
          <span>LIVE PREVIEW</span>
          <button className="console-toggle" onClick={()=>setconsole(s=>!s)}>
            {show?'HIDE CONSOLE':'SHOW CONSOLE'}
          </button>
        </div>

        <iframe srcDoc={usercode}/>
        
        {show&&(
          <div className="console-panel">
            <div className="console-header">
              CONSOLE OUTPUT
              <button className="clear-console" onClick={()=>setconsoledata([])}>
                CLEAR
              </button>
            </div>
            <div className="console-output">
              {consoledata.map((l,i)=>(
                <div key={i} className="console-line">{l}</div>
              ))}
          </div>
          </div>
        )}
  </div>
  </div>
  </div>
)
}
