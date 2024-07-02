const tileDisplay = document.querySelector('.tile');
const keyboard = document.getElementById('key');
const bs = document.getElementById('bs');
const en = document.getElementById('en');
const messageDisplay = document.querySelector('.message');
const messageDisplay2 = document.querySelector('.remessage');
const game = document.querySelector('.game');
const cbut = document.querySelector('.cbut');
const control = document.querySelector('.control');
const level = document.querySelector('.level');

const fetchRandomWord = async () => {
	const ratingInputs = document.querySelectorAll('input[name="star-radio"]');
	let selectedRating = 1; // Default rating is 1
  
	// Find the selected rating
	for (const input of ratingInputs) {
	  if (input.checked) {
		selectedRating = parseInt(input.value);
		break;
	  }
	}
	//(selectedRating);
	const fileName = `${selectedRating}.txt`; // Construct the file name
  
	try {
	  const response = await fetch(`dic/${fileName}`);
	  const dictionaryText = await response.text();
	  const dictionaryArray = dictionaryText.split('\n').filter(word => word.trim() !== '');
  
	  if (dictionaryArray.length > 0) {
		const randomIndex = Math.floor(Math.random() * dictionaryArray.length);
		const randomWord = dictionaryArray[randomIndex];
		//(randomWord);
		return {
		  word: randomWord,
		  details: ''
		};
	  } else {
		throw new Error('Dictionary is empty.');
	  }
	} catch (error) {
	  console.error(error);
	}
  };
  
  // Add event listener to rating inputs
  const ratingInputs = document.querySelectorAll('input[name="star-radio"]');
  for (const input of ratingInputs) {
	input.addEventListener('change', async () => {
		setTimeout(hideLevel, 500);
	  try {
		const { word: fetchedWord, details: fetchedDetails } = await fetchRandomWord();
		word = fetchedWord;
		details = fetchedDetails;
	  } catch (error) {
		console.error('Error fetching random word:', error.message);
	  }
	});
  }
  
  let word;
  let details;
  
  (async () => {
	try {
	  const { word: fetchedWord, details: fetchedDetails } = await fetchRandomWord();
	  word = fetchedWord;
	  details = fetchedDetails;
	} catch (error) {
	  console.error('Error fetching random word:', error.message);
	}
  })();
  


const keys = [
	'پ',
	'ۆ',
	'ئ',
	'ێ',
	'ی',
	'ت',
	'ر',
	'ڕ',
	'ە',
	'و',
	'ق',
	'ل',
	'ڵ',
	'ک',
	'ژ',
	'هـ',
	'گ',
	'غ',
	'ف',
	'د',
	'س',
	'ش',
	'ا',
	'م',
	'ن',
	'ب',
	'ڤ',
	'چ',
	'ج',
	'خ',
	'ز',
	'ح',
	'خ',

]

const guessRow = [
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', '']
]

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
let isGameWon = false;
let keyboardInput = false;
let rowDone = true;

guessRow.forEach((guessRow, guessRowIndex) => {
	const rowElement = document.createElement('div');
	rowElement.setAttribute('id', 'guessRow' + guessRowIndex);

	guessRow.forEach((guess, guessIndex) => {
		const tileElement = document.createElement('div');
		tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
		tileElement.classList.add('tile');
		rowElement.append(tileElement);
	});
	tileDisplay.append(rowElement);
});

keys.forEach(function(key) {
	const buttonElement = document.createElement('button');
	buttonElement.textContent = key;
	buttonElement.setAttribute('id', key);
	buttonElement.addEventListener('click', () => handleClick(key));
	keyboard.append(buttonElement);
});

// Check if vibration is supported
if ('vibrate' in navigator) {
  // Function to trigger haptic feedback
  function triggerHapticFeedback() {
    // Vibrate for 100 milliseconds
    navigator.vibrate(50);
  }
} else if ('TapticEngine' in window) {
  // Function to trigger haptic feedback using TapticEngine API
  function triggerHapticFeedback() {
    window.TapticEngine.impact();
  }
} else {
  // Fallback for devices that do not support haptic feedback
  function triggerHapticFeedback() {
    // Implement an alternative feedback mechanism, such as visual or auditory cues
    // This can be a simple animation, a sound effect, or any other feedback method suitable for your application
  }
}


