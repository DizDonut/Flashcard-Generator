var Basic = require("./BasicCard.js");
var Cloze = require("./ClozeCard.js");
var inquirer = require("inquirer");
var colors = require("colors"); // :-)
var bscLib = require("./bsCardLibrary.json");
var clzLib = require("./clzCardLibrary.json");
var fs = require("fs");

var selCard;
var playedCard;
var count = 0;
var correct = 0;
var incorrect = 0;

function menu(){
  inquirer.prompt([
    {
      name:     "options",
      message:  "What would you like to do?",
      type:     "list",
      choices:  ["Use Basic Flash Card", "Use Cloze Flash Card", "Use All", "Random Card", "Create Card", "Exit"]
    }
  ]).then(function(answer){

    switch (answer.options) {
      case "Use Basic Flash Card":
            console.log("Let's begin with the basics...");
            setTimeout(runBasic, 1500);
            break;
      case "Use Cloze Flash Card":
            console.log("Cloze it is...");
            setTimeout(runCloze, 1500);
            break;
      case "Use All":
            console.log("Living dangerously...");
            setTimeout(runAll, 1500);
            break;
      case "Random Card":
            console.log("Shuffling the deck and picking a random card...");
            setTimeout(random, 1500);
            break;
      case "Create Card":
            console.log("Alright, let's create!");
            setTimeout(runCreate, 1500);
            break;
      case "Exit":
            console.log("Goodbye!");
            return;
            break;
      default:
        console.log("");
        console.log("Sorry I don't understand");
        console.log("");
    }//end switch statement
  })//end first prompt .then  function
}//end menu function

menu();

/*
  getQuestion function takes a parameter and will check that param against the type
  found in our json card library.  If Basic, return the front (question).  If Cloze,
  return the removed cloze text question

  @param card = question found in our library, at the index we pass to it
*/
function getQuestion(card){
  if(card.type === "BasicCard"){
    selCard = new Basic(card.front, card.back);
    return selCard.front;
  }else if (card.type === "ClozeCard") {
    selCard = new Cloze(card.text, card.cloze);
    return selCard.clozeRemoved();
  }
}//end getQuestion

/*
  runBasic function assigns the returned value of the getQuestion function to the playedCard
  variable.  Use inquirer to display the value of the playedCard and prompt for an answer
*/
function runBasic(){
  if (count < bscLib.length) {
    playedCard = getQuestion(bscLib[count]);
    inquirer.prompt([
      {
        name: "question\n",
        message: playedCard
      }
    ]).then(function(answer){
        checkAnswer(selCard.back, answer.question);
        count++;
        runBasic();
    })//end .then
  } else {
    endStudy();
  }
}//end runBasic

function runCloze(){
  if(count < clzLib.length){
    playedCard = getQuestion(clzLib[count]);
    inquirer.prompt([
      {
        name: "question",
        message: playedCard
      }
    ]).then(function(answer){
      checkAnswer(selCard.cloze, answer.question);
      count++;
      runCloze();
    })
  } else {
    endStudy();
  }
}//end runCloze function


/*
  checkAnswer function accepts 2 parameters and compares them to determine if they are equal
  If they are, increment the correct variable by 1, otherwise increment the incorrect variable
  by 1.  Display total correct and incorrect values to the user.

  @param cor = value other either the 'back' of the basic card or the 'cloze' key of the cloze card
  @param ans = value of the user answer from the inquirer prompt
*/
function checkAnswer(cor, ans){
  if (ans === cor) {
    correct++;
    console.log(colors.green(`Correct! You got a point!\nTotal Correct: ${correct}\nTotal Incorrect: ${incorrect}`));
  }else {
    incorrect++;
    console.log(colors.red(`Sorry, you missed this one\nTotal Correct: ${correct}\nTotal Incorrect: ${incorrect}`));
  }
}//end checkAnswer

