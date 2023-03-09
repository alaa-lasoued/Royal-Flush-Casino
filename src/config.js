const appConfig = {
    width: 1200,                     // PIXI app width
    height: 600,                     // PIXI app height
    backgroundColor: 355416,         // PIXI app background color
    borderRadius: "11px",            // PIXI app border radius in px
    pocketsNumber: 37,               // total number of roulette pockets
    roundDuration: 10,                // round duration in seconds
    displayCollisionObjects: false,  // if true display table collision objects
    rouletteRotationSpeed: 0.06,    // roulette rotation speed in radian
};

// images folder
const chipsFolder = "chip-default";

// chips data
const chips = [
    { value: 100, path: `${chipsFolder}/chip-0.png` },
    { value: 500, path: `${chipsFolder}/chip-1.png` },
    { value: 1000, path: `${chipsFolder}/chip-2.png` },
    { value: 10000, path: `${chipsFolder}/chip-3.png` },
    { value: 50000, path: `${chipsFolder}/chip-4.png` },
    { value: 100000, path: `${chipsFolder}/chip-5.png` },
    { value: 500000, path: `${chipsFolder}/chip-6.png` },
    { value: 1000000, path: `${chipsFolder}/chip-7.png` },
];

// images folder
const pocketsFolder = "pockets";

// pockets images texture
const pockets = [];

// fill pockets array
for (let pocketCounter = 0; pocketCounter < appConfig.pocketsNumber; pocketCounter++) pockets.push(`${pocketsFolder}/pocket${pocketCounter}.png`)

// table pockets 2d map
// each element represent a table row
const tablePockets = [
    [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, "2:1,1"],
    [0, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, "2:1,2"],
    [0, 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, "2:1,3"],
    [
        null,
        "1:12",
        "1:12",
        "1:12",
        "1:12",
        "2:12",
        "2:12",
        "2:12",
        "2:12",
        "3:12",
        "3:12",
        "3:12",
        "3:12",
    ],
    [
        null,
        "1-18",
        "1-18",
        "even",
        "even",
        "black",
        "black",
        "red",
        "red",
        "odd",
        "odd",
        "13-36",
        "13-36",
    ],
]

// indexing roulette spots counterclockwise
// 26 index 0 , 3 index 1 ....
// use spots.indexOf(spotValue) to get spot index by value
// used to determine the number of movements required for the ball to reach a specific spot.
const spots = [
    26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8,
    30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0
];

module.exports = {
    appConfig,
    tablePockets,
    spots,
    chips,
    pockets,
};