const handleClick = (key) => {
	playButtonSound()	
	triggerHapticFeedback();
	if (keyboardInput === false) {
		return;
	}
	if (key === 'هـ') {
		addLetter('ه', true);
	} else {
		addLetter(key);
	}


}

const validLetters = ['ا', 'ب', 'پ', 'ت', 'ج', 'چ', 'خ', 'د', 'ر', 'ڕ', 'ز', 'ژ', 'س', 'ش', 'غ', 'ف', 'ڤ', 'ق', 'ک', 'گ', 'ل', 'ڵ', 'م', 'ن', 'ه', 'و', 'ۆ', 'ی', 'ێ', 'ئ', 'ە', 'ح', 'خ'];

const addLetter = (key, isKeyboardInput = false) => {


	if (isGameOver) {
		return; // Exit the function if the game is over
	}
	if (currentTile < 5 && currentRow < 6 && validLetters.includes(key)) {
		const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
		if (key === 'ه') {
			tile.textContent = 'هـ';
		} else {
			tile.textContent = key;
		}
		guessRow[currentRow][currentTile] = key;
		tile.setAttribute('data', key);
		currentTile++;
	}
	
};

let enterPressed = false;

const handleKeyPress = (event) => {
  if (keyboardInput === false) {
    return;
  }

  const key = event.key;

  if (key === 'Enter') {
    if (enterPressed) {
      event.preventDefault(); // Prevent Enter key from performing its default action
      return;
    }
    enterPressed = true;
    checkRow();
  } else if (key === 'Backspace') {
    if (enterPressed) {
      event.preventDefault(); // Prevent Backspace key from performing its default action
      return;
    }
    deleteLetter();
  } else {
    addLetter(key, true);
  }
};

// Reset enterPressed flag when key is released
document.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    enterPressed = false;
  }
});



document.addEventListener('keydown', handleKeyPress);


const deleteLetter = () => {
	triggerHapticFeedback();
	playButtonSound()

	if (isGameOver) {
		return; // Exit the function if the game is over
	}
	if (currentTile > 0) {
		currentTile--
		const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
		tile.textContent = '';
		guessRow[currentRow][currentTile] = '';
		tile.setAttribute('data', '');
	}
};

function disableKeyboardInput(event) {
	event.preventDefault();
}

// Add event listener to disable keyboard input

const checkRow = async () => {
	playButtonSound()

	if (rowDone === true) {
		rowDone = false;

		triggerHapticFeedback()
		const guess = guessRow[currentRow].join('');
		const trimmedGuess = guess.trim();
		const trimmedWord = word.trim();

		if (currentTile > 4) {
			const existsInDictionary = await checkWordInDictionary(guess);
			//(existsInDictionary);
			if (existsInDictionary) {
				//('guess is === ' + guess)
				//('word is === ' + word)
				//(trimmedWord === trimmedGuess)
				if (trimmedWord === trimmedGuess) {
					incrementGameCounter();
						flipTile()
						showMessage('نایابە')
						//('word is correct')
										isGameOver = true;
										isGameWon = true;
										const winnerDiv = createWinnerDiv(currentRow);
										document.body.appendChild(winnerDiv);
										setTimeout(playSuccessSound, 200);
										game.classList.add('disabled-div');
										keyboardInput = false;
										control.style.pointerEvents = 'all';
										const winner= document.querySelector('.winner');
										setTimeout(() => {
											winner.remove();
										}, 6000);
									} else if (currentRow < 5) {
										flipTile();
										currentRow++;
										currentTile = 0;
										showMessage('وشەیەکی تر هەڵبژێرە');
									} else if (currentRow <= 5) {
										incrementGameCounter();
										flipTile();
										const loserDiv = createLoserDiv();
										document.body.appendChild(loserDiv);
										game.classList.add('disabled-div');
										playLoseSound();
										keyboardInput = false;
										setTimeout(playLoseSound, 1000);
										backgroundMusic.pause();
										control.style.pointerEvents = 'all';
										const loser = document.querySelector('.loser');
										const winner= document.querySelector('.winner');

										setTimeout(() => {
											loser.remove();
											winner.remove();
										}, 6000);
					
									}
					
								} else {
									showMessage('ئەم وشەیە لە فەرهەنگدا نییە');
					
								}
					
							}
						}
						rowDone = true
					
					}

				


