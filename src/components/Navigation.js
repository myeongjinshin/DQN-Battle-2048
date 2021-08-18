import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import './Navigation.css';
import { useHistory } from 'react-router-dom';

import { IconContext } from 'react-icons';
function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= window.innerHeight * 0.84);

  window.addEventListener('resize',() => setIsMobile(window.innerWidth <= window.innerHeight * 0.84));

  const setClassNames = num => {
      
      const classArr = ["m-item"];
      if (openMenu) {
        if(isMobile) classArr.push(`mopen-${num}`);
        else classArr.push(`open-${num}`);
      }
      return classArr.join(' ')
  }

  const pushToRoute = route => {
      history.push(route)
      setOpenMenu(false)
  }

  return (
    <IconContext.Provider value={{ color: '#fff' }}>
      <div className="Menu">
          <div className={"m-logo"}
              onClick={() => setOpenMenu(!openMenu)}>
              <FaIcons.FaBars size="2em"/>
          </div>
          <div className={setClassNames(1)}
              onClick={() => pushToRoute("/")}>
              Home
          </div>
          <div className={setClassNames(2)}
              onClick={() => pushToRoute("/game")}>
              Game
          </div>
          <div className={setClassNames(3)}
              onClick={() => pushToRoute("/profile")}>
              Profile
          </div>
          <div className={setClassNames(4)}
              onClick={() => pushToRoute("/list")}>
              List
          </div>
      </div>
    </IconContext.Provider>
  );

}
export default Navbar;