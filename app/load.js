requirejs.config({
	shim : {
		"ko"          : { deps: ['jquery'] },
		"materialize" : { deps: ['jquery'] }
  },
  paths: {
		//core dependencies
    jquery     : "components/jquery/dist/jquery.min",
		ko         : "components/knockout/dist/knockout",
		underscore : "components/underscore/underscore-min",
    sweetAlert : "components/sweetalert/lib/sweet-alert.min",
		hammerjs   : "components/hammerjs/hammer.min",
		velocity   : "components/velocity/velocity.min",
		sammy      : "components/sammy/lib/sammy",
		moment     : "components/moment/moment",
		text       : "lib/text",
		mainPath   : "./",


		//theme dependecies
		materialize : "lib/materialize.amd.min",
  }
});

require(["app"], function(app) {
  app.init();
});
