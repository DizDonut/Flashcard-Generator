var Basic = require("./BasicCard.js");
// var Cloze = require("./CloseCard.js");
var inquirer = require("inquirer");


inquirer.prompt([
  {
    name:     "choice",
    message:  "What type of flash card would you like to study with?",
    type:     "list",
    choices:  ["Basic Flash Card", "Cloze Flash Card"]
  }
]).then(function(choice){
  // var close = new Cloze();
  if (choice.choice === "Basic Flash Card") {
    displayQuestion();
  }
})
