import React from "react";
import * as PIXI from "pixi.js";
import { appConfig, tablePockets, spots, chips, pockets } from "../config";

function GameScreen() {
  // app config
  const {
    width,
    height,
    backgroundColor,
    displayCollisionObjects,
    rouletteRotationSpeed,
    pocketsNumber,
    roundDuration,
  } = appConfig;

  // setup PIXI js app instance
  const app = new PIXI.Application({
    antialias: true,
    width,
    height,
    backgroundColor,
  });

  // set the ticker speed to 60 frames per secon
  app.ticker.speed = 60;

  // Set border radius for PIXI view
  app.renderer.view.style.borderRadius = appConfig.borderRadius;

  // enable interactivity with stage
  app.stage.interactive = true;

  // app vars (refactoring : handle vars as states)
  // loader resources Object
  let loaderResources;

  // selected chip object { value , path }
  let selectedChip = {};

  // placed chips on the table
  let placedChips = {};

  // roulette sprite object
  let roulette;

  // roulette ticker instance
  let roulletTickerInstance = new PIXI.Ticker();

  // pointer chip ticker instance
  let pointerChipTickerInstance = new PIXI.Ticker();

  // pointer chip sprite object
  let pointerChipSprite;

  // latest bets
  const betsHistory = [];

  // total bet amount
  let totalBetAmount = 0;

  // rendered text
  let totalBetAmountText;

  // round status
  let currentRoundStatus = "pending"; // enum [ "pending" /*(waiting for timer to reach 0)*/ , "running" /*(round started)*/, "completed" /*(round completed)*/]

  // current round result
  let roundResult;

  // set timer value to round duration
  let roundTimer = roundDuration;

  // timer text object
  // used to update rendered text value
  let timerTextObject;

  // track running intervals
  const intervals = [];

  function setupGame(resources) {
    setupUIElements(resources);
    setupRouletteTable(resources);
    setupChips(resources);
    addTablecollisionDetection();
    initTickers();

    // save resources object globally
    loaderResources = resources;
  }

  // render ui elements (containers ....)
  function setupUIElements(resources) {
    // inputs container texture
    const inputsContainerTexture = resources.inputsContainer.texture;
    const inputsContainer = new PIXI.Sprite(inputsContainerTexture);

    // input container alpha
    inputsContainer.alpha = 0.3;

    // input container scale
    inputsContainer.scale.set(1.2, 0.9);

    // inputs container position
    const inputsContainerX = 100;
    const inputsContainerY = 370;

    // inputs container position
    inputsContainer.position.set(inputsContainerX, inputsContainerY);

    // append sprite to app stage
    app.stage.addChild(inputsContainer);

    // latest bet label texture
    const latestBetTableTexture = resources.latestBetContainer.texture;
    const latestBetTable = new PIXI.Sprite(latestBetTableTexture);

    // button position
    const latestBetTableX = 780;
    const latestBetTableY = 50;

    // latest bet label scale
    latestBetTable.scale.set(0.45, 0.45);

    // latest bet label position
    latestBetTable.position.set(latestBetTableX, latestBetTableY);

    // append sprite to app stage
    app.stage.addChild(latestBetTable);

    // steup ui text elements
    setupText();
  }

  // render text elements
  function setupText() {
    const colorsGradient = ["#e7ebea"]; // gradient

    const style = new PIXI.TextStyle({
      fontFamily: "cursive",
      fontSize: 18,
      fill: colorsGradient,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    // TEXT style
    const selectChipLabel = new PIXI.Text("Select Chip Value", style);

    // select chip label position
    const selectChipLabelX = 200;
    const selectChipLabelY = 405;

    // select chip label position
    selectChipLabel.position.set(selectChipLabelX, selectChipLabelY);

    // append sprite to app stage
    app.stage.addChild(selectChipLabel);

    const TimerTextstyle = new PIXI.TextStyle({
      fontFamily: "cursive",
      fontSize: 22,
      fill: colorsGradient,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    // TEXT style
    const roundTimerLabel = new PIXI.Text(
      "Round will start in",
      TimerTextstyle
    );

    // select chip label position
    const roundTimerLabelX = 510;
    const roundTimerLabelY = 400;

    // select chip label position
    roundTimerLabel.position.set(roundTimerLabelX, roundTimerLabelY);

    // append sprite to app stage
    app.stage.addChild(roundTimerLabel);

    // TEXT style
    timerTextObject = new PIXI.Text(roundTimer, TimerTextstyle);

    // select chip position
    const TimerX = 595;
    const TimerY = 440;

    // set Timer position
    timerTextObject.position.set(TimerX, TimerY);

    // append sprite to app stage
    app.stage.addChild(timerTextObject);

    // set TEXT style
    const amountlabel = new PIXI.Text("Total Bet Amount", style);

    // total bet amount text container position
    const betAmountContainerX = 550;
    const betAmountContainerY = 500;

    const horizontalSpaceBetweebContainerItems = 35;
    const verticalSpaceBetweebContainerItems = 20;

    // total bet amount label position
    amountlabel.position.set(betAmountContainerX - 20, betAmountContainerY);

    // append sprite to app stage
    app.stage.addChild(amountlabel);

    totalBetAmountText = new PIXI.Text("0.000 $", style);

    // total bet amount position
    totalBetAmountText.position.set(
      betAmountContainerX + verticalSpaceBetweebContainerItems,
      betAmountContainerY + horizontalSpaceBetweebContainerItems
    );

    // append sprite to app stage
    app.stage.addChild(totalBetAmountText);

    const latestBetLabel_TextStyle = new PIXI.TextStyle({
      fontFamily: "cursive",
      fontSize: 14,
      fill: colorsGradient,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    const latestBetLabel = new PIXI.Text(
      "LATEST BETS",
      latestBetLabel_TextStyle
    );

    // lastest bet label position
    const latestBetLabelX = 900;
    const latestBetLabelY = 30;

    // lastest bet label position
    latestBetLabel.position.set(latestBetLabelX, latestBetLabelY);

    // append sprite to app stage
    app.stage.addChild(latestBetLabel);
  }

  // render chips
  function setupChips(resources) {
    // Y , X position of chips container
    const containerX = 150;
    const containerY = 470;

    // horizontal space between container items (chips)
    const horizontalSpaceBetweenContainerItems = 50;

    // vertical space between container items (chips)
    const verticalSpaceBetweenContainerItems = 50;

    // chip scale 1 = (default size)
    const chipsScale = 0.4;

    // chip index from which line break will be applied
    const lineBreakIndex = 4;

    // keep track of rendered chips
    let chipsDisplayed = 1;

    chips.forEach((chip) => {
      // chip position
      let chipX = containerX;
      let chipY = containerY;

      // break line if the number of displayed chips reach the breaking index
      if (chipsDisplayed > lineBreakIndex) {
        chipY += verticalSpaceBetweenContainerItems;
      }

      // chips texture
      const chipTexture = resources[chip.path].texture;
      const chipSprite = new PIXI.Sprite(chipTexture);

      // enable interactivity
      chipSprite.interactive = true;

      // add an event listener for mouse click
      chipSprite.on("pointerdown", () => {
        handleChipSelection(chip, chipSprite);
      });

      // set chip scale
      chipSprite.scale.set(chipsScale);

      // chip position
      chipSprite.position.set(
        chipX +
          (chipsDisplayed <= lineBreakIndex
            ? chipsDisplayed
            : chipsDisplayed - lineBreakIndex) *
            horizontalSpaceBetweenContainerItems,
        chipY
      );

      // chip anchor
      chipSprite.anchor.set(0.5);

      // append sprite to app stage
      app.stage.addChild(chipSprite);

      chipsDisplayed++;
    });
  }

  // render roulette table elements
  function setupRouletteTable(resources) {
    // roulette texture
    const rouletteTexture = resources.roulette.texture;
    roulette = new PIXI.Sprite(rouletteTexture);

    // table texture
    const tableTexture = resources.table.texture;
    const table = new PIXI.Sprite(tableTexture);

    // ball texture
    const ballTexture = resources.ball.texture;
    const ball = new PIXI.Sprite(ballTexture);

    // roulette position
    roulette.position.set(180);

    // table position
    table.position.set(750, 225);

    // ball position
    ball.position.set(roulette.x - 3, roulette.y - 102);

    // roulette anchor
    roulette.anchor.set(0.5);

    // table anchor
    table.anchor.set(0.5);

    // ball anchor
    ball.anchor.set(0.5);

    // ball scale
    ball.scale.set(0.8);

    // roulette scale
    roulette.scale.set(0.8);

    // table scale
    table.scale.set(0.9);

    // append sprites to app stage
    app.stage.addChild(roulette);
    app.stage.addChild(table);
    app.stage.addChild(ball);
  }

  function addTablecollisionDetection() {
    const collissionRectangleHeight = 46;
    const collissionRectangleWidth = 50;

    // position of squares container
    const collisionContainerX = 360;
    const collisionContainerY = 100;

    // distance between squares
    const verticalGap = 53.5;
    const horizontalGap = 56.5;

    // fill color
    const fillColor = 0xffffff;

    // track loop
    let rownCounter = 0;
    let columnCounter = 0;

    tablePockets.forEach((rows) => {
      rows.forEach((spotValue) => {
        if (spotValue || spotValue === 0) {
          // create graphic object
          const rectangleGraphics = new PIXI.Graphics();

          rectangleGraphics.alpha = displayCollisionObjects ? 1 : 0;

          // set fill color
          rectangleGraphics.beginFill(fillColor);

          // enable interaction with graphic object
          rectangleGraphics.interactive = true;

          // Add the graphics object to the stage
          app.stage.addChild(rectangleGraphics);
          const xPosition = collisionContainerX + horizontalGap * rownCounter;
          const yPosition = collisionContainerY + verticalGap * columnCounter;

          // add an event listener for mouse click
          rectangleGraphics.on("mousedown", () => {
            // allow interaction only if round status is pending
            if (currentRoundStatus === "pending")
              handleInteractionWithTable({
                spotValue,
                spotSprite: rectangleGraphics,
                x: xPosition,
                y: yPosition,
              });
          });

          // draw a 50x50 square at position (415,100)
          rectangleGraphics.drawRect(
            xPosition,
            yPosition,
            collissionRectangleWidth,
            collissionRectangleHeight
          );

          // close the fill and complete the drawing
          rectangleGraphics.endFill();
        }
        // increment row counter
        rownCounter++;
      });
      // reset row counter
      rownCounter = 0;
      // increment column counter
      columnCounter++;
    });
  }

  // Update the stage on each animation frame
  function updateStage() {
    // Update the stage
    app.renderer.render(app.stage);

    // Request a new animation frame
    requestAnimationFrame(updateStage);
  }

  function destroyPlacedChips() {
    // loop though each table spot which contain a chip
    for (const spot in placedChips) {
      // loop though each chip sprite placed on the table
      for (const chipSprite of placedChips[spot]) {
        // destroy chip sprite
        chipSprite.destroy();
      }
    }
    // reset placed chips object
    placedChips = {};
  }

  // start timer countdown
  function startRoundTimer() {
    const timerInterval = setInterval(() => {
      // update timer value
      roundTimer -= 1;
      // update text value
      timerTextObject.text = roundTimer.toString();

      // reinitialize roulette rotation
      if (roundTimer === 1) roulette.rotation = 0;

      // check if timer reached 0s
      if (roundTimer === 0) {
        // update round status
        currentRoundStatus = "pending";
        // restart round
        startRound();
        // clear current interval
        clearInterval(timerInterval);
      }
    }, 1000);
    // update intervals array
    intervals.push(timerInterval);
  }

  // handle round start
  function startRound() {
    // check if round status is valid
    if (currentRoundStatus !== "pending")
      alert(
        "Sorry, betting is not allowed at this time as the round is already underway."
      );
    // reset timer
    roundTimer = roundDuration;

    // reset selected chip
    selectedChip = {};

    // update round status
    currentRoundStatus = "running";

    // prevent user form placing bet
    stopBetsPlacing();

    // The ball takes about 0.3 seconds (0.2822s)
    // to move from its current spot to the next one
    // while roulette rotation speed is at 0.03 radian per frame
    const duration = 0.2827 / (rouletteRotationSpeed * 100);

    // generate a random integer which represent number of full rotations before playing the last animation
    const randomInteger = Math.floor(Math.random() * 1 + 1); // default : 1 full rotations
    const fullRotationsNumber = pocketsNumber * randomInteger;

    // generate a random integer between (0 - 34) which represent the round result
    roundResult = Math.floor(Math.random() * 35);
    const spotIndex = spots.indexOf(roundResult) + 1; // get the spot index by which represent the round result

    // refers to the duration it takes for the animation to stop once the ball has landed on the result spot (milliseconds)
    const totalDuration = duration * (fullRotationsNumber + spotIndex) * 1000;

    // start animation
    startRoulletRotation();

    // stop animation
    stopRoulletRotation(totalDuration);
  }

  function startRoulletRotation(totalDuration) {
    if (roulette.rotation === 0) {
      roulletTickerInstance.start();
    }
  }

  function stopRoulletRotation(totalDuration) {
    // stop the roulette rotation after X milliseconds
    setTimeout(() => {
      // handle win
      handleWin();

      // stop the animation
      roulletTickerInstance.stop();

      // destroy all chips on the table
      destroyPlacedChips();

      // reset rendered text value
      totalBetAmountText.text = "0.000 $";

      // update round status
      currentRoundStatus = "pending";

      // update bets history
      updateBetsHistory(roundResult);

      startRoundTimer();
    }, totalDuration);
  }

  function updateBetsHistory(roundResult) {
    betsHistory.push({ pocketNumber: roundResult, rendered: false });
    // render history
    renderBetsHistory();
  }

  function renderBetsHistory() {
    // columns number of bets history table
    const tableColumns = 13;
    // space between container items
    const spaceBetween = 28.4;

    let renderedItemsNumber = 0;

    if (betsHistory.length === tableColumns + 1) {
      betsHistory.forEach((bet) => {
        if (bet.spriteObject) bet.spriteObject.destroy();
      });
      betsHistory.shift();
    }

    betsHistory.forEach((bet, index) => {
      // get texture
      const latestBetImageTexture =
        loaderResources[pockets[bet.pocketNumber]].texture;
      const latestBet = new PIXI.Sprite(latestBetImageTexture);

      // latest Bet sprite scale
      latestBet.scale.set(0.6);

      const latestBetContainerX = 1137;
      const latestBetContainerY = 67;

      // latest Bet sprite position
      latestBet.position.set(
        latestBetContainerX - renderedItemsNumber * spaceBetween,
        latestBetContainerY
      );

      // sprite anchor
      latestBet.anchor.set(0.5);

      // append sprite to app stage
      app.stage.addChild(latestBet);

      // save sprite object to update position when table is full
      betsHistory[index].spriteObject = latestBet;

      // increment rendered items number
      if (renderedItemsNumber < tableColumns - 1) renderedItemsNumber++;
    });
  }

  function stopBetsPlacing() {
    // destroy the chip sprite rendered on the pointer
    if (pointerChipSprite instanceof PIXI.Sprite) {
      pointerChipSprite.destroy();
      pointerChipSprite = null;
    }
  }

  function handleRotationSpeed(delta) {
    roulette.rotation += rouletteRotationSpeed * delta;
  }

  function placeSelectedChipOnPointer(chipSprite) {
    pointerChipTickerInstance = pointerChipTickerInstance.add(() => {
      // try catch block was added here to catch the error at its scope and prevent the service from stop executing
      try {
        chipSprite.position.copyFrom(
          app.renderer.plugins.interaction.mouse.global
        );
      } catch (err) {}
    });
    pointerChipTickerInstance.start();
  }

  function handleChipSelection(chipData, chipSprite) {
    // check if round status is pending and if the current chip is already selected
    if (
      currentRoundStatus === "pending" &&
      chipData.value !== selectedChip.value
    ) {
      if (pointerChipTickerInstance) {
        pointerChipTickerInstance.stop();
        pointerChipTickerInstance.remove();
      }

      // if a chip object is already rendered on the pointer destory it
      if (pointerChipSprite instanceof PIXI.Sprite) {
        pointerChipSprite.destroy();
        pointerChipSprite = null;
      }

      // Create a sprite object with a texture already assigned chip sprite object
      pointerChipSprite = new PIXI.Sprite(chipSprite.texture);

      // copy sprite position from pointer
      pointerChipSprite.position.copyFrom(
        app.renderer.plugins.interaction.mouse.global
      );

      // update sprite anchor
      pointerChipSprite.anchor.set(0.5);

      // update sprite scale
      pointerChipSprite.scale.set(0.3);

      // update sprite aplha
      pointerChipSprite.alpha = 0.85;

      // Add the new sprite to the stage
      app.stage.addChild(pointerChipSprite);

      selectedChip = { data: chipData, spriteObject: chipSprite };

      // update the new rendered chip to follow pointer position
      placeSelectedChipOnPointer(pointerChipSprite);
    }
  }

  function handleInteractionWithTable(spriteData) {
    if (currentRoundStatus === "pending" && Object.keys(selectedChip).length) {
      // Restrict the number of sprites that can be placed on each spot to two
      if (
        placedChips[spriteData.spotValue] &&
        placedChips[spriteData.spotValue].length === 2
      )
        return;

      // Create a sprite object with a texture already assigned chip sprite object
      const placedChip = new PIXI.Sprite(selectedChip.spriteObject.texture);

      // save chip value
      placedChip.value = selectedChip.data.value;

      // update total bet amount
      totalBetAmount += placedChip.value;

      // updated rendered text
      totalBetAmountText.text = `${totalBetAmount} $`;

      // update sprite anchor
      placedChip.anchor.set(0.3);

      // update sprite scale
      placedChip.scale.set(0.22);

      if (placedChips[spriteData.spotValue]) {
        placedChips[spriteData.spotValue] = [
          ...placedChips[spriteData.spotValue],
          placedChip,
        ];
      } else placedChips[spriteData.spotValue] = [placedChip];

      // update sprite position
      placedChip.position.x = spriteData.x;
      placedChip.position.y =
        spriteData.y + placedChips[spriteData.spotValue].length * 10;

      // Add the new sprite to the stage
      app.stage.addChild(placedChip);
    }
  }

  function handleWin() {
    if (placedChips[roundResult]) {
      // currently the reward is 5x for all spots
      const wonAmount = (calculateWonAmount(placedChips[roundResult]) * 5);
      displayWonAmount(wonAmount);
    }
  }

  function calculateWonAmount(spot) {
    let amount = 0;

    // loup though each sprite rendered on the winning spot
    for (const chipSprite of spot) amount += chipSprite.value;

    return amount;
  }

  function displayWonAmount(amount) {
    const labelStyle = new PIXI.TextStyle({
      fontFamily: "cursive",
      fontSize: 25,
      fill: ["#e7ebea"],
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    // TEXT style
    const wonAmountLabel = new PIXI.Text("You Won", labelStyle);

    // label position
    const wonAmountLabelX = 840;
    const wonAmountLabelY = 430;

    // update label position
    wonAmountLabel.position.set(wonAmountLabelX, wonAmountLabelY);

    // append text to app stage
    app.stage.addChild(wonAmountLabel);

    const wonAmounTextStyle = new PIXI.TextStyle({
      fontFamily: "cursive",
      fontSize: 25,
      fill: "green",
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    // TEXT style
    const wonAmount = new PIXI.Text(`+${amount}`, wonAmounTextStyle);

    // update label position
    wonAmount.position.set(wonAmountLabelX, wonAmountLabelY + 40);

    // append text to app stage
    app.stage.addChild(wonAmount);

    // remove label and won amount text after x ms
    setTimeout(() => {
      wonAmountLabel.destroy();
      wonAmount.destroy();
    }, 3000);
  }

  function initTickers() {
    // add roullet rotation ticker
    roulletTickerInstance.add((delta) => {
      handleRotationSpeed(delta);
    });
  }

  function loadGameItems() {
    console.log("loadGameItems");
    const loader = new PIXI.Loader();
    const ChipsImagePath = chips.map((elem) => elem.path);

    // load images
    loader
      .add("inputsContainer", "blackRectangle.png")
      .add("latestBetContainer", "latestBetContainer.png")
      .add("roulette", "roulette.png")
      .add("table", "roulette table.png")
      .add("backgroundImage", "background.png")
      .add("ball", "ball.png")
      .add(pockets)
      .add(ChipsImagePath);

    // on load setup game elements
    loader.load((loader, resources) => {
      setupGame(resources);
    });

    loader.onComplete.add(() => {
      // start round
    });
  }
  loadGameItems();

  // add Pixi.js view to the DOM
  const container = React.useRef(null);
  React.useEffect(() => {
    container.current.appendChild(app.view);
    startRoundTimer();
    // Start the update loop
    updateStage();
    // clear running intervals when component is destroyed or re-rendered
    return () => {
      intervals.forEach((elem) => clearInterval(elem));
    };
  }, []);

  return <div ref={container} id="mainScreen" className="m-auto mt-10"></div>;
}

export default GameScreen;
