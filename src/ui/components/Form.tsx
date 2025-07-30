import { useState } from 'react'

function Form(): React.JSX.Element {
  const [form] = useState(window.electron.process.versions)

  return (
    <ul className="form">
      <li className="electron-version">Electron v{form.electron}</li>
      <li className="chrome-version">Chromium v{form.chrome}</li>
      <li className="node-version">Node v{form.node}</li>
    </ul>
  )
}

export default Form
