const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getInput(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWord(): string {
    const words: string[] = ["javascript", "programming", "function", "variable", "object", "array", "loop", "condition", "string", "number", "algorithm", "debugging", "syntax", "console", "error", "exception", "module", "package", "framework", "library"];
    return words[getRandomInt(0, words.length - 1)];
}

function displayWord(word: string, guesses: string[]): string {
    let display = "";
    for (let char of word) {
        if (guesses.includes(char)) {
            display += char;
        } else {
            display += "_";
        }
    }
    return display;
}

function provideHint(word: string, guesses: string[], random: boolean = false): string {
    const unguessedLetters: string[] = word.split('').filter(char => !guesses.includes(char));
    if (unguessedLetters.length > 0) {
        const hintLetter: string = random ? unguessedLetters[getRandomInt(0, unguessedLetters.length - 1)] : unguessedLetters[0];
        return `Hint: The word contains the letter '${hintLetter}'`;
    }
    return "No hints available.";
}

async function getLevel(): Promise<number> {
    const level: number = parseInt(await getInput("Enter difficulty level (1 - Easy, 2 - Medium, 3 - Hard): "), 10);
    if (isNaN(level) || level < 1 || level > 3) {
        console.log("Invalid level. Defaulting to Easy.");
        return 1;
    }
    return level;
}

async function getGameMode(): Promise<number> {
    const mode: number = parseInt(await getInput("Select game mode (1 - Classic, 2 - Timed): "), 10);
    if (isNaN(mode) || mode < 1 || mode > 2) {
        console.log("Invalid mode. Defaulting to Classic.");
        return 1;
    }
    return mode;
}

function getMaxAttempts(level: number): number {
    switch (level) {
        case 1:
            return 10;
        case 2:
            return 7;
        case 3:
            return 5;
        default:
            return 6;
    }
}

function displayScore(score: number): void {
    console.log(`Current score: ${score}`);
}

interface Profile {
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
}

function saveProfile(name: string, score: number): void {
    let profiles: { [key: string]: Profile } = {};
    try {
        profiles = JSON.parse(fs.readFileSync('profiles.json', 'utf8'));
    } catch (err) {
    }
    if (!profiles[name]) {
        profiles[name] = { gamesPlayed: 0, gamesWon: 0, totalScore: 0 };
    }
    profiles[name].gamesPlayed++;
    profiles[name].totalScore += score;
    if (score > 0) profiles[name].gamesWon++;
    fs.writeFileSync('profiles.json', JSON.stringify(profiles, null, 2));
}

function displayProfile(name: string): void {
    let profiles: { [key: string]: Profile } = {};
    try {
        profiles = JSON.parse(fs.readFileSync('profiles.json', 'utf8'));
    } catch (err) {
    }
    const profile: Profile = profiles[name] || { gamesPlayed: 0, gamesWon: 0, totalScore: 0 };
    console.log(`Profile: ${name}`);
    console.log(`Games Played: ${profile.gamesPlayed}`);
    console.log(`Games Won: ${profile.gamesWon}`);
    console.log(`Total Score: ${profile.totalScore}`);
}

function displayLeaderboard(): void {
    let profiles: { [key: string]: Profile } = {};
    try {
        profiles = JSON.parse(fs.readFileSync('profiles.json', 'utf8'));
    } catch (err) {
    }
    const leaderboard: [string, Profile][] = Object.entries(profiles)
        .sort(([, a], [, b]) => b.totalScore - a.totalScore)
        .slice(0, 5);

    console.log("Leaderboard:");
    leaderboard.forEach(([name, profile], index) => {
        console.log(`${index + 1}. ${name} - Total Score: ${profile.totalScore}`);
    });
}

async function playTimedGame(): Promise<void> {
    const name: string = await getInput("Enter your name: ");
    const level: number = await getLevel();
    const maxAttempts: number = getMaxAttempts(level);
    const word: string = generateWord();
    let guesses: string[] = [];
    let attempts: number = maxAttempts;
    let guessedWord: string = displayWord(word, guesses);
    let score: number = 0;

    console.log("Welcome to the Timed Word Guessing Game!");
    console.log(`Word: ${guessedWord}`);

    const startTime: number = Date.now();
    const timeLimit: number = 60 * 1000;

    while (attempts > 0 && guessedWord.includes("_")) {
        const elapsedTime: number = Date.now() - startTime;
        if (elapsedTime > timeLimit) {
            console.log("Time's up!");
            break;
        }

        const guess: string = (await getInput("Guess a letter: ")).toLowerCase();

        if (guess.length !== 1 || !/^[a-z]$/.test(guess)) {
            console.log("Please enter a single letter.");
            continue;
        }

        if (guesses.includes(guess)) {
            console.log("You already guessed that letter.");
            continue;
        }

        guesses.push(guess);

        if (word.includes(guess)) {
            console.log("Good guess!");
            score += 10;
        } else {
            console.log("Incorrect guess.");
            attempts--;
        }

        guessedWord = displayWord(word, guesses);
        console.log(`Word: ${guessedWord}`);
        console.log(`Attempts remaining: ${attempts}`);
        console.log(`Elapsed Time: ${(elapsedTime / 1000).toFixed(2)} seconds`);
        displayScore(score);
    }

    if (guessedWord === word) {
        console.log("Congratulations! You guessed the word!");
        score += 50;
    } else {
        console.log(`Game over! The word was "${word}".`);
    }

    displayScore(score);
    saveProfile(name, score);
    displayProfile(name);

    if ((await getInput("Do you want to play again? (yes/no): ")).toLowerCase() === 'yes') {
        await playGame();
    } else {
        console.log("Thank you for playing!");
        rl.close();
    }
}

async function playGame(): Promise<void> {
    const name: string = await getInput("Enter your name: ");
    const gameMode: number = await getGameMode();

    if (gameMode === 2) {
        await playTimedGame();
        return;
    }

    const level: number = await getLevel();
    const maxAttempts: number = getMaxAttempts(level);
    const word: string = generateWord();
    let guesses: string[] = [];
    let attempts: number = maxAttempts;
    let guessedWord: string = displayWord(word, guesses);
    let score: number = 0;

    console.log("Welcome to the Classic Word Guessing Game!");
    console.log(`Word: ${guessedWord}`);
    console.log(provideHint(word, guesses));

    while (attempts > 0 && guessedWord.includes("_")) {
        const guess: string = (await getInput("Guess a letter: ")).toLowerCase();

        if (guess.length !== 1 || !/^[a-z]$/.test(guess)) {
            console.log("Please enter a single letter.");
            continue;
        }

        if (guesses.includes(guess)) {
            console.log("You already guessed that letter.");
            continue;
        }

        guesses.push(guess);

        if (word.includes(guess)) {
            console.log("Good guess!");
            score += 10;
        } else {
            console.log("Incorrect guess.");
            attempts--;
        }

        guessedWord = displayWord(word, guesses);
        console.log(`Word: ${guessedWord}`);
        console.log(`Attempts remaining: ${attempts}`);
        displayScore(score);
    }

    if (guessedWord === word) {
        console.log("Congratulations! You guessed the word!");
        score += 50;
    } else {
        console.log(`Game over! The word was "${word}".`);
    }

    displayScore(score);
    saveProfile(name, score);
    displayProfile(name);

    if ((await getInput("Do you want to play again? (yes/no): ")).toLowerCase() === 'yes') {
        await playGame();
    } else {
        console.log("Thank you for playing!");
        displayLeaderboard();
        rl.close();
    }
}

playGame();
