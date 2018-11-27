function Chess(canvas){
	this.canvas= document.querySelector(canvas);
	this.ctx= this.canvas.getContext("2d");
	this.W= this.canvas.width;
	this.H= this.canvas.height;

	this.pW= this.W/8;// piece width
	this.pH= this.H/8;// piece height

	this.paths= [];
	this.image= new Image();

	this.location={
		B:{
			K:[200, 0, [this.pW*3, 0, 3]],
			Q:[0, 0, [this.pW*4, 0, 4]],
			R:[
				0, 100,
				[0, 0, 0],
				[this.pW*7, 0, 7]
			],
			B:[200, 100, 
				[this.pW*2, 0, 2],
				[this.pW*5, 0, 5]
			],
			Kn:[0, 200, 
				[this.pW*1, 0, 1],
				[this.pW*6, 0, 6],
			],
			P:[200, 200, 
				[0, this.pH*1, 8],
				[this.pW*1, this.pH*1, 9],
				[this.pW*2, this.pH*1, 10],
				[this.pW*3, this.pH*1, 11],
				[this.pW*4, this.pH*1, 12],
				[this.pW*5, this.pH*1, 13],
				[this.pW*6, this.pH*1, 14],
				[this.pW*7, this.pH*1, 15],
			],
		},
		W:{
			K:[300, 0, [this.pW*3, this.pH*7, 59]],
			Q:[100, 0, [this.pW*4, this.pH*7, 60]],
			R:[
				100, 100,
				[0, this.pH*7, 56],
				[this.pW*7, this.pH*7, 63]
			],
			B:[300, 100, 
				[this.pW*2, this.pH*7, 58],
				[this.pW*5, this.pH*7, 61]
			],
			Kn:[100, 200, 
				[this.pW*1, this.pH*7, 57],
				[this.pW*6, this.pH*7, 62],
			],
			P:[300, 200, 
				[0, this.pH*6, 48],
				[this.pW*1, this.pH*6, 49],
				[this.pW*2, this.pH*6, 50],
				[this.pW*3, this.pH*6, 51],
				[this.pW*4, this.pH*6, 52],
				[this.pW*5, this.pH*6, 53],
				[this.pW*6, this.pH*6, 54],
				[this.pW*7, this.pH*6, 55],
			],
		}
	}
	this.M= ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
	console.log(this.location);
	console.log(this.M);
	/*
		var piecepath=[]
		click => get idx
		var a= piecepath[idx]= B@K
		if(a!=""){
			var g= a.split("@")
			g[0] 
			switch(g[1]){
				case "K":
					break;
				case "Q":
					break;
				case "R":
					break;
				case "B":
					break;
				case "Kn":
					break;
				case "P":
					break;
			}
		}
	*/
	this.init();
}
Chess.prototype.init= function (){
	var self= this;
	this.image.onload= function (){
		self.drawBoard();
		self.drawPiece();
		self.eventInit();
	}
	this.image.src= 'chesspiece.png';
};
Chess.prototype.drawBoard= function (){
	for(var i= 0; i< 8; i++) {
		for(var j= 0; j< 8; j++){
			let x= j*this.pW, y= i*this.pH;
			let path= new Path2D();
			path.rect(x, y, this.pW, this.pH);
			this.paths.push(path);

			this.ctx.fillStyle= (j+i)%2==0? "#D18B47": "#FFCE9E";
			this.ctx.fill(path);
		}
	}
};
Chess.prototype.drawPiece= function (){
		for(var i in chess.location.B){
			var N= chess.location.B[i];
			var I_x= N[0];
			var I_y= N[1];
			for(var j=2; j<N.length;j++){
				var P_x= N[j][0];
				var P_y= N[j][1];
				this.ctx.drawImage(
					this.image, 
					I_x, I_y,
					100, 100,
					P_x, P_y,
					this.pW, this.pH
				);
			}
		}
		for(var i in chess.location.W){
			var N= chess.location.W[i];
			var I_x= N[0];
			var I_y= N[1];
			for(var j=2; j<N.length;j++){
				var P_x= N[j][0];
				var P_y= N[j][1];
				this.ctx.drawImage(
					this.image, 
					I_x, I_y,
					100, 100,
					P_x, P_y,
					this.pW, this.pH
				);
			}
		}
};
Chess.prototype.eventInit = function (){
	var self= this;
	canvas.addEventListener("click", function (e){
		var rect= this.getBoundingClientRect();
		var x= e.pageX - rect.left;
		var y= e.pageY - rect.top;
		for(var i= 0;i<self.paths.length;i++){
			if(self.ctx.isPointInPath(self.paths[i], x, y)){
				console.log(i);
			}
		}
	});
};
