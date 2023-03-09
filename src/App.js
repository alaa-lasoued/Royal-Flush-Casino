import React from 'react';

import SideBar from './components/side-bar'
import GameScreen from './components/game-screen'
import NavBar from './components/nav-bar';

function App() {
  
  const sideBarBackgroundColor = 'bg-sky-900';
  const navBarBackgroundColor = 'bg-sky-800';

  const bodyBackgroundColor = 'bg-sky-800';
  return (
    <div className={bodyBackgroundColor}>
      <NavBar backgroundColor={navBarBackgroundColor} />
      <div id='mainApp' className='flex flex-row grow-0'>
        <SideBar NavBar backgroundColor={sideBarBackgroundColor}/>
        <GameScreen />
      </div>
    </div>
  );
}

export default App;