import { create } from "domain";

const randomWords = require("random-words");
const timer = require("timer-stopwatch");
export class wordsPerMinTest  {
    // holds the position that the user has got through the words
    charPos :number = 0;
    // the complete text from start to finish
    CompleteText: string = "";
    // the text that is being displayed 100 chars
    curDisplayText: string = "";
    // when the words per min test is finished used for making sure keys aren't checked when it is finished
    done:boolean = false;
    averageWPM: number = 0;
    // the most recent words per minute 
    lastTenAvWPM: number = 0;
    secTimer: number = 0;
    started = false;
    wordCount: number = 0;
    wordTimes:Array<number> = []; 
    highscore = {wpm: 0, averageWPM: 0, name: ""};
    minutes: number = 0;
    stopwatch:any; 
    usingRandomChar:boolean = false; 
    /**
     *@param  {Function} finishedFunction the function that will be called at the end of the stop watch.
     *@param {number} minutes the amount of minutes the test will be for.    
     *@param  {boolean} randomChars? if it is random chars or it is random words.
     */
    constructor(finishedFunction:Function, minutes:number  , randomChars?: boolean) {
        if(randomChars)
        {
            this.usingRandomChar = true;
            this.generateChars(1000);
        }
        else{
            this.generateText();                        
        }
        this.stopwatch = new timer(60000 * minutes, {refreshRateMS:1});
        this.stopwatch.onDone(finishedFunction);
    }
    
   

    timeFunction(time: any) {
        console.log(time.ms)
    }

    startStopWatch() {
        this.started = true;
        this.stopwatch.start();
    }

    finishStopWatch() {
        this.started = false;
        this.stopwatch.stop();
        this.stopwatch.reset();
    }
    
    restartTest () {
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
    generateChars(charLen: number) :void {
        let charString: string= "";
        let stringLength: number = 0;
        while (stringLength != charLen){
            charString += this.randomChar();
            if (stringLength %5 == 0 && stringLength != 0 && stringLength+1 != charLen)
            {
                charString+= " ";
            }
            stringLength = charString.length;
           
        }
        this.CompleteText = charString;
        this.curDisplayText = this.CompleteText.slice(0,100);
    }

    randomChar() :string {
        const charList: Array<string> = ["1","2","3","4","5","6","7","8","9","0","a","b","c","d","e","f","g","h","i","j","k","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","x","y","z","!","\"", "£","$","%","^","&","*",",","(",")",":","@","{","}","#","?",">","<","[","]","/","\\","<",">","\'",";"]
        let randomNum: number = Math.floor((Math.random() * charList.length));
        return charList[randomNum];
    }


    //method for generating random words 
    generateText() :void {
        let randWords: Array<string> = randomWords({exactly:200,maxLength:5});
        this.CompleteText = randWords.join(" ");
        this.curDisplayText = this.CompleteText.slice(0,100);
    }

    // function for getting 1 character
    getCurrentChar():string{
        return this.CompleteText.slice(this.charPos, this.charPos+1);
    }

    

    /**
     * @function:  getting the average time to do 5 chars and then calculating the average words per minute
     * @returns void
     */
    calcAverageWPM() :void {
        let totalTimes: number = 0;
        let count:number = 0;
        this.wordTimes.forEach(time => {
            totalTimes += time;
            count++;
        });
        // average time for a word to be written
        let averageTime:number; 
        averageTime = totalTimes / count;
        this.averageWPM =  60 / (averageTime / 1000) ;
        //calling the mostRecentWPM func
        this.mostRecentWPM();
    }

    /**
     * @function: getting the words per minute from the last 10 words instead of all of the words
     * @returns: void
     */
    mostRecentWPM(): void {
        let totalTimes: number = 0; 
        let count: number = 0; 
        let greaterThan10: Boolean = this.wordTimes.length > 10;
        let startingNum: number =  greaterThan10 ? this.wordTimes.length - 10 : 0;
        for (var i = startingNum; i < this.wordTimes.length; i++) {
            totalTimes += this.wordTimes[i];
        } 
        let averageTime:number;
        averageTime = greaterThan10 ?   totalTimes / 10 :   totalTimes / this.wordTimes.length ;
        this.lastTenAvWPM = 60 / (averageTime / 1000);
    }

    /**
     * @function for checking if the key char is correct
     * @param  {string} keyPressChar
     * @returns {json} ReturnObj: isCharCorrect - bool: newWord - bool: ?errorText - string 
     * 
     * 
     */
    checkKeyChar(keyPressChar :string) :any {
        let currentChar:string = this.getCurrentChar();
        let returnObj :any = {newWord: false,isCharCorrect: false };
        if (this.started) {
            if (currentChar == keyPressChar) {
                if (this.charPos != 0 && this.charPos % 5 == 0) {
                    returnObj.newWord= true;
                    this.wordTimes.push(this.stopwatch.lap());
                    this.calcAverageWPM();
                }
                if (currentChar == " ") {
                    this.wordCount++;
                }
                this.charPos= this.charPos + 1;
                this.curDisplayText = this.CompleteText.slice(this.charPos,this.charPos+100);
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

    checkHighscore() :boolean {
        if (this.wordCount * 2 > this.highscore.wpm) {
            return true;
        }
        else {
            return false;
        } 
    }

    updateHighscore(userName: string) :void {
        const newScore = { name: userName, wpm: this.wordCount* 2, averageWPM: this.averageWPM};
        this.highscore = newScore;
    }

}