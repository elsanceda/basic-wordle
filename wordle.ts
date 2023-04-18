// Select a random word and begin game
function start() {
    // List of words
    let url: string = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";

    let url_xhr: XMLHttpRequest = new XMLHttpRequest();
    url_xhr.open('GET', url, true);
    url_xhr.send();
    url_xhr.onload = function () {
        // Randomly choose a word
        const words: string[] = url_xhr.responseText.split("\n");
        const random: number = Math.floor(Math.random() * words.length);
        const word: string = words[random];
        //console.log(word);

        let guess_counter: number = 0;
        let guess_box: HTMLInputElement = document.getElementById('guess') as HTMLInputElement;
        guess_box?.addEventListener('keypress', function (e) {
            guess_counter = wordle(e, word, words, guess_box, guess_counter);
        });
    }
}

// Main game function
function wordle(event: KeyboardEvent, word: string, word_list: string[], guess_box: HTMLInputElement, count: number): number {
    if (event.key === 'Enter') {
        let guess: string = guess_box?.value;

        // Case: guess is not 5 characters long
        if (guess.length !== 5) {
            alert('Your guess must be exactly 5 characters long');
        }
        // Case: guess is not in word list
        else if (!word_list.includes(guess.toLowerCase())) {
            alert('Invalid guess');
        }
        // Case: valid guess
        else {
            guess_box.value = '';

            guess = guess.toUpperCase();
            word = word.toUpperCase();

            let row: Element = document.getElementsByClassName("game-board-row")[count];

            for (let i = 0; i < 5; i++) {
                let curr: string = guess.charAt(i);
                let box: Element = row.children[i];
                let lbletter: HTMLElement = document.getElementById(curr) as HTMLElement;
                
                // Case: letter in word and at exact position
                if (curr === word.charAt(i)) {
                    box.classList.add("correct");

                    if (lbletter.classList.contains("misplaced")) {
                        lbletter.classList.remove("misplaced");
                    }

                    lbletter.classList.add("correct");
                }
                // Case: letter in word but not in exact position
                else if (word.includes(curr)) {
                    box.classList.add("misplaced");

                    if (!lbletter.classList.contains("correct")) {
                        lbletter.classList.add("misplaced");
                    }
                }
                // Case: letter not in word
                else {
                    box.classList.add("incorrect");
                    lbletter.classList.add("incorrect");
                }

                box.classList.remove("empty");
                box.innerHTML += curr;
            }
            
            // Case: correct guess
            if (guess === word) {
                guess_box.disabled = true;
                setTimeout(function() {
                    alert("You guessed correctly!")
                },10);
            }
            // Case: ran out of guesses
            else if (count === 5) {
                guess_box.disabled = true;
                setTimeout(function() {
                    alert("Game Over\nCorrect Answer: " + word)
                },10);
            }

            count += 1;
        }
    }

    return count;
}