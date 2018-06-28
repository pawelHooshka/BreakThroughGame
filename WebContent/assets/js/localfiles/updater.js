
define(function() {
	var model = null;
	var interval = 10;
	
	var refreshIntervalId = null;
	var paddleMoving = false;
	
	var eventReceiver = null;
	
	var isPointInCirlce = function (point_x, point_y, circle_x, circle_y) {
		//alert("Ola !!!!! " + point_x + ", y: " + point_y + ", circle x: " + cricle_x + ", circle y: " + circle_y);
		var a1 = (point_x - circle_x);
		var b1 = (point_y - circle_y);
		var a = Math.pow(a1, 2);
		var b = Math.pow(b1, 2);
		var c = Math.pow(model.getBallRadius(), 2);
		return ((a+b) < c);
	}
	
	var adjustXSpeed = function () {
		var dv = 1;
		var dx_max = model.getMaxDx();
		var dx = model.getDX();
		if (paddleMoving && model.isPaddleMovedLeft()) {
			model.setDX(dx - dv);
			if (dx <= -dx_max) {
				model.setDX(-dx_max);
			}
		} else if (paddleMoving && model.isPaddleMovedRight()) {
			model.setDX(dx + dv);
			if (dx >= dx_max) {
				model.setDX(dx_max);
			}
		}
	}
	
	var doPaddleCollision = function () {
		var paddleX = model.getPaddleX();
		var paddleY = model.getPaddleY();
		var paddle_x_edge_x = model.getPaddle_x_edge_x(paddleX);
		var paddle_x_edge_y = model.getPaddle_x_edge_y(paddleY);
		var paddleWidth = model.getPaddleWidth();
		var paddleHeight = model.getPaddleHeight();
		var radius = model.getBallRadius();
		var x = model.ball_x();
		var y = model.ball_y();
		var dx = model.getDX();
		var dy = model.getDY();
		//alert("paddle x edge x: " + paddle_x_edge.x + ", y: " + paddle_x_edge.y + ", width: " + paddleWidth);
		if(x > paddle_x_edge_x && x < paddle_x_edge_x+paddleWidth && y+dy > paddle_x_edge_y-radius) {
			model.setDY(-dy);
			adjustXSpeed();
		} else if ((y+dy > paddle_x_edge_y-radius) 
				&& ((isPointInCirlce(paddle_x_edge_x,paddle_x_edge_y,x,y) && x < paddle_x_edge_x) 
						|| ((isPointInCirlce(paddle_x_edge_x+paddleWidth,paddle_x_edge_y,x,y) && x > (paddle_x_edge_x + paddleWidth))))) {
			model.setDY(-dy);
			model.setDX(-dx);
			adjustXSpeed();
		}
	}

	var doBrickCollision = function () {
		var radius = model.getBallRadius();
		var x = model.ball_x();
		var y = model.ball_y();
		var dx = model.getDX();
		var dy = model.getDY();
		var brickWidth = model.getBrickWidth();
		var brickHeight = model.getBrickHeight();
		var bricks = model.getBricks();
		var x_edges = model.getX_edges()
		
		var bricksLength = bricks.length;
		for (var i = 0; i < bricksLength; i++) {
			var b = bricks[i];
			if (b.state != 1) {
				continue;
			}
			var bx = x_edges[b.edgeTop].x;
			var by = x_edges[b.edgeTop].y;
			var bx2 = bx + brickWidth;
			var by2 = by + brickHeight;
			if(y<by && (y+dy>by-radius) && (y+dy<by2-radius) && x > bx && x < bx+brickWidth) {
				//alert("Bricks number is: " + bricksLength + " and i is: " + i + ", bx: " + bx + ", by: " + by + ", status: " + b.state + ", x: " + x + ", y: " + y);
				model.setDY(-dy);
				model.setBrickState(i,0);
			} else if (y>by && ((y+dy)-radius)<by2 && ((y+dy)-radius)>by && x > bx && x < bx+brickWidth) {
				model.setDY(-dy);
				model.setBrickState(i,0);
			}
			if (x<bx && (x+dx+radius>bx) && ((x+dx)-radius)<bx2 && (y>=by && y<=by+brickHeight)) {
				model.setDX(-dx);
				model.setBrickState(i,0);
			} else if (x>bx2 && (x+dx)-radius<bx2 && (x+dx)-radius>bx && (y>=by && y<=by+brickHeight)) {
				model.setDX(-dx);
				model.setBrickState(i,0);
			}
		}
	}
	
	var detectCollision = function () {
		var radius = model.getBallRadius();
		var x = model.ball_x();
		var y = model.ball_y();
		var dx = model.getDX();
		var dy = model.getDY();
		//alert("Hey there ! 1234354");
		if(y + dy > model.getCanvas().height-radius) {
			alert("GAME OVER! You will start from beginning!");
	        if (model.getRefreshIntervalId() != null) {
	        	
	        	clearInterval(model.getRefreshIntervalId());
	        }
		    document.location.reload();
			//dy = -dy;
		}
		if(x + dx > model.getCanvas().width-radius || x + dx < radius) {
			model.setDX(-dx);
		} else {
			doPaddleCollision();
			doBrickCollision();
		} 
		if(y + dy < radius) {
			model.setDY(-dy);
		} else {
			doPaddleCollision();
			doBrickCollision();
		}
	}
	
	var animateBall = function () {
		var x = model.ball_x();
		var y = model.ball_y();
		var dx = model.getDX();
		var dy = model.getDY();
		
		detectCollision();
		model.set_ball_x(x + dx);
		model.set_ball_y(y + dy);
	}
	
	var movePaddle = function () {
		if(model.isPaddleMovedRight() && model.getPaddleX() < model.getCanvas().width-model.getPaddleWidth()) {
			var paddleX = model.getPaddleX();
			var paddleDx = model.getPaddleDx();
			model.setPaddleX(paddleX + paddleDx);
		}
		else if(model.isPaddleMovedLeft() && model.getPaddleX() > 0) {
			var paddleX = model.getPaddleX();
			var paddleDx = model.getPaddleDx();
			model.setPaddleX(paddleX - paddleDx);
		}
		model.registerPaddle();
	}
	
	var createBricks = function () {
		model.createBricks();
	}
	
	var endPlaySegment = function () {
		model.newState();
	}
	
	var play = function () {
		if (model.isGameOn()) {
			createBricks();
			movePaddle();
			animateBall();
			endPlaySegment();
			
			if (eventReceiver != null) {
				eventReceiver.notify();
			}
		} else {
			
		}
	}
	
	function keyDownHandler(e) {
		paddleMoving = true;
    	if(e.keyCode == 39) {
        	model.moveRight(true);
    	}
    	else if(e.keyCode == 37) {
        	model.moveLeft(true);
    	}
	}

	function keyUpHandler(e) {
		paddleMoving = false;
    	if(e.keyCode == 39) {
    		model.moveRight(false);
    	}
    	else if(e.keyCode == 37) {
    		model.moveLeft(false);
    	}
	}
	
	var Methods = {
			
		setEventReceiver: function(receiver) {
			eventReceiver = receiver;
		},
			
	    animate: function(m) {
			model = m;
			if (model && typeof m.getInterval == 'function') {
				interval = m.getInterval();
				
				if (m.getRefreshIntervalId() == null) {
					
					refreshIntervalId = setInterval(play, interval);
					m.setRefreshIntervalId(refreshIntervalId);
				}
			}
		},
			
		stopAnimation: function () {
			clearInterval(refreshIntervalId);
		},
		
		startListen: function () {
			document.addEventListener("keydown", keyDownHandler, false);
			document.addEventListener("keyup", keyUpHandler, false);
		},
		
		stopListening: function () {
			document.removeEventListener('keydown', keyDownHandler, false);
			document.removeEventListener('keyup', keyUpHandler, false);
		}
	};
	
	return Methods;
});