for (const input of ratingInputs) {
	input.addEventListener('change', () => {
	  refreshPage();
	});}


let isDisplayingMessage = false;
const showMessage = (message) => {
	if (isDisplayingMessage) {
		return; // Exit the function if a message is currently being displayed
	}

	isDisplayingMessage = true;


	const messageElement = document.createElement('p');
	messageElement.textContent = message;
	messageElement.style.color = 'white'; // Set the text color to black (or any other desired color)
	messageElement.style.fontSize = 'px'; // Set the font size (adjust as needed)

	messageDisplay.append(messageElement);

	setTimeout(() => {
		messageDisplay.removeChild(messageElement);
		isDisplayingMessage = false;
	}, 2000);
};


const addColorToKey = (letter, color) => {
	
	//(letter);
	if (letter === 'ه') {
		const additionalKey = document.getElementById('هـ');
		additionalKey.classList.add(color);
	  }else{
		const key = document.getElementById(letter);
		//(key);
		key.classList.add(color);
	}
	
	

  };
  

const flipTile = () => {
	const rowTiles = document.querySelector('#guessRow' + currentRow).childNodes;
	let checkWord = word;
	const guess = [];

	rowTiles.forEach(tile => {
		guess.push({
		  letter: tile.getAttribute('data'),
		  color: 'grey'
		});
	  });
	  
	  guess.forEach((guess, index) => {
		if (guess.letter === word[index]) {
		  guess.color = 'green';
		  checkWord = checkWord.substring(0, index) + checkWord.substring(index + 1);
		}
	  });
	  
	  guess.forEach((guess, index) => {
		if (guess.color === 'grey' && checkWord.includes(guess.letter)) {
		  const wordIndex = checkWord.indexOf(guess.letter);
		  if (wordIndex === index) {
			guess.color = 'green';
		  } else {
			guess.color = 'yellow';
		  }
		  checkWord = checkWord.substring(0, wordIndex) + checkWord.substring(wordIndex + 1);
		}
	  });
	  


var greened = 0;

	rowTiles.forEach((tile, index) => {
		setTimeout(() => {
			setTimeout(playFlipSound(), 200);
			tile.classList.add('flip');
			tile.classList.add(guess[index].color);
			addColorToKey(guess[index].letter, guess[index].color);
			if(guess[index].color == 'green'&&isGameWon == false){
				playGreenSound();}			

		}, 500 * index);

	});

};

const checkWordInDictionary = async (word) => {
	const response = await fetch('dic/dictionary.txt');
	const dictionaryText = await response.text();
	const dictionaryArray = dictionaryText.split('\n');
	return dictionaryArray.includes(word);
};


window.onload = function() {
	initializeToggleStates();
	
};

// Function to hide the pop-up
document.addEventListener('DOMContentLoaded', function() {
    var btn = document.querySelector('.btn');
    btn.addEventListener('click', hidePopup);
  });

  

  function hidePopup() {
	animateLogo();
	playAgainSound();
	setTimeout(() => {
	  playBackgroundMusic();
	}, 1000);
	keyboardInput = true;
	triggerHapticFeedback();
	const popup = document.getElementsByClassName('popup')[0];
	popup.classList.add('hide');
	setTimeout(() => {
	  popup.style.display = 'none';
	  popup.classList.remove('show');

	}, 500);
	myDiv.classList.remove('disabled-div');
  }
  
  function showPopup() {
	keyboardInput = false;
	triggerHapticFeedback();
	const popup = document.getElementsByClassName('popup')[0];
	popup.style.display = 'block';
	myDiv.classList.add('disabled-div');
	popup.classList.remove('hide');
	setTimeout(() => {
	  popup.classList.add('show');
	}, 100);
  }
  
  

