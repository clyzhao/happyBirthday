var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 728;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

const endTime = new Date(2015,8,21,19,13,00);

var curShowTimeSeconds = 0;
var balls = [];

const colors = ['#33B5e5', '#0099cc', '#aa66cc', '#9933cc', '#99cc00', '#669900', '#ffbb33', '#ff8800', '#ff4444', '#cc0000'];


window.onload = function(){

	WINDOW_WIDTH = document.documentElement.clientWidth;
	WINDOW_HEIGHT = document.documentElement.clientHeight;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/100000);
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 90) - 1;
	MARGIN_TOP = Math.round(WINDOW_HEIGHT / 3);

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var pageContain = document.getElementById('pageContain');

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;
	curShowTimeSeconds = getCurrentShowTimeSeconds();
	var interval =  setInterval(
		function(){
			render(context);
			update();
			if (curShowTimeSeconds == 0) {
				// clearInterval(interval);
				
				setTimeout(clearInterval(interval),
				3000);
				bodyChange();
			};
		},
		50
	);
	

}

function bodyChange(){
	var emb = document.createElement('embed');
	emb.setAttribute('src', 'http://music.163.com/outchain/player?type=2&id=3413895&auto=1&height=66');
	emb.setAttribute('display','none');
	emb.setAttribute('autostart','false');
	emb.setAttribute('loop','true');
	emb.setAttribute('allowNetworking', 'all');
	

	// var iframe = document.createElement('iframe');
	// iframe.setAttribute('src', 'http://music.163.com/style/swf/widget.swf?sid=34586075&type=2&auto=1&width=320&height=66');
	// iframe.setAttribute('display','none');
	// iframe.setAttribute('autostart','true');
	// iframe.setAttribute('loop','true');
	// iframe.setAttribute('allowNetworking', 'all');

	// var audi = document.createElement('audio');
	// audi.setAttribute('src', 'http://music.163.com/style/swf/widget.swf?sid=34586075&type=2&auto=1&width=320&height=66');
	// audi.setAttribute('display','none');
	// audi.setAttribute('autoplay','autoplay');
	// audi.setAttribute('preload', 'preload');
	// audi.setAttribute('loop','loop');

	canvas.parentNode.appendChild(emb);
	canvas.parentNode.removeChild(canvas);
	var runPage = new FullPage({
		id : 'pageContain',
		slideTime : 800,
		continuous : false,
		effect : {
			transform : {
				translate : 'Y',
				scale : [1, 1],
				rotate : [0, 0],
			},
			opacity : [0, 1]
		},
		mode : 'wheel,touch',
		easing : 'ease'
	});
	pageContain.style.display = 'block';
}

function getCurrentShowTimeSeconds(){
	var curTime = new Date();
	var ret = endTime.getTime() - curTime.getTime();
	ret = Math.round(ret/1000);

	return ret >= 0 ? ret : 0;

}

function update(){
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds / 3600);
	var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
	var curSeconds = curShowTimeSeconds % 60;

	if(nextSeconds != curSeconds){
		if(parseInt(curHours/10) != parseInt(nextHours/10)){
			addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours/10));
		}
		if(parseInt(curHours%10) != parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
		}

		if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
			addBalls(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes/10));
		}
		if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
			addBalls(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes%10));
		}

		if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
			addBalls(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds/10));
		}
		if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
			addBalls(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds%10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;
	}

	updateBalls();
}

function updateBalls(){
	var ballNum = balls.length;
	for(var i=0; i<ballNum; i++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy * 0.7;
		}
	}

	var cnt = 0;
	for(var i=0; i<ballNum; i++){
		if(balls[i].x+RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
			balls[cnt++] = balls[i];
		}
	}

	while(balls.length > Math.min(300, cnt)){
		balls.pop();
	}
}

function addBalls(x, y, num){
	for(var i=0,row=digit[num].length; i<row; i++){
		for(var j=0,col=digit[num][i].length; j<col; j++){
			if(digit[num][i][j] == 1){
				var aBall = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1, Math.ceil(Math.random()*1000))*2,
					vy:-5,
					color: colors[Math.floor(Math.random()*colors.length)]
				}

				balls.push(aBall);
			}
		}
	}
}

function render(cxt){

	cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds = curShowTimeSeconds % 60;

	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt);
	renderDigit(MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), cxt);
	renderDigit(MARGIN_LEFT+30*(RADIUS+1), MARGIN_TOP, 10, cxt);
	renderDigit(MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cxt);
	renderDigit(MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), cxt);
	renderDigit(MARGIN_LEFT+69*(RADIUS+1), MARGIN_TOP, 10, cxt);
	renderDigit(MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), cxt);
	renderDigit(MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), cxt);

	for(var i=0; i<balls.length; i++){
		cxt.fillStyle = balls[i].color;

		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI, true);
		cxt.closePath();

		cxt.fill();
	}
}

function renderDigit(x, y, num, cxt){
	// cxt.fillStyle = "rgb(0, 102, 153)";
 	cxt.fillStyle = 'rgb(0, 102, 255)';
	for(var i=0,row=digit[num].length; i<row; i++){
		for(var j=0,col=digit[num][i].length; j<col; j++){
			if(digit[num][i][j] == 1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
				cxt.closePath();

				cxt.fill();
			}
		}
	}
}				