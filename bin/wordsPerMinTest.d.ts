export interface ICheckKeyCharReturnObj {
    newWord: boolean;
    isCharCorrect: boolean;
    errorText?: string;
}
export declare class wordsPerMinTest {
    charPos: number;
    completeText: string;
    curDisplayText: string;
    done: boolean;
    averageWPM: number;
    lastTenAvWPM: number;
    displayTextLength: number;
    secTimer: number;
    started: boolean;
    wordCount: number;
    wordTimes: number[];
    highscore: {
        wpm: number;
        averageWPM: number;
        name: string;
    };
    stopwatch: any;
    usingRandomChar: boolean;
    minutes: number;
    /**
     *  @param  {Function} finishedFunction the function that will be called at the end of the stop watch.
     *  @param {number} minutes the amount of minutes the test will be for.
     *  @param  {Object} Options: { randomChars?: boolean: if using random chars,
     * displayTestlength: the length of the display test }
     */
    constructor(finishedFunction: () => void, minutes: number, options?: {
        randomChars?: boolean;
        displayTextLength?: number;
    });
    timeFunction(time: any): void;
    startStopWatch(): void;
    finishStopWatch(): void;
    restartTest(): void;
    updateDisplayText(pos: number): void;
    /**
     * @param  {number} charLen length of the char string to create
     * @returns void
     */
    generateChars(charLen: number): void;
    randomChar(): string;
    generateText(): void;
    getCurrentChar(): string;
    /**
     * @function:  getting the average time to do 5 chars and then calculating the average words per minute
     * @returns void
     */
    calcAverageWPM(): void;
    /**
     * @function: getting the words per minute from the last 10 words instead of all of the words
     * @returns: void
     */
    mostRecentWPM(): void;
    /**
     * @function for checking if the key char is correct
     * @param  {string} keyPressChar
     * @returns {json} ReturnObj: isCharCorrect - bool: newWord - bool: ?errorText - string
     */
    checkKeyChar(keyPressChar: string): ICheckKeyCharReturnObj;
    checkHighscore(): boolean;
    updateHighscore(userName: string): void;
}