function showAbout() {
	keyboardInput = false;
	triggerHapticFeedback()
	document.getElementsByClassName('about')[0].style.display = 'block';
	about.style.display = 'block';
	myDiv.classList.add('disabled-div');
	about.style.pointerEvents = 'all';
	keyboardInput = false;
	about.classList.remove('out');
	about.classList.add('in');

}

function showLevel() {
	keyboardInput = false;
	triggerHapticFeedback();
	myDiv.classList.add('disabled-div');
	level.style.pointerEvents = 'all';
	level.style.display = 'block'; // Show the level element
	keyboardInput = false;
	level.classList.remove('out');
	level.classList.add('in');
}

function hideLevel() {
	keyboardInput = true;
	triggerHapticFeedback()
	myDiv.classList.remove('disabled-div');
	level.classList.add('out');
	level.classList.remove('in');

}



function hideAbout() {
	keyboardInput = true;
	triggerHapticFeedback()
	myDiv.classList.remove('disabled-div');
	about.classList.add('out');
	ab.classList.remove('in');
}


const tipsy = document.createElement('p');

function showTip() {
	triggerHapticFeedback();

	if (currentRow >= 3) {
		playTipSound();
		if (currentRow === 2) {
			tipsy.textContent = word.slice(0, 1) + "*".repeat(word.length - 1);
		} else if (currentRow === 3) {
			tipsy.textContent = word.slice(0, 2) + "*".repeat(word.length - 2);
		} else if (currentRow === 4) {
			tipsy.textContent = word.slice(0, 3) + "*".repeat(word.length - 3);
		} else if (currentRow === 5) {
			tipsy.textContent = word.slice(0, 4) + "*".repeat(word.length - 4);
		} else {
			tipsy.textContent = word;
		}
		tip.style.display = 'block';
		myDiv.classList.add('disabled-div');
		tip.style.pointerEvents = 'all';
		tip.append(tipsy);
	} else {
		playNoTipSound();
		tipsy.textContent = 'لەدوای سێ هەوڵدان، دەتوانی بیرۆکەیەک لەسەر وشەکە وەربگری چەند پیتێکی یەکەمی وشەکە دەبینیت بەپێی ژمارەی هەوڵدانەکانت';
		tip.style.display = 'block';
		myDiv.classList.add('disabled-div');
		tip.style.pointerEvents = 'all';
		tip.append(tipsy);

	}





}

function hideTip() {
	triggerHapticFeedback()
	tip.style.display = 'none';
	myDiv.classList.remove('disabled-div');
	tipsy.remove()
	keyboardInput = true;

}




const backgroundOverlay = document.querySelector('.body');


const myDiv = document.getElementById('body');
const about = document.querySelector('.about');
const popup = document.querySelector('.popup');
const toggleButton = document.getElementById('toggleButton');
const tip = document.querySelector('.tip');





let isKeyboardVisible = false;

toggleButton.addEventListener('click', function() {
	playClickSound()
  triggerHapticFeedback();
  if (toggleButton.checked) {
    keyboard.style.display = 'grid';
    keyboard.style.pointerEvents = 'auto';
    isKeyboardVisible = true;
  } else {
    keyboard.style.display = 'none';
    isKeyboardVisible = false;
    keyboard.style.pointerEvents = 'none';
  }
});
function seeMeaning() {
	playButtonSound()	

	// Predefined variable
  
	// Construct the URL with the variable
	var url = "https://lex.vejin.net/ck/search?t=" + encodeURIComponent(word);
  
	// Open the URL in a new tab
	var newTab = window.open(url, "_blank");
	newTab.focus();
  }

