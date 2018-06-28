/**
 * 
 */
define(['jquery'], function($){
	
	var model = null;
	
	$(document).ready(function() {
	    $("#btn-play").click(function(){
	        model.setGameOn();
	    }); 
	    $("#btn-pause").click(function(){
	        model.setGameOff();
	    }); 
	    $("#btn-stop").click(function(){
	    	model.setGameOff();
	        if (m.getRefreshIntervalId() != null) {
	        	
	        	clearInterval(m.getRefreshIntervalId());
	        }
	        
			alert("Game will restart.");
		    document.location.reload();
	    }); 
	});
	
	var MyMethods = {
		
		setModel: function (m) {
			model = m;
		},
	
		notify: function () {
			
		    $("#score").val(model.getGameScore()); 
		    if (model.isWin()) {
		    	model.registerVictory();
		    }
		    $("#gamesplayed").val(model.getGamesPlayed());
		    if (model.isWin()) {
		    	alert("CONGRATULATIONS! You just won another game!");
		    	model.resetBricks();
		    }
		}
	};
	
	return MyMethods;
});
