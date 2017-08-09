var inquirer = require("inquirer");

var questions = ["Who was the first president of the United States?",
                  "How many Olympic Games have been hosted in Africa?",
                  "How many keys are on most baby grand pianos?",
                  "Who is often referred to as 'the father of scuba diving'?",
                  "What is a baby swan called?",
                  "In which national park would you find the geyser known as 'Old Faithful'?",
                  "Who is credited with inventing the first mechanical computer?",
                  "The art of paper folding is known as what?",
                  "What character is murdered by George in the John Steinbeck novella 'Of Mice and Men'?",
                  "Who is next in line to succeed the President, after the Vice President?"];
var corAnswers = ["George Washington",
                  "0",
                  "88",
                  "Jacques Cousteau",
                  "Cyngnet",
                  "Yellowstone National Park",
                  "Charles Babbage",
                  "Origami",
                  "Lennie",
                  "The Speaker of the House"];
var objects = [];
var correct = 0;
var incorrect = 0;

function BasicCard(front, back, ans){
  this.front = front;
  this.back = back;
  this.ans = ans;
}

BasicCard.prototype.printInfo = function(){
  var newCount = count+1;
  this.checkAnswer();
  console.log("Question " + newCount + ": " + this.front
              + "\nYour Answer: " + this.ans
              + "\nCorrect Answer: " + this.back
              + "\n");
}

BasicCard.prototype.checkAnswer = function(){
    if(this.ans === this.back){
      correct++;
      console.log(`Correct! You got a point!\nTotal Correct: ${correct}\nTotal Incorrect: ${incorrect}`);
    }else {
      incorrect++;
      console.log(`Sorry, you missed this one\nTotal Correct: ${correct}\nTotal Incorrect: ${incorrect}`);
    }
}

var count = 0;

var displayQuestion = function () {
  if (count < 10) {
    inquirer.prompt([
      {
        name: "answer",
        message: questions[count] + "\n",
      }
    ]).then(function(response){
        var basic = new BasicCard(
          questions[count],
          corAnswers[count],
          response.answer
        )
        objects.push(basic);
        objects[count].printInfo();
        count++;
        displayQuestion();
    })//end .then function
  }//end if statement
}; //end displayQuestion function


module.exports = BasicCard;
