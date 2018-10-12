![image](https://travis-ci.org/Scoombe/wpmTest.svg?branch=master)

# wpmTest
A class for a words per minutes test. 

## installing

npm install wpmtest


## usage
```
import {wordsPerMinTest} from wordsPerMinTest
```
random chars is a bool, true if you want to return to be typing a string of random characters
false if you want to type random words
```
let wpmTest = new wordsPerMinTest(finsishedFunction, minutes, options);
```

## constructor parameters

#### finished function

this is the function that you pass in that will be called after number of minutes has completed.

#### minutes: number

this is the number of minutes for 30 seconds use 0.5 for a 1 minute test use 1.

#### options

this is optional

##### randomChars: string

boolean that if true will have random characters instead of 200 random words. 

##### displayTextLength: number

the amount of characters in the display text, set to 100 by default.

## properties 

#### charPos
is the position in the complete text that the user is on.

#### completeText
is a string containing the whole 200 words / 1000 charecters

#### curDisplayText
is the 100 characters of the complete text from the where the char position is.

#### averageWPM
is the average WPM for the whole all of the completed words

#### lastTenAvWPM
is the average WPM for the last ten words

#### minutes
the amount of minutes the test is running for

## functions

#### restartTest

This is used to restart the test, restarts the stop watch as well resetting all of the text. 

#### updateDisplayText (pos: number)

used to update the display text property from the position

#### calcAverageWPM

used to calculate the total WPM and updates the averageWPM property

#### mostRecentWPM 

used to calculate the total WPM and updates the mostRecentWPM property

#### checkKeyChar (char: char)

used to check if the key is correct 

returns an object:

newWord: bool - if the character is a new word or not  
isCharCorrect: bool - if the character is correct then this is true
errorText: ?string - this returns the character that was supposed to be typed only defined when

