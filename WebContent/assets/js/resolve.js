
requirejs.config({
	baseUrl: "assets/js",
	paths: {
		jquery: [
		   '//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min',
		   'lib/jquery'
		],
		underscore: [
		   '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
		   'lib/underscore'
		],
		backbone: [
		   '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min',
		   'lib/backbone'
		],
		game: 'localfiles/game',
		data: 'localfiles/data',
		updater: 'localfiles/updater',
		controllers: 'localfiles/controllers'
	}
});

require(['localfiles/game'], function(game){
	game.play();
});
