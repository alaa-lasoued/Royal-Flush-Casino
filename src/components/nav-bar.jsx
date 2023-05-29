import React from "react";

function NavBar(props) {
  function playSound() {
    const sound = new Audio("http://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg");

    sound.play();
  }
  return (
    <div id="navBar">
      <nav
        className={`${props.backgroundColor} border-gray-200 px-2 sm:px-4 py-2.5`}
      >
        <div className="container flex flex-wrap mx-0">
          <a href="http://localhost:3000/" className="flex items-center">
            <img
              src="https://img.icons8.com/external-wanicon-lineal-color-wanicon/256/external-casino-free-time-wanicon-lineal-color-wanicon.png"
              className="h-12 w-12"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Casino
            </span>
          </a>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul
              className={`flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-${props.backgroundColor} md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0`}
            >
              <li>
                <a
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  onClick={() => {
                    playSound();
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