const createWinnerDiv = (rowNumber) => {
	//('createWinnerDiv');
	backgroundMusic.pause();
	const div = document.createElement('div');
	div.classList.add('winner');
	const closeButton = document.createElement('span');
	div.appendChild(closeButton);
	const header = document.createElement('h3');
	const rowWord = convertToKurdishWord(`${rowNumber}`);
	var rowWordSpan = document.createElement('span');
var wordSpan = document.createElement('span');
rowWordSpan.classList.add('bold');
wordSpan.classList.add('bold');
rowWordSpan.textContent = rowWord;
wordSpan.textContent = word;
header.innerHTML = `پیرۆزە! توانیت بە ${rowWordSpan.outerHTML} هەڵهێنان براوە بیت! وشەکە بریتیی بوو لە ${wordSpan.outerHTML} `;
div.appendChild(header);
	


	div.appendChild(header);
	const refreshButtonHtml = '<button onclick="refreshPage()" class="playagain">دووبارە یاری بکە</button> <button onclick="seeMeaning()" class="seemeaning">مانای وشەکە ببینە</button>';

	
	setTimeout(() => {
		control.innerHTML += refreshButtonHtml;
	}, 2500);


	return div;
};

const createLoserDiv = (rowNumber) => {
	//('createLoserDiv');
	backgroundMusic.pause();
	const div = document.createElement('div');
	div.classList.add('winner');
	const closeButton = document.createElement('span');
	div.appendChild(closeButton);

	const header = document.createElement('h3');
var wordSpan = document.createElement('span');
wordSpan.classList.add('bold');
wordSpan.textContent = word;
header.textContent = 'یارییەکە کۆتایی هات وشەکە بریتی بوو لە ';
header.appendChild(wordSpan);
div.appendChild(header);


	const refreshButtonHtml = '<button onclick="refreshPage()" class="playagain">دووبارە یاری بکە</button><button onclick="seeMeaning()" class="seemeaning">مانای وشەکە ببینە</button>';

	setTimeout(() => {
		control.innerHTML += refreshButtonHtml;
		control.style.pointerEvents = 'all';
	}, 2500);

	return div;

};


function refreshPage() {
	animateLogo();
	var userStatus =  getGameCounter();
	//(userStatus);
	if (userStatus === "1"&& userStatus === "10"&& userStatus === "50") {
	  showLevel();
	}

	playButtonSound()	
control.innerHTML = '';
	game.classList.remove('disabled-div');
	playAgainSound();
	setTimeout(() => {
		playBackgroundMusic()
		}, 1000);

	// Clear user inputs
	guessRow.forEach((guessRow, guessRowIndex) => {
	  guessRow.forEach((guess, guessIndex) => {
		const tile = document.getElementById('guessRow-' + guessRowIndex + '-tile-' + guessIndex);
		tile.textContent = '';
		guessRow[guessIndex] = '';
		tile.setAttribute('data', '');
		tile.classList.remove('flip', 'green', 'yellow', 'grey');
	  });
	});
  
	// Reset game variables
	currentRow = 0;
	currentTile = 0;
	isGameOver = false;
	isGameWon = false;
	keyboardInput = true;
	rowDone = true;
  
	// Remove winner and loser divs if they exist
	const winnerDiv = document.querySelector('.winner');
	const loserDiv = document.querySelector('.loser');
	if (winnerDiv) {
	  winnerDiv.remove();
	}
	if (loserDiv) {
	  loserDiv.remove();
	}
  
	// Remove color classes from keys
	keys.forEach(function (key) {
	  const buttonElement = document.getElementById(key);
	  buttonElement.classList.remove('green', 'yellow','grey');
	});
  
	// Clear message display
	messageDisplay.innerHTML = '';
  
	// Enable keyboard input
	keyboardInput = true;
	document.removeEventListener('keydown', disableKeyboardInput);

	  
	(async () => {
		try {
		  const { word: fetchedWord, details: fetchedDetails } = await fetchRandomWord();
		  word = fetchedWord;
		  details = fetchedDetails;
		} catch (error) {
		  console.error('Error fetching random word:', error.message);
		}
	  })();
	  
	


  }






  
  myDiv.classList.remove('disabled-div');
  game.classList.remove('disabled-div');
  keyboardInput = true;

