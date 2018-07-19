
import {expect} from 'chai';
import {wordsPerMinTest} from "../src/wordsPerMinTest";

function finishedtest(){};
let wordsTest = new wordsPerMinTest(finishedtest, 0.001);
describe( "Average Words Per Minute Test", function() { 
    it( "should have an correct words per mins", function() {
        // an average of one word per second
        wordsTest.wordTimes = [1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000];
        wordsTest.calcAverageWPM();
        expect(wordsTest.averageWPM).to.equal(60);
        // an average of 75 words per min
        wordsTest.wordTimes = [800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800];
        wordsTest.calcAverageWPM();
        expect(wordsTest.averageWPM).to.equal(75);
        // an average of 50 words per min
        wordsTest.wordTimes = [1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200];
        wordsTest.calcAverageWPM();
        expect(wordsTest.averageWPM).to.equal(50);
    });
    it ("Should average out correctly",function(){
        // Should average out to one word a second
        wordsTest.wordTimes = [1200, 1000, 800];
        wordsTest.calcAverageWPM();
        expect(wordsTest.averageWPM).to.equal(60);
        // should average out as 1061.375 millie seconds to do a word
        // divide by 1000 and divide 60 by the result.
        wordsTest.wordTimes = [1200, 1000, 800, 999, 898, 1299, 1237, 1058];
        wordsTest.calcAverageWPM();
        expect(wordsTest.averageWPM).to.equal(56.53044399952891);
    })
});

describe( "Check Key Char test", function() {
    wordsTest.started = true;
    wordsTest.CompleteText = "aaaaa aaaaa aaaaa "
    it( "should check correct chars", function() {

        let checkKeyCharObj  = wordsTest.checkKeyChar("a");
        expect( checkKeyCharObj.isCharCorrect ).to.be.true;
        expect( checkKeyCharObj.newWord).to.be.false;
    })
    it( "should return error text", function() {
        let checkKeyCharObj = wordsTest.checkKeyChar("b");
        expect( checkKeyCharObj.isCharCorrect ).to.be.false;
        expect( checkKeyCharObj.newWord).to.be.false;
        expect( checkKeyCharObj.errorText).to.equal("a");
        wordsTest.checkKeyChar("a");
        wordsTest.checkKeyChar("a");
        wordsTest.checkKeyChar("a");
        wordsTest.checkKeyChar("a");
        checkKeyCharObj = wordsTest.checkKeyChar("a");
        expect( checkKeyCharObj.isCharCorrect ).to.be.false;
        expect( checkKeyCharObj.newWord).to.be.false;
        expect( checkKeyCharObj.errorText).to.equal("[space]");
    })
    it( "should be a new word", function(done) {
        wordsTest.startStopWatch();
        let checkKeyCharObj = wordsTest.checkKeyChar(" ");
        expect( checkKeyCharObj.isCharCorrect ).to.be.true;
        expect( checkKeyCharObj.newWord).to.be.true;
        expect(wordsTest.wordCount).to.equal(1);
        done();
        wordsTest.finishStopWatch();
    })
   
})

describe ( "random Char tests", function() {
    it ( "should only return chars", function() {
        for (let i; i < 1000; i ++) {
            expect(typeof(wordsTest.randomChar)).to.equal("string");
        }
    });
})

describe ( "generating random Chars", function() {
    it ( "should return a certain number of random chars", function() {
        wordsTest.generateChars(100);
        expect(wordsTest.CompleteText.length).to.equal(100);
    });
    it ( " should have spaces in it ever 5th char from the 6th pos", function() {
        for(let i = 6; i < 100; i += 5)
        {
            expect(wordsTest.CompleteText.slice(i,i+1)).to.equal(" ");
        }       
    });
})

describe ( "generating random words ", function() {
    it ( "should generate 200 words in the complete text", function() {
        wordsTest.generateText();
        expect(wordsTest.CompleteText.split(" ").length).to.equal(200);
    });
    it ( "should have 100 chars in the display text", function() {
        wordsTest.generateText();
        expect(wordsTest.curDisplayText.length).to.equal(100);
    });
    it ( "should only have strings in the complete text", function() {
        wordsTest.CompleteText.split(" ").forEach(word => {
            expect(typeof(word)).to.equal("string");
        });
    });
})

describe ( "constructor tests", function() {
    it ( "should have 1000 random chars in the complete text", function() {
        let newWordTest = new wordsPerMinTest(finishedtest,0.5, true);
        expect(newWordTest.CompleteText.length).to.equal(1000);
    });
    it ( "should have 200 words in the complete text" , function() {
        let newWordTest = new wordsPerMinTest(finishedtest,0.5,false);
        expect(newWordTest.CompleteText.split(" ").length).to.equal(200)
    });
    it ( "should have 200 words in the complete text without specifying the random chars bool" , function() {
        let newWordTest = new wordsPerMinTest(finishedtest,0.5,);
        expect(newWordTest.CompleteText.split(" ").length).to.equal(200)
    });
})

describe ( " most recent wpm tests", function () {
    it( "should have an correct words per mins", function() {
        // an average of one word per second
        wordsTest.wordTimes = [1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000];
        wordsTest.mostRecentWPM();
        expect(wordsTest.lastTenAvWPM).to.equal(60);
        // an average of 75 words per min
        wordsTest.wordTimes = [800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800];
        wordsTest.mostRecentWPM();
        expect(wordsTest.lastTenAvWPM).to.equal(75);
        // an average of 50 words per min
        wordsTest.wordTimes = [1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200];
        wordsTest.mostRecentWPM();
        expect(wordsTest.lastTenAvWPM).to.equal(50);
    });
    it ("Should average out correctly",function(){
        // Should average out to one word a second
        wordsTest.wordTimes = [1200, 1000, 800];
        wordsTest.mostRecentWPM();
        expect(wordsTest.lastTenAvWPM).to.equal(60);
        // should average out as 1061.375 millie seconds to do a word
        // divide by 1000 and divide 60 by the result.
        wordsTest.wordTimes = [1200, 1000, 800, 999, 898, 1299, 1237, 1058];
        wordsTest.mostRecentWPM();
        expect(wordsTest.lastTenAvWPM).to.equal(56.53044399952891);
    })
})

describe ( " highscores are updated ", function () {
    it ( "should check if it's a high score" , function() {
        wordsTest.wordCount = 30;
        expect(wordsTest.checkHighscore()).to.be.true;
        wordsTest.updateHighscore("sam")
        
        wordsTest.wordCount = 60;
        expect(wordsTest.checkHighscore()).to.be.true;
        wordsTest.updateHighscore("sam");
        
        wordsTest.wordCount = 120;
        expect(wordsTest.checkHighscore()).to.be.true;  
        wordsTest.updateHighscore("sam");

        wordsTest.wordCount = 60;
        expect(wordsTest.checkHighscore()).to.be.false;
    })
    it ( " update a highscore " , function() {
        let newWordTest = new wordsPerMinTest(finishedtest,0.5,);
        newWordTest.averageWPM = 120;
        newWordTest.wordCount = 60;
        newWordTest.updateHighscore("sam");
        expect(newWordTest.highscore).to.deep.equal({wpm: 120, averageWPM: 120, name: "sam"});
    })
});