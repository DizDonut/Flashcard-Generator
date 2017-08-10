function ClozeCard(text, cloze){
  //assign the value of the text key to a new string without the cloze value
  this.text = text.split(cloze);
  this.cloze = cloze;
};//end ClozeCard constructor

function clozeCardProto(){
  this.clozeRemoved = function(){
    //return the new text but replace with '...'
    return `${this.text[0]}...${this.text[1]}`
  }//end clozeRemoved function
};//end proto constructor

ClozeCard.prototype = new clozeCardProto();

module.exports = ClozeCard;
