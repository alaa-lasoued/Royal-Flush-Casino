import React from "react";

function SideBar(props) {
  const listItemsBackGround = "bg-sky-900";

  return (
    <div id="side-bar" className="">
      <div
        id="default-sidebar"
        className="relative top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 m-0"
        aria-label="Sidebar"
      >
        <div
          className={`rounded-2xl h-full px-3 py-4 overflow-y-auto ${props.backgroundColor}`}
        >
          <ul className="space-y-2 mt-5">
            <li className={`rounded-lg ml-12 mb-5`}>
              <div className="text-base font-normal text-gray-900 rounded-lg dark:text-white ">
                <span className="ml-3  text-lg">Games List</span>
              </div>
            </li>
            <li className={`rounded-lg ${listItemsBackGround}`}>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <img
                  src="https://img.icons8.com/officel/256/roulette.png"
                  className="h-8 w-8"
                  alt="Flowbite Logo"
                />
                <span className="ml-3">Roulette</span>
              </div>
            </li>
            <li className={`rounded-lg ${listItemsBackGround}`}>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <img
                  src="https://img.icons8.com/doodle/256/dice.png"
                  className="h-8 w-8"
                  alt="Flowbite Logo"
                />
                <span className="ml-3">Dice</span>
              </div>
            </li>
            <li className={`rounded-lg ${listItemsBackGround}`}>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <img
                  src="https://img.icons8.com/nolan/256/slot-machine.png"
                  className="h-8 w-8"
                  alt="Flowbite Logo"
                />
                <span className="ml-3">Slot Machine</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