const convertToKurdishWord = (number) => {
	const wordMap = {
		0: 'یەکەم',
		1: 'دووەم',
		2: 'سێیەم',
		3: 'چوارەم',
		4: 'پێنجەم',
		5: 'شەشەم',
	};

	return wordMap[number] || number.toString();
	setTimeout(() => {
		winnerDiv.style.animationPlayState = 'running';
	}, 100);

	setTimeout(() => {
		winnerDiv.style.display = 'none';
	}, 5000);
};



const displaySuccessMessage = (msg) => {
	if (isDisplayingMessage) {
		return; // Exit the function if a message is currently being displayed
	}

	isDisplayingMessage = false;
	const messageElement = document.createElement('p');
	messageElement.textContent = msg;
	messageElement.style.color = 'white'; // Set the text color to black (or any other desired color)
	messageElement.style.fontSize = 'px'; // Set the font size (adjust as needed)
	messageDisplay.append(messageElement);

	setTimeout(() => {
		messageDisplay.removeChild(messageElement);
		isDisplayingMessage = false;
	}, 3000);
};

function toggleDropdown(event) {
    var dropdown = event.target.parentNode;
    dropdown.classList.toggle("show");
  }

  // Close the dropdown when the user clicks outside of it
  document.addEventListener("click", function(event) {
    var dropdowns = document.getElementsByClassName("dropdown");
    for (var i = 0; i < dropdowns.length; i++) {
      var dropdown = dropdowns[i];
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("show");
      }
    }
  });


function playSuccessSound() {
	var successAudio = document.getElementById("success-audio");
	successAudio.play();
  }
  
  // Call playSuccessSound() after a 2-second delay
  function playLoseSound() {
    var loseAudio = document.getElementById("lose-audio");
    loseAudio.play();
  }

  // Call playSuccessSound() after a 2-second delay
  function playFlipSound() {
    var flipAudio = document.getElementById("flip-audio");
    flipAudio.volume = 0.1; // Adjust the volume level (0.0 to 1.0)
    flipAudio.currentTime = 0; // Reset the audio to the beginning
    flipAudio.play();
  }

  function playGreenSound() {
    var Audio = document.getElementById("green-audio");
    Audio.volume = 0.05; // Adjust the volume level (0.0 to 1.0)
    Audio.currentTime = 0; // Reset the audio to the beginning
    Audio.play();
  }

  function playAgainSound() {
    var Audio = document.getElementById("again-audio");
    Audio.volume = 0.2; // Adjust the volume level (0.0 to 1.0)
    Audio.currentTime = 0; // Reset the audio to the beginning
    Audio.play();
  }

  function playClickSound() {
    var Audio = document.getElementById("click-audio");
    Audio.volume = 0.08; // Adjust the volume level (0.0 to 1.0)
    Audio.currentTime = 0; // Reset the audio to the beginning
    Audio.play();
  }

  function playButtonSound() {
    var Audio = document.getElementById("button-audio");
    Audio.volume = 0.08; // Adjust the volume level (0.0 to 1.0)
    Audio.currentTime = 0; // Reset the audio to the beginning
    Audio.play();
  }

  function playTipSound() {
    var Audio = document.getElementById("tip-audio");
    Audio.volume = 0.1 // Adjust the volume level (0.0 to 1.0)
    Audio.currentTime = 0; // Reset the audio to the beginning
    Audio.play();
  }

  function 		playNoTipSound()  {
    var Audio = document.getElementById("notip-audio");
    Audio.volume = 0.1; // Adjust the volume level (0.0 to 1.0)
    Audio.currentTime = 0; // Reset the audio to the beginning
    Audio.play();
  }


  

  function playBackgroundMusic() {
	var toggleButton = document.getElementById("toggleMusic");
	if (toggleButton.checked) {
	  var backgroundMusic = document.getElementById("background-music");
	  backgroundMusic.volume = 0.15; // Adjust the volume level (0.0 to 1.0)
	  backgroundMusic.play();
	}
  }
  
  var backgroundMusic = document.getElementById("background-music");

  function toggleMusic() {
	playClickSound()
	var toggleButton = document.getElementById("toggleMusic");
  
	if (toggleButton.checked) {
	  // Enable background music
	  backgroundMusic.muted = false;
	  playBackgroundMusic();
	} else {
	  // Disable background music
	  backgroundMusic.muted = true;
	  backgroundMusic.pause();
	}
  }
  
  function toggleSfx() {
	playClickSound()
	var toggleButton = document.getElementById("toggleSfx");
	var audioElements = document.querySelectorAll("audio");
  
	if (toggleButton.checked) {
	  // Enable sound effects
	  audioElements.forEach(function(audio) {
		if (audio.id !== "background-music") {
		  audio.muted = false;
		}
	  });
	} else {
	  // Disable sound effects
	  audioElements.forEach(function(audio) {
		if (audio.id !== "background-music") {
		  audio.muted = true;
		}
	  });
	}
  }
  
  // Event listeners for toggle switch changes
  document.getElementById("toggleMusic").addEventListener("change", toggleMusic);
  document.getElementById("toggleSfx").addEventListener("change", toggleSfx);
  
  // Play the background music initially
  


  // Function to set a cookie with a given name, value, and expiration date
