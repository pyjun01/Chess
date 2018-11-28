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

	this.onClicked= false;
	this.beforeXY= [];
	this.Canmove= [];
	this.Cango= [];

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
Chess.prototype.WhichPiece = function(Color, Sign, Cx, Cy, isFirst, P) {
	switch(Sign) {
		case "P":
			var isEmpty=false;
			if(this.L[Color=="B"? Cx+1: Cx-1] != undefined && this.L[Color=="B"? Cx+1: Cx-1][Cy] != undefined && this.L[Color=="B"? Cx+1: Cx-1][Cy] == ""){
				var path= this.paths[Color=="B"? P+8: P-8];
				this.Cango.push(path);
				this.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
				this.ctx.fill(path);
				isEmpty= true;
			}
			if(isFirst && isEmpty){
				if(this.L[Color=="B"? Cx+2: Cx-2][Cy] == ""){
					path= this.paths[Color=="B"? P+16: P-16];
					this.Cango.push(path);
					this.ctx.fillStyle= (Cx+2+Cy)%2==0? "#533315": "#f4e4d4";
					this.ctx.fill(path);
				}
			}
			if(this.L[Color=="B"? Cx+1: Cx-1] != undefined && this.L[Color=="B"? Cx+1: Cx-1][Cy-1] != undefined && this.L[Color=="B"? Cx+1: Cx-1][Cy-1]!=""){//왼쪽 공격
				var tg= this.L[Color=="B"? Cx+1: Cx-1][Cy-1].split("@");
				if(Color=="B"? tg[0]=="W": tg[0]=="B"){
					var path= this.paths[Color=="B"? P+7: P-9];
					this.Cango.push(path);
					this.ctx.fillStyle= "#f44";
					this.ctx.fill(path);
				}
			}
			if(this.L[Color=="B"? Cx+1: Cx-1] != undefined && this.L[Color=="B"? Cx+1: Cx-1][Cy+1] != undefined && this.L[Color=="B"? Cx+1: Cx-1][Cy+1]!=""){//오른쪽 공격
				var tg= this.L[Color=="B"? Cx+1: Cx-1][Cy+1].split("@");
				if(Color=="B"? tg[0]=="W": tg[0]=="B"){
					var path= this.paths[Color=="B"? P+9: P-7];
					this.Cango.push(path);
					this.ctx.fillStyle= "#f44";
					this.ctx.fill(path);
				}
			}

			break;
		case "R":
			console.log(Cx*8+Cy);
			for(var i= Cx; i>=0;i--){//Up
				if(i==Cx)continue;
				if(this.L[i][Cy] == ""){
					path= this.paths[i*8+Cy];
					this.Cango.push(path);
					this.ctx.fillStyle= (i+Cy)%2==0? "#533315": "#f4e4d4";
					this.ctx.fill(path);
				}else{
					var for_target=this.L[i][Cy].split("@");
					if(for_target[0]=="W"){
						path= this.paths[i*8+Cy];
						this.Cango.push(path);
						this.ctx.fillStyle= "#f44";
						this.ctx.fill(path);
					}
					break;
				}
			}
			for(var i= Cx; i<8;i++){//Down
				if(i==Cx)continue;
				if(this.L[i][Cy] == ""){
					path= this.paths[i*8+Cy];
					this.Cango.push(path);
					this.ctx.fillStyle= (i+Cy)%2==0? "#533315": "#f4e4d4";
					this.ctx.fill(path);
				}else{
					var for_target=this.L[i][Cy].split("@");
					if(for_target[0]=="W"){
						path= this.paths[i*8+Cy];
						this.Cango.push(path);
						this.ctx.fillStyle= "#f44";
						this.ctx.fill(path);
					}
					break;
				}
			}
			for(var i= Cy; i>=0;i--){//Left
				if(i==Cy)continue;
				if(this.L[Cx][i] == ""){
					path= this.paths[Cx*8+i];
					this.Cango.push(path);
					this.ctx.fillStyle= (Cx+i)%2==0? "#533315": "#f4e4d4";
					this.ctx.fill(path);
				}else{
					var for_target=this.L[Cx][i].split("@");
					if(for_target[0]=="W"){
						path= this.paths[Cx*8+i];
						this.Cango.push(path);
						this.ctx.fillStyle= "#f44";
						this.ctx.fill(path);
					}
					break;
				}
			}
			for(var i= Cy; i<8;i++){//Right
				if(i==Cy)continue;
				if(this.L[Cx][i] == ""){
					path= this.paths[Cx*8+i];
					this.Cango.push(path);
					this.ctx.fillStyle= (Cx+i)%2==0? "#533315": "#f4e4d4";
					this.ctx.fill(path);
				}else{
					var for_target=this.L[Cx][i].split("@");
					if(for_target[0]=="W"){
						path= this.paths[Cx*8+i];
						this.Cango.push(path);
						this.ctx.fillStyle= "#f44";
						this.ctx.fill(path);
					}
					break;
				}
			}
			break;
		case "Kn":
			for(var j=0;j<=1;j++){//Up or Down
				for(var i=-1; i<=1;i=i+2){//Short or Long
					if(this.L[j==0? Cx+2: Cx-2] != undefined && this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i] != undefined){
						if(this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i]!=""){//already piece
							var Kntarget= this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i].split("@");
							if(Kntarget[0]=="W"){
								path= this.paths[(j==0? Cx+2: Cx-2)*8+(j==0? Cy+i: Cy-i)];
								this.Cango.push(path);
								this.ctx.fillStyle= "#f44";
								this.ctx.fill(path);
							}
						}else{//empty
							var path= this.paths[j==0? P+16+i: P-16-i];
							this.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
							this.ctx.fill(path);
						}
						this.Cango.push(path);
					}
				}
				for(var i=-2; i<=2; i=i+4){
					if(this.L[j==0? Cx+1: Cx-1] != undefined && this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i] != undefined){
						if(this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i]!=""){//already piece
							var Kntarget= this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i].split("@");
							if(Kntarget[0]=="W"){
								path= this.paths[(j==0? Cx+1: Cx-1)*8+(j==0? Cy+i: Cy-i)];
								this.Cango.push(path);
								this.ctx.fillStyle= "#f44";
								this.ctx.fill(path);
							}
						}else{//empty
							var path= this.paths[j==0? P+8+i: P-8-i];
							this.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
							this.ctx.fill(path);
						}
						this.Cango.push(path);
					}
				}
			}
			break;
		case "B":
			
			break;
		case "K":
			
			break;
		case "Q":
			
			break;
	}
};
Chess.prototype.First_Click= function (I, L, P, Cx, Cy){
	console.log(this.location);
	var Color= I[0];//기물 색깔
	var Sign= I[1];//기물 종류
	var lo=L[Number(I[2])+1];//px, py, pathidx
	var Px= lo[0];//Board X
	var Py= lo[1];//BOard Y
	var isFirst= lo[2]==P;//첫 움직임인지

	// console.log(L);//x, y, locations
	// console.log(lo);
	if(Color=="B"){//B
		switch(Sign) {
			case "P":
				var isEmpty=false;
				if(this.L[Cx+1] != undefined && this.L[Cx+1][Cy] != undefined && this.L[Cx+1][Cy] == ""){
					var path= this.paths[P+8];
					this.Cango.push(path);
					this.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
					this.ctx.fill(path);
					isEmpty= true;
				}
				if(isFirst && isEmpty){
					if(this.L[Cx+2][Cy] == ""){
						path= this.paths[P+16];
						this.Cango.push(path);
						this.ctx.fillStyle= (Cx+2+Cy)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}
				}
				if(this.L[Cx+1] != undefined && this.L[Cx+1][Cy-1] != undefined && this.L[Cx+1][Cy-1]!=""){//왼쪽 공격
					var tg= this.L[Cx+1][Cy-1].split("@");
					if(tg[0]=="W"){
						var path= this.paths[P+7];
						this.Cango.push(path);
						this.ctx.fillStyle= "#f44";
						this.ctx.fill(path);
					}
				}
				if(this.L[Cx+1] != undefined && this.L[Cx+1][Cy+1] != undefined && this.L[Cx+1][Cy+1]!=""){//오른쪽 공격
					var tg= this.L[Cx+1][Cy+1].split("@");
					if(tg[0]=="W"){
						var path= this.paths[P+9];
						this.Cango.push(path);
						this.ctx.fillStyle= "#f44";
						this.ctx.fill(path);
					}
				}
				break;
			case "R":
				console.log(Cx*8+Cy);
				for(var i= Cx; i>=0;i--){//Up
					if(i==Cx)continue;
					if(this.L[i][Cy] == ""){
						path= this.paths[i*8+Cy];
						this.Cango.push(path);
						this.ctx.fillStyle= (i+Cy)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}else{
						var for_target=this.L[i][Cy].split("@");
						if(for_target[0]=="W"){
							path= this.paths[i*8+Cy];
							this.Cango.push(path);
							this.ctx.fillStyle= "#f44";
							this.ctx.fill(path);
						}
						break;
					}
				}
				for(var i= Cx; i<8;i++){//Down
					if(i==Cx)continue;
					if(this.L[i][Cy] == ""){
						path= this.paths[i*8+Cy];
						this.Cango.push(path);
						this.ctx.fillStyle= (i+Cy)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}else{
						var for_target=this.L[i][Cy].split("@");
						if(for_target[0]=="W"){
							path= this.paths[i*8+Cy];
							this.Cango.push(path);
							this.ctx.fillStyle= "#f44";
							this.ctx.fill(path);
						}
						break;
					}
				}
				for(var i= Cy; i>=0;i--){//Left
					if(i==Cy)continue;
					if(this.L[Cx][i] == ""){
						path= this.paths[Cx*8+i];
						this.Cango.push(path);
						this.ctx.fillStyle= (Cx+i)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}else{
						var for_target=this.L[Cx][i].split("@");
						if(for_target[0]=="W"){
							path= this.paths[Cx*8+i];
							this.Cango.push(path);
							this.ctx.fillStyle= "#f44";
							this.ctx.fill(path);
						}
						break;
					}
				}
				for(var i= Cy; i<8;i++){//Right
					if(i==Cy)continue;
					if(this.L[Cx][i] == ""){
						path= this.paths[Cx*8+i];
						this.Cango.push(path);
						this.ctx.fillStyle= (Cx+i)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}else{
						var for_target=this.L[Cx][i].split("@");
						if(for_target[0]=="W"){
							path= this.paths[Cx*8+i];
							this.Cango.push(path);
							this.ctx.fillStyle= "#f44";
							this.ctx.fill(path);
						}
						break;
					}
				}
				break;
			case "Kn":
				for(var j=0;j<=1;j++){//Up or Down
					for(var i=-1; i<=1;i=i+2){//Short or Long
						if(this.L[j==0? Cx+2: Cx-2] != undefined && this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i] != undefined){
							if(this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i]!=""){//already piece
								var Kntarget= this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i].split("@");
								if(Kntarget[0]=="W"){
									path= this.paths[(j==0? Cx+2: Cx-2)*8+(j==0? Cy+i: Cy-i)];
									this.Cango.push(path);
									this.ctx.fillStyle= "#f44";
									this.ctx.fill(path);
								}
							}else{//empty
								var path= this.paths[j==0? P+16+i: P-16-i];
								this.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
								this.ctx.fill(path);
							}
							this.Cango.push(path);
						}
					}
					for(var i=-2; i<=2; i=i+4){
						if(this.L[j==0? Cx+1: Cx-1] != undefined && this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i] != undefined){
							if(this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i]!=""){//already piece
								var Kntarget= this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i].split("@");
								if(Kntarget[0]=="W"){
									path= this.paths[(j==0? Cx+1: Cx-1)*8+(j==0? Cy+i: Cy-i)];
									this.Cango.push(path);
									this.ctx.fillStyle= "#f44";
									this.ctx.fill(path);
								}
							}else{//empty
								var path= this.paths[j==0? P+8+i: P-8-i];
								this.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
								this.ctx.fill(path);
							}
							this.Cango.push(path);
						}
					}
				}
				break;
			case "B":
				
				break;
			case "K":
				
				break;
			case "Q":
				
				break;
		}
		this.beforeXY=[Cx, Cy];//클릭한 좌표값 넣어줌
		this.onClicked= true;//클릭 true
	}else if(Color=="W"){//W
		switch(Sign) {
			case "P":
				var isEmpty= false;
				if(this.L[Cx-1] != undefined && this.L[Cx-1][Cy] != undefined && this.L[Cx-1][Cy] == ""){
					var path= this.paths[P-8];
					this.Cango.push(path);
					this.ctx.fillStyle= (Cx-1+Cy)%2==0? "#533315": "#f4e4d4";
					this.ctx.fill(path);
					isEmpty= true;
				}
				if(isFirst && isEmpty){
					if(this.L[Cx-2][Cy] == ""){
						path= this.paths[P-16];
						this.Cango.push(path);
						this.ctx.fillStyle= (Cx-2+Cy)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}
				}
				if(this.L[Cx-1] != undefined && this.L[Cx-1][Cy-1] != undefined && this.L[Cx-1][Cy-1]!=""){//왼쪽 공격
					var tg= this.L[Cx-1][Cy-1].split("@");
					if(tg[0]=="B"){
						var path= this.paths[P-9];
						this.Cango.push(path);
						this.ctx.fillStyle= "#f44";
						this.ctx.fill(path);
					}
				}
				if(this.L[Cx-1] != undefined && this.L[Cx-1][Cy+1] != undefined && this.L[Cx-1][Cy+1]!=""){//오른쪽 공격
					var tg= this.L[Cx-1][Cy+1].split("@");
					if(tg[0]=="B"){
						var path= this.paths[P-7];
						this.Cango.push(path);
						this.ctx.fillStyle= "#f44";
						this.ctx.fill(path);
					}
				}
				break;
			case "R":
				console.log(Cx*8+Cy);
				for(var i= Cx; i>=0;i--){//Up
					if(i==Cx)continue;
					if(this.L[i][Cy] == ""){
						path= this.paths[i*8+Cy];
						this.Cango.push(path);
						this.ctx.fillStyle= (i+Cy)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}else{
						var for_target=this.L[i][Cy].split("@");
						if(for_target[0]=="B"){
							path= this.paths[i*8+Cy];
							this.Cango.push(path);
							this.ctx.fillStyle= "#f44";
							this.ctx.fill(path);
						}
						break;
					}
				}
				for(var i= Cx; i<8;i++){//Down
					if(i==Cx)continue;
					if(this.L[i][Cy] == ""){
						path= this.paths[i*8+Cy];
						this.Cango.push(path);
						this.ctx.fillStyle= (i+Cy)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}else{
						var for_target=this.L[i][Cy].split("@");
						if(for_target[0]=="B"){
							path= this.paths[i*8+Cy];
							this.Cango.push(path);
							this.ctx.fillStyle= "#f44";
							this.ctx.fill(path);
						}
						break;
					}
				}
				for(var i= Cy; i>=0;i--){//Left
					if(i==Cy)continue;
					if(this.L[Cx][i] == ""){
						path= this.paths[Cx*8+i];
						this.Cango.push(path);
						this.ctx.fillStyle= (Cx+i)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}else{
						var for_target=this.L[Cx][i].split("@");
						if(for_target[0]=="B"){
							path= this.paths[Cx*8+i];
							this.Cango.push(path);
							this.ctx.fillStyle= "#f44";
							this.ctx.fill(path);
						}
						break;
					}
				}
				for(var i= Cy; i<8;i++){//Right
					if(i==Cy)continue;
					if(this.L[Cx][i] == ""){
						path= this.paths[Cx*8+i];
						this.Cango.push(path);
						this.ctx.fillStyle= (Cx+i)%2==0? "#533315": "#f4e4d4";
						this.ctx.fill(path);
					}else{
						var for_target=this.L[Cx][i].split("@");
						if(for_target[0]=="B"){
							path= this.paths[Cx*8+i];
							this.Cango.push(path);
							this.ctx.fillStyle= "#f44";
							this.ctx.fill(path);
						}
						break;
					}
				}
				break;
			case "Kn":
				for(var j=0;j<=1;j++){//Up or Down
					for(var i=-1; i<=1;i=i+2){//Short or Long
						if(this.L[j==0? Cx+2: Cx-2] != undefined && this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i] != undefined){
							if(this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i]!=""){//already piece
								var Kntarget= this.L[j==0? Cx+2: Cx-2][j==0? Cy+i: Cy-i].split("@");
								if(Kntarget[0]=="B"){
									path= this.paths[(j==0? Cx+2: Cx-2)*8+(j==0? Cy+i: Cy-i)];
									this.Cango.push(path);
									this.ctx.fillStyle= "#f44";
									this.ctx.fill(path);
								}
							}else{//empty
								var path= this.paths[j==0? P+16+i: P-16-i];
								this.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
								this.ctx.fill(path);
							}
							this.Cango.push(path);
						}
					}
					for(var i=-2; i<=2; i=i+4){
						if(this.L[j==0? Cx+1: Cx-1] != undefined && this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i] != undefined){
							if(this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i]!=""){//already piece
								var Kntarget= this.L[j==0? Cx+1: Cx-1][j==0? Cy+i: Cy-i].split("@");
								if(Kntarget[0]=="B"){
									path= this.paths[(j==0? Cx+1: Cx-1)*8+(j==0? Cy+i: Cy-i)];
									this.Cango.push(path);
									this.ctx.fillStyle= "#f44";
									this.ctx.fill(path);
								}
							}else{//empty
								var path= this.paths[j==0? P+8+i: P-8-i];
								this.ctx.fillStyle= (Cx+1+Cy)%2==0? "#533315": "#f4e4d4";
								this.ctx.fill(path);
							}
							this.Cango.push(path);
						}
					}
				}
				break;
			case "B":
				for(var i= 0; i<8;i++){//Up
					if(this.L[Cx+i]!= undefined && this.L[Cx+i][Cy+i] != undefined){
						if(this.L[Cx+i][Cy+i] == ""){
							path= this.paths[(Cx+i)*8+Cy+i];
							this.Cango.push(path);
							this.ctx.fillStyle= (Cx+i+Cy+i)%2==0? "#533315": "#f4e4d4";
							this.ctx.fill(path);
						}else{
							var for_target=this.L[i][Cy].split("@");
							if(for_target[0]=="B"){
								path= this.paths[i*8+Cy];
								this.Cango.push(path);
								this.ctx.fillStyle= "#f44";
								this.ctx.fill(path);
							}
							break;
						}
					}
				}
				// this.L[Cx]
				break;
			case "K":
				
				break;
			case "Q":
				
				break;
		}
		this.beforeXY=[Cx, Cy];//클릭한 좌표값 넣어줌
		this.onClicked= true;//클릭 true
	}
	// this.WhichPiece(Color, Sign, Cx, Cy, isFirst, P);
	this.DrawPiece();
}
Chess.prototype.Second_Click= function (target_info, path_idx, Cx, Cy){
	var Info= this.Canmove.split("@");//color, sign, idx
	var location= this.location[Info[0]][Info[1]];//imgX, imgY, locations
	var tg= location[Number(Info[2])+1];


	// console.log(target_info);//공백이면 빈칸 아니면 기물이 있는칸
	// console.log(path_idx);//클릭한곳의 path에서의 idx
	//0~ 7
	// console.log(Cx);// Board X
	// console.log(Cy);// Board Y
	// console.log(location);
	// console.log(tg);
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

				console.log(self.L[x][y]);
				console.log(`x: ${x}, y: ${y}, i: ${i}`);
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
