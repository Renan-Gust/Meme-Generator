import './home/style.css'
import { MemeGenerator } from './home/MemeGenerator'

import logoImg from './images/logo.svg'

function App() {
  return (
    <div className="wrapper">
        <img src={logoImg} alt="Logo" />
        <MemeGenerator />
    </div>
  );
}

export default App;