function setCookie(name, value, days) {
	var expires = "";
	if (days) {
	  var date = new Date();
	  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	  expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  
  // Function to get the value of a cookie by its name
  function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') c = c.substring(1, c.length);
	  if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
  }

  function checkUserStatus() {
	var firstTimePlayerCookie = getCookie("firstTimePlayer");
	var gameCounterCookie = getCookie("gameCounter");
	
	if (firstTimePlayerCookie === null) {
	  // New player, set the firstTimePlayer cookie and initialize the game counter
	  setCookie("firstTimePlayer", "true", 365);
	  setCookie("gameCounter", "0", 365);
	  return "newPlayer";
	} else {
	  if (gameCounterCookie === null) {
		// Returning player without a game counter, initialize the game counter
		setCookie("gameCounter", "0", 365);
	  }
	  return "returningPlayer";
	}
  }
  
  // Function to increment the game counter
  function incrementGameCounter() {
	var gameCounterCookie = getCookie("gameCounter");
	
	if (gameCounterCookie !== null) {
	  var gameCounter = parseInt(gameCounterCookie, 10);
	  setCookie("gameCounter", (gameCounter + 1).toString(), 365);
	}
  }
  
  // Function to handle the toggle state change
  function handleToggleChange(toggleId) {
	var toggle = document.getElementById(toggleId);
	setCookie(toggleId, toggle.checked, 365); // Store the toggle state in a cookie for 1 year
  }
  
  // Function to initialize the toggle states from cookies
  function initializeToggleStates() {
	var toggles = document.getElementsByClassName("toggle2");
	for (var i = 0; i < toggles.length; i++) {
	  var toggle = toggles[i];
	  var toggleId = toggle.getAttribute("id");
	  var toggleState = getCookie(toggleId);
	  if (toggleState !== null) {
		toggle.checked = toggleState === "true";
	  }
	}
  


	var userStatus = checkUserStatus();
	if (userStatus === "newPlayer") {
	  showPopup();
	} else if (userStatus === "returningPlayer") {
	  showLevel();
	}
	
	applySfxSettings();
  }
  
  
  // Call the initializeToggleStates function when the page is loaded

  function applySfxSettings() {
	var toggleButton = document.getElementById("toggleSfx");
	var audioElements = document.querySelectorAll("audio");
  
	if (toggleButton.checked) {
	  // Enable sound effects
	  audioElements.forEach(function (audio) {
		if (audio.id !== "background-music") {
		  audio.muted = false;
		}
	  });
	} else {
	  // Disable sound effects
	  audioElements.forEach(function (audio) {
		if (audio.id !== "background-music") {
		  audio.muted = true;
		}
	  });
	}
  }


	// Function to get the value of the game counter from the cookie
	function getGameCounter() {
		var gameCounterCookie = getCookie("gameCounter");
		
		if (gameCounterCookie !== null) {
		  return parseInt(gameCounterCookie, 10);
		}
		
		return 0; // Default value if the cookie is not found
	  }

	  function animateLogo() {
		var titleElement = document.getElementById('title');
		titleElement.classList.add('logo-animation');
	  }
