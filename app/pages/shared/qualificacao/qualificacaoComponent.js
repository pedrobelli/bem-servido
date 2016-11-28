define([], function() {

  var buildStarsArray = function(nota){
    var estrelas = [];

    for(var cont = 1; cont <= 5; cont++) {
      estrelas.push({
        isGrey : nota >= cont ? false : true
      });
    }

    return estrelas;
  };

  return {
    buildStarsArray:buildStarsArray
  }

});
