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
			Q:[200, 0, [this.pW*3, 0, 3, 1]],
			K:[0, 0, [this.pW*4, 0, 4, 1]],
			R:[
				0, 100,
				[0, 0, 0, 1],
				[this.pW*7, 0, 7, 1]
			],
			B:[200, 100, 
				[this.pW*2, 0, 2, 1],
				[this.pW*5, 0, 5, 1]
			],
			Kn:[0, 200, 
				[this.pW*1, 0, 1, 1],
				[this.pW*6, 0, 6, 1],
			],
			P:[200, 200, 
				[0, this.pH*1, 8, 1],
				[this.pW*1, this.pH*1, 9, 1],
				[this.pW*2, this.pH*1, 10, 1],
				[this.pW*3, this.pH*1, 11, 1],
				[this.pW*4, this.pH*1, 12, 1],
				[this.pW*5, this.pH*1, 13, 1],
				[this.pW*6, this.pH*1, 14, 1],
				[this.pW*7, this.pH*1, 15, 1],
			],
		},
		W:{
			Q:[300, 0, [this.pW*3, this.pH*7, 59, 1]],
			K:[100, 0, [this.pW*4, this.pH*7, 60, 1]],
			R:[
				100, 100,
				[0, this.pH*7, 56, 1],
				[this.pW*7, this.pH*7, 63, 1]
			],
			B:[300, 100, 
				[this.pW*2, this.pH*7, 58, 1],
				[this.pW*5, this.pH*7, 61, 1]
			],
			Kn:[100, 200, 
				[this.pW*1, this.pH*7, 57, 1],
				[this.pW*6, this.pH*7, 62, 1],
			],
			P:[300, 200, 
				[0, this.pH*6, 48, 1],
				[this.pW*1, this.pH*6, 49, 1],
				[this.pW*2, this.pH*6, 50, 1],
				[this.pW*3, this.pH*6, 51, 1],
				[this.pW*4, this.pH*6, 52, 1],
				[this.pW*5, this.pH*6, 53, 1],
				[this.pW*6, this.pH*6, 54, 1],
				[this.pW*7, this.pH*6, 55, 1],
			],
		}
	}
	this.L=[
		["B@R@1", "B@Kn@1", "B@B@1", "B@Q@1", "B@K@1", "B@B@2", "B@Kn@2", "B@R@2"],
		["B@P@1", "B@P@2", "B@P@3", "B@P@4", "B@P@5", "B@P@6", "B@P@7", "B@P@8"],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["W@P@1", "W@P@2", "W@P@3", "W@P@4", "W@P@5", "W@P@6", "W@P@7", "W@P@8"],
		["W@R@1", "W@Kn@1", "W@B@1", "W@Q@1", "W@K@1", "W@B@2", "W@Kn@2", "W@R@2"]
	];

	this.Turn= false;
	this.onClicked= false;
	this.beforeXY= [];
	this.Canmove= [];
	this.Cango= [];

	var self= this;
	this.Movement= {
		P: function (Color, Cx, Cy, P, isFirst){
			console.log(isFirst);
			var isEmpty=false;
			var X= Color? Cx+1: Cx-1;
			var pathidx= Color? P+8: P-8;
			if(self.L[X] != undefined && self.L[X][Cy] != undefined && self.L[X][Cy] == ""){
				var path= self.paths[pathidx];
				self.Cango.push(path);
				self.ctx.fillStyle= (X+Cy)%2==0? "#533315": "#f4e4d4";
				self.ctx.fill(path);
				isEmpty= true;
			}
			if(isFirst && isEmpty){
				var fX= Color? Cx+2: Cx-2;
				var fpathidx= Color? P+16: P-16;
				if(self.L[fX][Cy] == ""){
					path= self.paths[fpathidx];
					self.Cango.push(path);
					self.ctx.fillStyle= (fX+Cy)%2==0? "#533315": "#f4e4d4";
					self.ctx.fill(path);
				}
			}
			if(self.L[X] != undefined && self.L[X][Cy-1] != undefined && self.L[X][Cy-1]!=""){//왼쪽 공격
				var tg= self.L[X][Cy-1].split("@");
				if(tg[0]== (Color? "W": "B")){
					var path= self.paths[pathidx-1];
					self.Cango.push(path);
					self.ctx.fillStyle= "#f44";
					self.ctx.fill(path);
				}
			}
			if(self.L[X] != undefined && self.L[X][Cy+1] != undefined && self.L[X][Cy+1]!=""){//오른쪽 공격
				var tg= self.L[X][Cy+1].split("@");
				if(tg[0]== (Color? "W": "B")){
					var path= self.paths[pathidx+1];
					self.Cango.push(path);
					self.ctx.fillStyle= "#f44";
					self.ctx.fill(path);
				}
			}
		},
		R: function (Color, Cx, Cy){
			for(var i= Cx; i>=0;i--){//B Up
				if(i==Cx)continue;
				if(self.L[i][Cy] == ""){
					path= self.paths[i*8+Cy];
					self.Cango.push(path);
					self.ctx.fillStyle= (i+Cy)%2==0? "#533315": "#f4e4d4";
					self.ctx.fill(path);
				}else{
					var for_target=self.L[i][Cy].split("@");
					console.log(for_target[0]);
					console.log(Color? "W": "B");
					if(for_target[0] === (Color? "W": "B")){
						path= self.paths[i*8+Cy];
						self.Cango.push(path);
						self.ctx.fillStyle= "#f44";
						self.ctx.fill(path);
					}
					break;
				}
			}
			for(var i= Cx; i<8;i++){//Down
				if(i==Cx)continue;
				if(self.L[i][Cy] == ""){
					path= self.paths[i*8+Cy];
					self.Cango.push(path);
					self.ctx.fillStyle= (i+Cy)%2==0? "#533315": "#f4e4d4";
					self.ctx.fill(path);
				}else{
					var for_target=self.L[i][Cy].split("@");
					if(for_target[0] === (Color? "W": "B")){
						path= self.paths[i*8+Cy];
						self.Cango.push(path);
						self.ctx.fillStyle= "#f44";
						self.ctx.fill(path);
					}
					break;
				}
			}
			for(var i= Cy; i>=0;i--){//Left
				if(i==Cy)continue;
				if(self.L[Cx][i] == ""){
					path= self.paths[Cx*8+i];
					self.Cango.push(path);
					self.ctx.fillStyle= (Cx+i)%2==0? "#533315": "#f4e4d4";
					self.ctx.fill(path);
				}else{
					var for_target=self.L[Cx][i].split("@");
					if(for_target[0] === (Color? "W": "B")){
						path= self.paths[Cx*8+i];
						self.Cango.push(path);
						self.ctx.fillStyle= "#f44";
						self.ctx.fill(path);
					}
					break;
				}
			}
			for(var i= Cy; i<8;i++){//Right
				if(i==Cy)continue;
				if(self.L[Cx][i] == ""){
					path= self.paths[Cx*8+i];
					self.Cango.push(path);
					self.ctx.fillStyle= (Cx+i)%2==0? "#533315": "#f4e4d4";
					self.ctx.fill(path);
				}else{
					var for_target=self.L[Cx][i].split("@");
					if(for_target[0] === (Color? "W": "B")){
						path= self.paths[Cx*8+i];
						self.Cango.push(path);
						self.ctx.fillStyle= "#f44";
						self.ctx.fill(path);
					}
					break;
				}
			}
		},
		Kn: function (Color, Cx, Cy, P){
			for(var j=0;j<=1;j++){//Up or Down
				for(var i=-1; i<=1;i=i+2){//Short or Long
					if(self.L[j==0? Cx+2: Cx-2] != undefined && self.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i] != undefined){
						if(self.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i]!=""){//already piece
							var Kntarget= self.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i].split("@");
							if(Kntarget[0]==(Color? "W": "B")){
								path= self.paths[(j==0? Cx+2: Cx-2)*8+(j==0? Cy+i: Cy-i)];
								self.Cango.push(path);
								self.ctx.fillStyle= "#f44";
								self.ctx.fill(path);
							}
						}else{//empty
							var path= self.paths[j==0? P+16+i: P-16-i];
							self.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
							self.ctx.fill(path);
						}
						self.Cango.push(path);
					}
				}
				for(var i=-2; i<=2; i=i+4){
					if(self.L[j==0? Cx+1: Cx-1] != undefined && self.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i] != undefined){
						if(self.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i]!=""){//already piece
							var Kntarget= self.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i].split("@");
							if(Kntarget[0]==(Color? "W": "B")){
								path= self.paths[(j==0? Cx+1: Cx-1)*8+(j==0? Cy+i: Cy-i)];
								self.Cango.push(path);
								self.ctx.fillStyle= "#f44";
								self.ctx.fill(path);
							}
						}else{//empty
							var path= self.paths[j==0? P+8+i: P-8-i];
							self.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
							self.ctx.fill(path);
						}
						self.Cango.push(path);
					}
				}
			}
		},
		B: function (Color, Cx, Cy){
			for(var j=0; j<2; j++){
				for(var i= 1; i<8;i++){//Right Bottom
					var y= j==0? Cy+i: Cy-i;
					if(self.L[Cx+i]!= undefined && self.L[Cx+i][y] != undefined){
						if(self.L[Cx+i][y] == ""){
							path= self.paths[(Cx+i)*8+y];
							self.Cango.push(path);
							self.ctx.fillStyle= (Cx+i+y)%2==0? "#533315": "#f4e4d4";
							self.ctx.fill(path);
						}else{
							var for_target=self.L[Cx+i][y].split("@");
							if(for_target[0]==(Color? "W": "B")){
								path= self.paths[(Cx+i)*8+y];
								self.Cango.push(path);
								self.ctx.fillStyle= "#f44";
								self.ctx.fill(path);
							}
							break;
						}
					}
				}
				for(var i= 1; i<8;i++){//Right Bottom
					var y= j==0? Cy+i: Cy-i;
					if(self.L[Cx-i]!= undefined && self.L[Cx-i][y] != undefined){
						if(self.L[Cx-i][y] == ""){
							path= self.paths[(Cx-i)*8+y];
							self.Cango.push(path);
							self.ctx.fillStyle= (Cx-i+y)%2==0? "#533315": "#f4e4d4";
							self.ctx.fill(path);
						}else{
							var for_target=self.L[Cx-i][y].split("@");
							if(for_target[0]==(Color? "W": "B")){
								path= self.paths[(Cx-i)*8+y];
								self.Cango.push(path);
								self.ctx.fillStyle= "#f44";
								self.ctx.fill(path);
							}
							break;
						}
					}
				}
			}
		},
		K: function (Color, Cx, Cy, P){
			for(var i=-1; i<2; i++){//-1 ~ 1
				for(var j=-1; j<2; j++){
					if(i==0 && j==0) continue;
					if(self.L[Cx+i] != undefined && self.L[Cx+i][Cy+j] != undefined){
						if(self.L[Cx+i][Cy+j] == ""){
							var path= self.paths[P+(i*8)+j];
							self.Cango.push(path);
							self.ctx.fillStyle= (Cx+i+Cy+j)%2==0? "#533315": "#f4e4d4";
							self.ctx.fill(path);
						}else{
							var tg= self.L[Cx+i][Cy+j].split("@");
							if(tg[0]==(Color? "W": "B")){
								var path= self.paths[P+(i*8)+j];
								self.Cango.push(path);
								self.ctx.fillStyle= "#f44";
								self.ctx.fill(path);
							}
						}
					}
				}
			}
		},
		Q: function (Color, Cx, Cy){
			this.R(Color, Cx, Cy);
			this.B(Color, Cx, Cy);
		},
	}
	this.init();
}
Chess.prototype.init= function (){
	var self= this;
	this.image.onload= function (){
		self.DrawBoard();
		self.DrawPiece();
		self.eventInit();
	}
	this.image.src= 'chesspiece.png';
};
Chess.prototype.End = function(isBlackWin) {
	var B= document.getElementById("ChessBoard");
	var mask= document.createElement("div");
	mask.classList.add("mask");
	mask.innerText= isBlackWin? "BlackWin": "WhiteWin";
	B.prepend(mask);
};
Chess.prototype.DrawBoard= function (){
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
Chess.prototype.DrawPiece= function (){
	for(var i in chess.location.B){
		var N= chess.location.B[i];
		var I_x= N[0];
		var I_y= N[1];
		for(var j=2; j<N.length;j++){
			if(N[j][3]!=1)  continue;
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
			if(N[j][3]!=1)  continue;
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
Chess.prototype.Display = function() {
	this.Cango=[];
	this.Canmove="";
	this.onClicked= false;
	if(this.location["B"]["K"][2][3]!=1){
		this.End(false);
	}
	if(this.location["W"]["K"][2][3]!=1){
		this.End(true);
	}

	for(var idx in this.paths){//draw Board
		var path= this.paths[idx];
		var x= Math.floor(idx/8);
		var y= idx%8;
		this.ctx.fillStyle= (x+y)%2==0? "#D18B47": "#FFCE9E";
		this.ctx.fill(path);
	}
	for(var i in chess.location.B){//draw black piece
		var N= chess.location.B[i];
		var I_x= N[0];
		var I_y= N[1];
		for(var j=2; j<N.length;j++){
			if(N[j][3]!=1)  continue;
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
	for(var i in chess.location.W){//draw white piece
		var N= chess.location.W[i];
		var I_x= N[0];
		var I_y= N[1];
		for(var j=2; j<N.length;j++){
			if(N[j][3]!=1)  continue;
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
Chess.prototype.First_Click= function (I, L, P, Cx, Cy){
	var Color= I[0];//기물 색깔
	var Sign= I[1];//기물 종류
	var lo=L[Number(I[2])+1];//px, py, pathidx
	var Px= lo[0];//Board X
	var Py= lo[1];//BOard Y
	var isFirst= lo[2]==P;
	if(Color=="B" && this.Turn){
		this.Movement[Sign](true, Cx, Cy, P, isFirst);
		this.beforeXY=[Cx, Cy];
		this.onClicked= true;
	}else if(Color=="W" && !this.Turn){
		this.Movement[Sign](false, Cx, Cy, P, isFirst);
		this.beforeXY=[Cx, Cy];
		this.onClicked= true;
	}
	this.DrawPiece();
}
Chess.prototype.Second_Click= function (target_info, path_idx, Cx, Cy){
	var Info= this.Canmove.split("@");//color, sign, idx
	var location= this.location[Info[0]][Info[1]];//imgX, imgY, locations
	var tg= location[Number(Info[2])+1];
	for(var p of this.Cango){
		if(p==this.paths[path_idx]){
			if(target_info==""){
				tg[0]= Cx*100;
				tg[1]= Cy*100;
				this.L[this.beforeXY[0]][this.beforeXY[1]]= "";
				this.L[Cy][Cx]= this.Canmove;
			}else{
				var remove= target_info.split("@");
				if(remove[0]=="W"){
					this.location["W"][remove[1]][Number(remove[2])+1][3]=0;
					tg[0]= Cx*100;
					tg[1]= Cy*100;
					this.L[this.beforeXY[0]][this.beforeXY[1]]= "";
					this.L[Cy][Cx]= this.Canmove;
				}else if(remove[0]=="B"){
					this.location["B"][remove[1]][Number(remove[2])+1][3]=0;
					tg[0]= Cx*100;
					tg[1]= Cy*100;
					this.L[this.beforeXY[0]][this.beforeXY[1]]= "";
					this.L[Cy][Cx]= this.Canmove;
				}
			}
			this.Turn= !this.Turn;
			break;
		}
	}
	this.Display();
}
Chess.prototype.eventInit = function (){
	var self= this;
	canvas.addEventListener("click", function (e){
		var rect= this.getBoundingClientRect();
		var x= e.pageX - rect.left;
		var y= e.pageY - rect.top;
		for(var i= 0;i<self.paths.length;i++){
			if(self.ctx.isPointInPath(self.paths[i], x, y)){
				var x= Math.floor(i/8);
				var y= i%8;
				if(self.onClicked){
					self.Second_Click(self.L[x][y], i, y, x)
				}else{
					if(self.L[x][y]=="") return false;
					self.Canmove= self.L[x][y];
					var Info= self.L[x][y].split("@");//color, sign, idx
					var location= self.location[Info[0]][Info[1]];//imgX, imgY, locations
					self.First_Click(Info, location, i, x, y);
				}
			}
		}
	});
};