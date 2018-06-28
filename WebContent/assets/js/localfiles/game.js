
define(['data', 'updater', 'controllers'], function(model, controller, handlers){
	
	var canvas = model.getCanvas();
	var context = model.getContext();
	
	function redrawBricks() {
		var bricks = model.getBricks();
		var x_edges = model.getX_edges();
		var y_edges = model.getY_edges();
		var brickWidth = model.getBrickWidth();
		var brickHeight = model.getBrickHeight();
		var brickColor = model.getBrickColor();
		for (var i = 0; i < bricks.length; i++) {
			var brickelement = bricks[i];
			var edgeTop = x_edges[brickelement.edgeTop];
			var edgeBottom = x_edges[brickelement.edgeBottom];
			var edgeLeft = y_edges[brickelement.edgeLeft];
			var edgeRight = y_edges[brickelement.edgeRight];
			var state = brickelement.state;
			if (state == 1) {
				context.beginPath();
				context.rect(edgeTop.x, edgeTop.y, brickWidth, brickHeight);
				context.fillStyle = brickColor;
				context.fill();
				context.closePath();
			}
		}
	}
	
	var redrawPaddle = function () {
		var paddleX = model.getPaddleX();
		var paddleY = model.getPaddleY();
		var paddleWidth = model.getPaddleWidth();
		var paddleHeight = model.getPaddleHeight();
		var paddleColor = model.getPaddleColor();
	    context.beginPath();
	    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
	    context.fillStyle = model.getPaddleColor;
	    context.fill();
	    context.closePath();
	}
	
	var redrawBall = function () {
		var radius = model.getBallRadius();
		var ballColor = model.getBallColor();
		var x = model.ball_x();
		var y = model.ball_y();
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI*2, false);
		context.fillStyle = ballColor;
		context.fill();
		context.closePath();
	}
	
	var redraw = function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
		redrawBricks();
		redrawPaddle();
		redrawBall();
	}
	
	var observer = {
		notify: function () {
			redraw();
		}        
	};
	
	var startAnimation = function () {
		handlers.setModel(model);
		controller.setEventReceiver(handlers);
		model.addObserver(observer);
		controller.startListen();
		controller.animate(model);
	}
	
	var stopAnimation = function () {
		model.deleteObserver(observer);
		controller.stopListening();
		controller.stopAnimation();
	}
	
	startAnimation();
});