/*
  runAll function essentially duplicates the runBasic and runCloze functions into to
  allowing the user to answer all questions, either basic or cloze, in one sitting
*/
function runAll(){
  if(count < bscLib.length){
    var allBasicCard = getQuestion(bscLib[count])
    inquirer.prompt([
      {
        name: "question",
        message: allBasicCard
      }
    ]).then(function(result){
      checkAnswer(selCard.back, result.question);
      if(count < bscLib.length + clzLib.length)
      var allClzCard = getQuestion(clzLib[count])
      inquirer.prompt([
        {
          name: "question",
          message: allClzCard
        }
      ]).then(function(answer){
        checkAnswer(selCard.cloze, answer.question);
        count++;
        runAll();
      })
    })
  } else {
    endStudy();
  }
}//end runAll function

function random(){
  //generate random number to determine which library to look at for questions
  var randLib = Math.floor(Math.random() * 2);
  if(randLib === 1){
    var library = bscLib;
  }else {
    var library = clzLib;
  }

  //generate random number based on size of the 'library' variable
  //will use for our index search
  var randInd = Math.floor(Math.random() * (library.length - 1));

  //just loop through 1 time for the random question
  if(count < 1){
    playedCard = getQuestion(library[randInd]);
    inquirer.prompt([
      {
        name: "question",
        message: playedCard
      }
    ]).then(function(answer){
      count++;
      if (randLib === 1) {
        checkAnswer(selCard.back, answer.question)
      }else {
        checkAnswer(selCard.cloze, answer.question)
      }
      random();
    })
  } else {
    endStudy();
  }
}//end random function

function runCreate(){
  inquirer.prompt([
    {
      type: "list",
      message: "What type of card would you like to create?",
      choices: ["Basic", "Cloze"],
      name: "type"
    }
  ]).then(function(result){
    var cardType = result.type;

    if(cardType === "Basic"){
      inquirer.prompt([
        {
          type: "input",
          message: "Enter your question:",
          name: "front"
        },
        {
          type: "input",
          message: "Now for the answer...",
          name: "back"
        }
      ]).then(function(cardResult){
        //create new basic object
        var cardObj = {
          type: "BasicCard",
          front: cardResult.front,
          back: cardResult.back
        };

        //push that object to our 'json basic library' array
        bscLib.push(cardObj);

        //write the new array to the json file
        fs.writeFile("bsCardLibrary.json", JSON.stringify(bscLib, null, 2))

        //prompt for another card
        inquirer.prompt([
          {
            type: "list",
            message: "Another card?",
            choices: ["Yes", "No"],
            name: "choice"
          }
        ]).then(function(response){
          if (response.choice === "Yes") {
            runCreate();
          } else {
            setTimeout(menu, 1500);
          }
        }) //end .then for another card prompt
      }) //end .then for card choice prompt
    } else {
      inquirer.prompt([
        {
          type: "input",
          message: "Enter the full text: ",
          name: "text"
        },
        {
          type: "input",
          message: "Enter your cloze statement here: ",
          name: "cloze"
        }
      ]).then(function(clzAns){
        //create new cloze object
        var cardObj = {
          type: "ClozeCard",
          text: clzAns.text,
          cloze: clzAns.cloze,
        };

        //need to test if the cloze statement actually matches something in the
        //full text.  If so, push to the array, if not, exit to the menu
        if (cardObj.text.indexOf(cardObj.cloze) !== -1) {
          //push new close object to the 'json cloze library' array
          clzLib.push(cardObj);
          fs.writeFile("clzCardLibrary.json", JSON.stringify(clzLib, null, 2));
        } else {
          console.log("Your cloze statement must match some words of the full text");
          setTimeout(menu, 1500);
        }

        //prompt for another card
        inquirer.prompt([
          {
            type: "list",
            message: "Another card?",
            choices: ["Yes", "No"],
            name: "choice"
          }
        ]).then(function(response){
          if (response.choice === "Yes") {
            runCreate();
          } else {
            setTimeout(menu, 1500);
          }
        }) //end .then for another card prompt
      }) //end .then for cloze choice
    } //end else statement for cloze choice
  }) //end .then to choose between either basic or cloze
} //end create function

/*
  endStudy functions displays a simple message, resets the count to 0 and
  calls the menu function
*/
function endStudy(){
  if (correct + incorrect === 10) {
    console.log("Study session is over!\n");
    count = 0;
    setTimeout(menu, 1500);
  }
}
