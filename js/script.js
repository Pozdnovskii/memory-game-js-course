const memoryGame = document.getElementById('game');
createNewGame();

function createNewGame() {
  memoryGame.innerHTML = '';

  const form = document.createElement('form');

  const label = document.createElement('label');
  label.textContent = 'Enter an even number of rows and columns';

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '2';
  input.max = '10';
  input.step = '2';
  input.value = '4';

  const formButton = document.createElement('button');
  formButton.textContent = 'Start Game';

  memoryGame.append(form);
  form.append(label);
  form.append(input);
  form.append(formButton);


  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (input.value > 10 || input.value < 2 || input.value % 2 != 0) alert('Enter an even number from 2 to 10')
    else {
      form.style.display = 'none';
      game(input.value)
    }
  })

  return {
    form, label, input, formButton,
  }
}

function createCard(input, i) {
  const cardField = document.createElement('div')
  const card = document.createElement('div');
  const cardFront = document.createElement('div');
  const cardNumber = document.createElement('span');

  cardField.classList.add('card-field');
  cardField.style.width = 'calc(' + 90 / input + '%)';
  cardField.style.margin = 'calc(' + 5 / input + '%)';
  card.classList.add('card');
  cardFront.classList.add('card-content', 'card-back');
  cardNumber.classList.add('card-number');
  cardNumber.style.fontSize = 30 / input + 'vw'
  cardNumber.textContent = Math.ceil((i + 1) / 2);

  cardField.append(card)
  card.append(cardFront);
  cardFront.append(cardNumber);

  return {
    cardField, card, cardFront, cardNumber,
  }
}

function randomCards() {
  const cardNumbersArray = document.querySelectorAll('.card-number')

  for (let i = cardNumbersArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardNumbersArray[i].textContent, cardNumbersArray[j].textContent] = [cardNumbersArray[j].textContent, cardNumbersArray[i].textContent];
  }
}

function createGameField(input) {
  const gameField = document.createElement('div');
  gameField.classList.add('game-field');

  const options = document.createElement('div');
  options.classList.add('options');

  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart Game';
  restartButton.addEventListener('click', () => {
    createNewGame()
    clearTimeout(timerID);
  })

  const timer = document.createElement('p');
  timer.classList.add('timer')
  let timerNumber = 20;
  timer.textContent = timerNumber;
  let countdownID = setTimeout(function countdown() {
    timerNumber--;
    timer.textContent = timerNumber;
    if (timerNumber <= 10) timer.style.color = 'rgb(247, 64, 64)';
    countdownID = setTimeout(countdown, 1000)
  }, 1000)


  memoryGame.append(gameField);
  memoryGame.append(options);
  options.append(timer);
  options.append(restartButton);

  for (let i = 0; i < Math.pow(input, 2); i++) {
    let card = createCard(input, i);
    gameField.append(card.cardField);
  }

  randomCards();

  return {
    gameField, options, timer, restartButton,
  }
}

let timerID;

function game(input) {
  createGameField(input);

  timerID = setTimeout(() => {
    memoryGame.innerHTML = '';

    let timeFinish = document.createElement('p');
    timeFinish.classList.add('notification')
    timeFinish.textContent = 'Time Is Up!';
    memoryGame.append(timeFinish)

    clearTimeout(timerID);
    setTimeout(() => createNewGame(), 4000)
  }, 20000);

  const cards = document.querySelectorAll('.card-content');

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;

  cards.forEach(card => card.addEventListener('click', flipCard))

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.remove('card-back');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    hasFlippedCard = false;

    checkForMatch();

    if (document.querySelectorAll('.card-success').length === cards.length) {
      endGame()
    }
  }

  function unflipCards() {
    lockBoard = true

    setTimeout(() => {
      firstCard.classList.add('card-back');
      secondCard.classList.add('card-back');
      lockBoard = false;
      firstCard = false;
      secondCard = false;
    }, 600);
  }

  function checkForMatch() {
    if (firstCard.textContent === secondCard.textContent) {
      disableCards();
      return;
    }

    unflipCards();
  }

  function disableCards() {
    firstCard.classList.add('card-success')
    secondCard.classList.add('card-success')
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
  }

  function endGame() {
    memoryGame.innerHTML = '';

    let congratulation = document.createElement('p');
    congratulation.classList.add('notification')
    congratulation.textContent = 'Congratulation!';

    memoryGame.append(congratulation)

    clearTimeout(timerID)
    setTimeout(() => createNewGame(), 4000)
  }
}
