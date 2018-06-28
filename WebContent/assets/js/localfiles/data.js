
define(function(){
	
	var canvas = document.getElementById("gameCanvas");
	var context = canvas.getContext("2d");
	
	var refreshIntervalId = null;
	
	var right = false;
	var left = false;
	
	var gameOn = true;
	
	var brickRowCount = 3;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;
	
	var gameScore = 0;
	var gamesPlayed = 0;
	/*
	 * brickColumnCount, ought to be 5.
	 */
	var brickColumnCount = Math.floor((canvas.width-(brickOffsetLeft*2))/(brickWidth+brickPadding));
	
	var stillactiveBricks = (brickColumnCount+1) * (brickRowCount+1);
	
	var paddleHeight = 10;
	var paddleWidth = 75;
	
	var dx_paddle = 7;
	var paddle_edge_index = 0;
	var paddle_edge_index_west = 0;
	var paddle_edge_index_east = 1;
	
	var paddleMoving = false;
	
	var paddle_x_edge = null;
	var paddle_y_west_edge = null;
	var paddle_y_east_edge = null;
	
	var toleranceX = 1;
	var toleranceY = 2;
	var radius = 10;
	
	var dx = toleranceX;
	var dy = - toleranceY;
	
	var createEdge = function (type_value, x_coord, y_coord, length_value) {
		var obj = new Object();
		obj.type = type_value;
		obj.x = x_coord;
		obj.y = y_coord;
		obj.length = length_value;
		return obj;
	}
	
	var egdeLeftHeight = createEdge("Y", 0, 0, canvas.height);
	var edgeRightHeight = createEdge("Y", canvas.width, 0, canvas.height);
	var edgeTop = createEdge("X", 0, 0, canvas.width);
	var edgeBottom = createEdge("X", 0, canvas.height, canvas.width);
	
	var ballColor = "#F200A2";
	var brickColor = "#0095DD";
	var paddleColor = "#0095DD";
	
	var interval = 10;
	var viewInterval = 5;
	
	var observers = new Array();
	
	var notifyObservers = function () {
		for (var i = 0; i < observers.length; i++) {
			var o = observers[i];
			o.notify();
		}
	}
	
	var makeBrick = function (edgeTopIndex, edgeBottomIndex, edgeLeftIndex, edgeRightIndex) {
		var brickObj = new Object();
		brickObj.edgeTop = edgeTopIndex;
		brickObj.edgeBottom = edgeBottomIndex;
		brickObj.edgeLeft = edgeLeftIndex;
		brickObj.edgeRight = edgeRightIndex;
		brickObj.state = 1;
		return brickObj;
	}
	
	var bricks = new Array();
	var x_edges = new Array();
	var y_edges = new Array();
	var paddleX = (canvas.width-paddleWidth)/2;
	var paddleY = canvas.height-paddleHeight;
	var x = canvas.width/2;
	var y = canvas.height - 30;
	var dx_max = 3 * dx;
	var bricks_top_left_corners = new Array();
	
	var Properties = {
			
		setRefreshIntervalId: function (id) {
			refreshIntervalId = id;
		},
		
		getRefreshIntervalId: function () {
			return refreshIntervalId;
		},
			
		registerVictory: function () {
			gamesPlayed++;
		},
			
		getGamesPlayed: function () {
			return gamesPlayed;
		},
			
		getGameScore: function () {
			return gameScore;
		},
			
		isGameOn: function () {
			return gameOn;
		},
		
		setGameOff: function() {
			gameOn = false;
		},
		
		setGameOn: function () {
			gameOn = true;
		},
		          
		getPaddle_x_edge_x: function (defValue) {
			if (paddle_x_edge) {
				return paddle_x_edge.x;
			} else {
				return defValue;
			}
		},
		
		getPaddle_x_edge_y: function (defValue) {
			if (paddle_x_edge) {
				return paddle_x_edge.y;
			} else {
				return defValue;
			}
		},
		          
	    getPaddleDx: function () {
			return dx_paddle;
		},
		          
		isPaddleMovedLeft: function () {
			return left;
		},
			
		isPaddleMovedRight: function () {
			return right;
		},
			
		moveLeft: function (b) {
			left = b;
		},
			
		moveRight: function (b) {
			right = b;
		},
		
		getMaxDx: function () {
			return dx_max;
		},
			
		getBallRadius: function () {
			return radius;
		},
			
		ball_x: function () {
			return x;
		},
			
		set_ball_x: function (ballX) {
			x = ballX;
		},
			
		ball_y: function () {
			return y;
		},
			
		set_ball_y: function (ballY) {
			y = ballY;
		},
			
		getPaddleColor: function () {
			return paddleColor;
		},
			
		getPaddleWidth: function () {
			return paddleWidth;
		},
			
		setPaddleWidth: function (paddle_w) {
			paddleWidth = paddle_w;
		},
			
		getPaddleHeight: function () {
			return paddleHeight;
		},
			
		setPaddleHeight: function (paddle_h) {
			paddleHeight = paddle_h;
		},
			
		getPaddleX: function () {
			return paddleX;
		},
			
		setPaddleX: function (paddle_x) {
			paddleX = paddle_x;
		},
			
		getPaddleY: function () {
			return paddleY;
		},
			
		setPaddleY: function (paddle_y) {
			paddleY = paddle_y;
		},
			
		getBrickWidth: function () {
			return brickWidth;
		},
			
		getBrickHeight: function () {
			return brickHeight;
		},
			
		getX_edges: function () {
			return x_edges;
		},
		
		getY_edges: function () {
			return y_edges;
		},
		
		getBricks: function () {
			return bricks;
		},
		
		setBrickState: function (index, newstate) {
			bricks[index].state = newstate;
			if (newstate === 0) {
				gameScore++;
				stillactiveBricks--;
			}
		},
		
		newState: function () {
			notifyObservers();
		},
		
		getContext: function () {
			return context;
		},
			
		getCanvas: function () {
			return canvas;
		},
		
		addObserver: function (observer) {
			observers.push(observer);
			observer.observerId = observers.length - 1;
		},
			
		deleteObserver: function (observer) {
			var indexToDelete = observer.observerId;
			observers.splice(indexToDelete,1);
		},
			
		clearObservers: function () {
			observers = null;
			observers = new Array();
		},
			
		brickExists: function (top, bottom, left, right) {
			for (var i = 0;i < bricks.length;i++) {
				var b = bricks[i];
				if (b.edgeTop==top && b.edgeBottom==bottom &&
						b.edgeLeft==left && b.edgeRight==right) {
					return i;
				}
			}
			return -1;
		},
		
		resetBricks: function () {
			for (var i = 0;i < bricks.length;i++) {
				bricks[i].state=1;
			}
			stillactiveBricks = (brickColumnCount+1) * (brickRowCount+1);
			paddleX = (canvas.width-paddleWidth)/2;
			paddleY = canvas.height-paddleHeight;
			x = canvas.width/2;
			y = canvas.height - 30;
		},
			
		isBrickActive: function (brickIndex) {
			if (bricks[brickIndex].state==1) {
				return true;
			} else {
				return false;
			}
		},
		
		registerBricks: function () {
			var x_index_offset = paddle_edge_index + 1;
			var y_index_offset = Math.max(paddle_edge_index_east, paddle_edge_index_west) + 1;
			
			var length1 = bricks_top_left_corners.length;
			/*alert("Current length of array of top left corners is: " + length1);*/
			for (var i = 0; i < length1; i++) {
				var length2 = bricks_top_left_corners[i].length;
				//alert("Current length of array of top left corners at index 0 is: " + length2);
				for (var z = 0; z < length2; z++) {
					var brick_left_top_x = bricks_top_left_corners[i][z].x;
					var brick_left_top_y = bricks_top_left_corners[i][z].y;
					var brickEdgeY1 = createEdge("Y", brick_left_top_x, brick_left_top_y, brickHeight);
					var brickEdgeY2 = createEdge("Y", brick_left_top_x+brickWidth, brick_left_top_y, brickHeight);
					var brickEdgeX1 = createEdge("X", brick_left_top_x, brick_left_top_y, brickWidth);
					var brickEdgeX2 = createEdge("X", brick_left_top_x, brick_left_top_y+brickHeight, brickWidth);
					var indexX1 = x_index_offset;
					x_index_offset++;
					var indexX2 = x_index_offset;
					x_index_offset++;
					var indexY1 = y_index_offset;
					y_index_offset++;
					var indexY2 = y_index_offset;
					y_index_offset++;
					var currentBrickIndex = this.brickExists(indexX1, indexX2, indexY1, indexY2);
					/*
					alert("CURRENT BRICK INDEX: " + currentBrickIndex + ", indexX1: " + indexX1 + ", indexX2: " + indexX2 + 
							" indexY1: " + indexY1 + ", indexY2: " + indexY2);
					*/
					if (currentBrickIndex > -1) {
						if (this.isBrickActive(currentBrickIndex)) {
							x_edges[indexX1] = brickEdgeX1;
							x_edges[indexX2] = brickEdgeX2;
							y_edges[indexY1] = brickEdgeY1;
							y_edges[indexY2] = brickEdgeY2;
						} else {
							x_edges[indexX1] = null;
							x_edges[indexX2] = null;
							y_edges[indexY1] = null;
							y_edges[indexY2] = null;
						}
					} else {
						x_edges[indexX1] = brickEdgeX1;
						x_edges[indexX2] = brickEdgeX2;
						y_edges[indexY1] = brickEdgeY1;
						y_edges[indexY2] = brickEdgeY2;
						bricks.push(makeBrick(indexX1,indexX2,indexY1,indexY2));
					}
				} 
			}
		},
			
		createBricks: function () {
			var lastX = brickOffsetLeft;
			var lastY = brickOffsetTop;
			for (var i = 0; i <= brickRowCount; i++) {
				bricks_top_left_corners[i] = new Array();
				for (var z = 0; z <= brickColumnCount; z++) {
					bricks_top_left_corners[i][z] = {x: lastX, y: lastY};
					lastX += (brickWidth + brickPadding);
				}
				lastY += (brickHeight + brickPadding);
				lastX = brickOffsetLeft;
			}
				
			this.registerBricks();
			//notifyObservers();
			//redrawBricks();
		},
			
		registerPaddle: function () {
			//x_edges[paddle_edge_index] = createEdge("X", paddleX, paddleY, paddleWidth);
			//y_edges[paddle_edge_index_west] = createEdge("Y", paddleX, paddleY, paddleHeight);
			//y_edges[paddle_edge_index_east] = createEdge("Y", paddleX+paddleWidth, paddleY, paddleHeight);
			paddle_x_edge = createEdge("X", paddleX, paddleY, paddleWidth);
			paddle_y_west_edge = createEdge("Y", paddleX, paddleY, paddleHeight);
			paddle_y_east_edge = createEdge("Y", paddleX+paddleWidth, paddleY, paddleHeight);
		},
			
		getDX: function () {
			return dx;
		},
			
		getDY: function () {
			return dy;
		},
			
		setDX: function (value) {
			dx = value;
		},
			
		setDY: function (value) {
			dy = value;
		},
		
		getBrickColor: function () {
			return brickColor;
		},
		
		getBallColor: function () {
			return ballColor;
		},
			
		getInterval: function () {
			return interval;
		},
			
		getViewInterval: function () {
			return viewInterval;
		},
		
		setViewInterval: function (value) {
			viewInterval = value;
		},
		
		isWin: function () {
			return stillactiveBricks <= 0;
		}
	};
	
	return Properties;
});