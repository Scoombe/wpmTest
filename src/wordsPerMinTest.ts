const randomWords = require("random-words");
const timer = require("timer-stopwatch");

export type ReturnType =  {
    newWord: boolean;
    isCharCorrect: boolean;
    errorText?: string;
};

export class wordsPerMinTest  {
    // holds the position that the user has got through the words
    public charPos: number = 0;
    // the complete text from start to finish
    public completeText: string = "";
    // the text that is being displayed 100 chars
    public curDisplayText: string = "";
    // when the words per min test is finished used for making sure keys aren't checked when it is finished
    public done: boolean = false;
    public averageWPM: number = 0;
    // the most recent words per minute
    public lastTenAvWPM: number = 0;
    public displayTextLength: number = 100;
    public secTimer: number = 0;
    public started = false;
    public wordCount: number = 0;
    public wordTimes: number[] = [];
    public highscore = {wpm: 0, averageWPM: 0, name: ""};
    public stopwatch: any;
    public usingRandomChar: boolean = false;

    /**
     *  @param  {Function} finishedFunction the function that will be called at the end of the stop watch.
     *  @param {number} minutes the amount of minutes the test will be for.
     *  @param  {boolean} randomChars? if it is random chars or it is random words.
     */
    constructor(finishedFunction: () => void,
                minutes: number,
                options?: { randomChars?: boolean, displayTextLength?: number }) {
        if (options !== undefined) {
            options.displayTextLength = options.displayTextLength === undefined ? 100 : options.displayTextLength;
            this.displayTextLength = options.displayTextLength;
            if (options.randomChars) {
                this.usingRandomChar = true;
                this.generateChars(1000);
            } else {
                this.generateText();
            }
        } else {
            this.generateText();
        }
        this.stopwatch = new timer(60000 * minutes, {refreshRateMS: 1});
        this.stopwatch.onDone(finishedFunction);
    }

    public timeFunction(time: any) {
        /* tslint:disable-next-line no-console */
        console.log(time.ms);
    }

    public startStopWatch(): void {
        this.started = true;
        this.stopwatch.start();
    }

    public finishStopWatch(): void {
        this.started = false;
        this.stopwatch.stop();
        this.stopwatch.reset();
    }

    public restartTest(): void {
        this.charPos = 0;
        this.completeText = "";
        this.curDisplayText = "";
        this.done = false;
        this.averageWPM = 0;
        this.lastTenAvWPM = 0;
        this.secTimer = 0;
        this.wordCount = 0;
        this.wordTimes = [];
        this.finishStopWatch();
        if (this.usingRandomChar) {
            this.generateChars(1000);
        } else {
            this.generateText();
        }
    }

    public updateDisplayText( pos: number): void {
        this.curDisplayText = this.completeText.slice(pos, pos + this.displayTextLength);
    }

    /**
     * @param  {number} charLen length of the char string to create
     * @returns void
     */
    public generateChars(charLen: number): void {
        let charString: string = "";
        let stringLength: number = 0;
        while (stringLength !== charLen) {
            charString += this.randomChar();
            if (stringLength % 5 === 0 && stringLength !== 0 && stringLength + 1 !== charLen) {
                charString += " ";
            }
            stringLength = charString.length;

        }
        this.completeText = charString;
        this.updateDisplayText(0);
    }

    public randomChar(): string {
        const charList: string[] = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
            "k", "h", "i", "j", "k", "l", "m", "n", "o", "p",
            "q", "r", "s", "t", "u", "v", "x", "y", "z", "!",
            "\"", "£", "$", "%", "^", "&", "*", ",", "(", ")",
            ":", "@", "{", "}", "#", "?", ">", "<", "[", "]",
            "/", "\\", "<", ">", "\'", ";"];
        const randomNum: number = Math.floor((Math.random() * charList.length));
        return charList[randomNum];
    }

    // method for generating random words
    public generateText(): void {
        const randWords: string[] = randomWords({exactly: 200, maxLength: 5});
        this.completeText = randWords.join(" ");
        this.updateDisplayText(0);
    }

    // function for getting 1 character
    public getCurrentChar(): string {
        return this.completeText.slice(this.charPos, this.charPos + 1);
    }

    /**
     * @function:  getting the average time to do 5 chars and then calculating the average words per minute
     * @returns void
     */
    public calcAverageWPM(): void {
        let totalTimes: number = 0;
        let count: number = 0;
        this.wordTimes.forEach((time) => {
            totalTimes += time;
            count++;
        });
        // average time for a word to be written
        let averageTime: number;
        averageTime = totalTimes / count;
        this.averageWPM =  60 / (averageTime / 1000) ;
        // calling the mostRecentWPM func
        this.mostRecentWPM();
    }

    /**
     * @function: getting the words per minute from the last 10 words instead of all of the words
     * @returns: void
     */
    public mostRecentWPM(): void {
        let totalTimes: number = 0;
        const count: number = 0;
        const greaterThan10: boolean = this.wordTimes.length > 10;
        const startingNum: number =  greaterThan10 ? this.wordTimes.length - 10 : 0;
        for (let i = startingNum; i < this.wordTimes.length; i++) {
            totalTimes += this.wordTimes[i];
        }
        let averageTime: number;
        averageTime = greaterThan10 ?   totalTimes / 10 :   totalTimes / this.wordTimes.length ;
        this.lastTenAvWPM = 60 / (averageTime / 1000);
    }

    /**
     * @function for checking if the key char is correct
     * @param  {string} keyPressChar
     * @returns {json} ReturnObj: isCharCorrect - bool: newWord - bool: ?errorText - string
     */
    public checkKeyChar(keyPressChar: string): ReturnType {
        const currentChar: string = this.getCurrentChar();
        const returnObj: ReturnType = { newWord: false, isCharCorrect: false };
        if (this.started) {
            if (currentChar === keyPressChar) {
                if (this.charPos !== 0 && this.charPos % 5 === 0) {
                    returnObj.newWord = true;
                    this.wordTimes.push(this.stopwatch.lap());
                    this.calcAverageWPM();
                }
                if (currentChar === " ") {
                    this.wordCount++;
                }
                this.charPos = this.charPos + 1;
                this.updateDisplayText(this.charPos);
                returnObj.isCharCorrect = true;
            } else {
                if (currentChar === " ") {
                    returnObj.errorText = "[space]";
                } else {
                    returnObj.errorText = currentChar;
                }
            }
        }
        return returnObj;
    }

    public checkHighscore(): boolean {
        if (this.wordCount * 2 > this.highscore.wpm) {
            return true;
        } else {
            return false;
        }
    }

    public updateHighscore(userName: string): void {
        const newScore = { name: userName, wpm: this.wordCount * 2, averageWPM: this.averageWPM};
        this.highscore = newScore;
    }

}
