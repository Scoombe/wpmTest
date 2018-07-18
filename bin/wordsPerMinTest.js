"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomWords = require("random-words");
const timer = require("timer-stopwatch");
class wordsPerMinTest {
    /**
     *@param  {Function} finishedFunction the function that will be called at the end of the stop watch.
     *@param {number} minutes the amount of minutes the test will be for.
     *@param  {boolean} randomChars? if it is random chars or it is random words.
     */
    constructor(finishedFunction, minutes, randomChars) {
        // holds the position that the user has got through the words
        this.charPos = 0;
        // the complete text from start to finish
        this.CompleteText = "";
        // the text that is being displayed 100 chars
        this.curDisplayText = "";
        // when the words per min test is finished used for making sure keys aren't checked when it is finished
        this.done = false;
        this.averageWPM = 0;
        // the most recent words per minute 
        this.lastTenAvWPM = 0;
        this.secTimer = 0;
        this.started = false;
        this.wordCount = 0;
        this.wordTimes = [];
        this.highscore = { wpm: 0, averageWPM: 0, name: "" };
        this.minutes = 0;
        this.usingRandomChar = false;
        if (randomChars) {
            this.usingRandomChar = true;
            this.generateChars(1000);
        }
        else {
            this.generateText();
        }
        this.stopwatch = new timer(60000 * minutes);
        this.stopwatch.onDone(finishedFunction);
    }
    startStopWatch() {
        this.stopwatch.start();
    }
    finishStopWatch() {
        this.stopwatch.stop();
        this.stopwatch.reset();
    }
    restartTest() {
        this.charPos = 0;
        this.CompleteText = "";
        this.curDisplayText = "";
        this.done = false;
        this.averageWPM = 0;
        this.lastTenAvWPM = 0;
        this.secTimer = 0;
        this.started = false;
        this.wordCount = 0;
        this.wordTimes = [];
        if (this.usingRandomChar) {
            this.generateChars(1000);
        }
        else {
            this.generateText();
        }
    }
    /**
     * @param  {number} charLen length of the char string to create
     * @returns void
     */
    generateChars(charLen) {
        let charString = "";
        let stringLength = 0;
        while (stringLength != charLen) {
            charString += this.randomChar();
            if (stringLength % 5 == 0 && stringLength != 0 && stringLength + 1 != charLen) {
                charString += " ";
            }
            stringLength = charString.length;
        }
        this.CompleteText = charString;
        this.curDisplayText = this.CompleteText.slice(0, 100);
    }
    randomChar() {
        const charList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z", "!", "\"", "£", "$", "%", "^", "&", "*", ",", "(", ")", ":", "@", "{", "}", "#", "?", ">", "<", "[", "]", "/", "\\", "<", ">", "\'", ";"];
        let randomNum = Math.floor((Math.random() * charList.length));
        return charList[randomNum];
    }
    //method for generating random words 
    generateText() {
        let randWords = randomWords({ exactly: 200, maxLength: 5 });
        this.CompleteText = randWords.join(" ");
        this.curDisplayText = this.CompleteText.slice(0, 100);
    }
    // function for getting 1 character
    getCurrentChar() {
        return this.CompleteText.slice(this.charPos, this.charPos + 1);
    }
    /**
     * @function:  getting the average time to do 5 chars and then calculating the average words per minute
     * @returns void
     */
    calcAverageWPM() {
        let totalTimes = 0;
        let count = 0;
        this.wordTimes.forEach(time => {
            totalTimes += time;
            count++;
        });
        // average time for a word to be written
        let averageTime;
        averageTime = totalTimes / count;
        this.averageWPM = 60 / (averageTime / 1000);
        //calling the mostRecentWPM func
        this.mostRecentWPM();
    }
    /**
     * @function: getting the words per minute from the last 10 words instead of all of the words
     * @returns: void
     */
    mostRecentWPM() {
        let totalTimes = 0;
        let count = 0;
        let greaterThan10 = this.wordTimes.length > 10;
        let startingNum = greaterThan10 ? this.wordTimes.length - 10 : 0;
        for (var i = startingNum; i < this.wordTimes.length; i++) {
            totalTimes += this.wordTimes[i];
        }
        let averageTime;
        averageTime = greaterThan10 ? totalTimes / 10 : totalTimes / this.wordTimes.length;
        this.lastTenAvWPM = 60 / (averageTime / 1000);
    }
    /**
     * @function for checking if the key char is correct
     * @param  {string} keyPressChar
     * @returns {json} ReturnObj: isCharCorrect - bool: newWord - bool: ?errorText - string
     *
     *
     */
    checkKeyChar(keyPressChar) {
        let currentChar = this.getCurrentChar();
        let returnObj = { newWord: false, isCharCorrect: false };
        if (this.started) {
            if (currentChar == keyPressChar) {
                if (this.charPos != 0 && this.charPos % 5 == 0) {
                    returnObj.newWord = true;
                    this.wordTimes.push(this.stopwatch.lap);
                    this.calcAverageWPM();
                }
                if (currentChar == " ") {
                    this.wordCount++;
                }
                this.charPos = this.charPos + 1;
                this.curDisplayText = this.CompleteText.slice(this.charPos, this.charPos + 100);
                returnObj.isCharCorrect = true;
            }
            else {
                if (currentChar == " ") {
                    returnObj.errorText = "[space]";
                }
                else {
                    returnObj.errorText = currentChar;
                }
            }
        }
        return returnObj;
    }
    checkHighscore() {
        if (this.wordCount * 2 > this.highscore.wpm) {
            return true;
        }
        else {
            return false;
        }
    }
    updateHighscore(userName) {
        const newScore = { name: userName, wpm: this.wordCount * 2, averageWPM: this.averageWPM };
        this.highscore = newScore;
    }
}
exports.wordsPerMinTest = wordsPerMinTest;
//# sourceMappingURL=wordsPerMinTest.js.map