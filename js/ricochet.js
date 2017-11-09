function Ricochet(){
    this.b=new Array(
        "5555645555645555",
        "5255553461555525",
        "6755558558555594",
        "5555555555555555",
        "5555552555345552",
        "2555559455852558",
        "8561555225567555",
        "5558556004555555",
        "5555556004555555",
        "5556152885555552",
        "2555867534555258",
        "8555555285556755",
        "5255555945555555",
        "5945555561555525",
        "5553455558555594",
        "5558645555564555");

    this.symbs = new Array(
        [1,2,2,3],
        [6,1,4,6],
        [6,5,3,4],
        [3,6,1,0],
        [9,1,2,6],
        [14,2,4,0],
        [10,4,1,4],
        [12,6,3,3],
        [4,9,4,3],
        [6,10,3,0],
        [1,13,1,6],
        [3,14,2,4],
        [7,12,0,1],
        [8,10,4,4],
        [13,11,3,6],
        [9,13,2,0],
        [14,14,1,3]
    );

    this.robotsPos = new Array(
        [14,13],
        [11,7],
        [2,5],
        [13,6],
        [0,4]
    );
    
    this.SymForm={ 3:'Tri',0:'Circ',4:'Sq',6:'Hex' };
    this.SymColor={0:'White',1:'Red',2:'Green',3:'Blue',4:'Yellow'};
    this.ShortCol={0:'W',1:'R',2:'G',3:'B',4:'Y'};
    this.InvCol={'W':0,'R':1,'G':2,'B':3,'Y':4};
    this.InvColLong={'White':0,'Red':1,'Green':2,'Blue':3,'Yellow':4};

    this.getRID = function(){
        this.robots = 0;
        for(var i=0;i<5;i++){
            for(var j=0;j<2;j++){
                this.robots=(thisrobots*16)+this.robotsPos[i][j];
            }
        }
    }
    
    this.drawTable = function(){
        s="<table>"
        for(var i=0;i<16;i++){
            s+="<tr>";
            for(var j=0;j<16;j++){
                t=this.b[i][j];
                for(var k=0;k<17;k++){
                    if(this.symbs[k][1]==i && this.symbs[k][0]==j){
                        t=t+' Sym'+this.SymColor[this.symbs[k][2]];
                        t=t+' Sym'+this.SymForm[this.symbs[k][3]];
                    }
                }
                if((i==7 || i==8) && (j==7 || j==8)){
                    if(i==7 && j==7)
                    s+='<td id="Cell-'+i.toString(16)+j.toString(16)+'" class="Cell C'+t+'" rowspan=2 colspan=2>';
                }else{
                    s+='<td id="Cell-'+i.toString(16)+j.toString(16)+'" class="Cell C'+t+'">';
                }
                s+='</td>';
            }	
            s+='</tr>';
        }
        document.getElementById("board").innerHTML=s+'</table>';
    }
    
    this.drawSymbols = function(){
        s="<table>";
        for(var i=0;i<this.symbs.length;i++){
            s+='<tr><td class="Cell Sym'+this.SymColor[this.symbs[i][2]]+' Sym'+this.SymForm[this.symbs[i][3]]+'"></td>';
            s+='<td id="SolM-'+(this.symbs[i][2]*10+this.symbs[i][3])+'"></td>';
            s+='<td id="Sol-'+(this.symbs[i][2]*10+this.symbs[i][3])+'"></td>';
            s+='</tr>';
        }	
        s+="</table>";
        document.getElementById("solution").innerHTML=s;
    }
    
    this.showRobots = function(){
        var r= this.robotsPos;
        for(var k=0;k<5;k++){
            var Rx = document.getElementById("rob"+this.SymColor[k]);
            if(Rx) Rx.remove();
            var s='<div id="rob'+this.SymColor[k]+'" class="robot rob'+this.SymColor[k]+'"></div>';
            document.getElementById("Cell-"+r[k][1].toString(16)+r[k][0].toString(16)).innerHTML = s;
        }
        $('.robot').click(function(el){
               cursorRobot(el);
        });
    }
    
    this.Solutions={};
    for(var i=0;i<this.symbs.length;i++){
        this.Solutions[this.symbs[i][2]*10+this.symbs[i][3]]=0;
        
    }
    
    this.MoveRobot=function(k,dir){
		var pos = this.robotsPos[k];
		var x = pos[0];
		var y = pos[1];
		if(dir=='4'){
			for(;x>0 && parseInt(this.b[y][x])%3!=1 && !isRobotHere(this.robotsPos,x-1,pos[1]);x--);
		}else if(dir=='8'){
			for(;y>0 && parseInt(this.b[y][x])<7 && !isRobotHere(this.robotsPos,pos[0],y-1);y--);
		}else if(dir=='6'){
			for(;x<15 && parseInt(this.b[y][x])%3!=0 && !isRobotHere(this.robotsPos,x+1,pos[1]);x++);
		}else if(dir=='2'){
			for(;y<15 && parseInt(this.b[y][x])>3 && !isRobotHere(this.robotsPos,pos[0],y+1);y++);
		}
		this.robotsPos[k][0] = x;
		this.robotsPos[k][1] = y;
    }
};






function isAtDest(r,k){
	var p=r[k];
	for(var i=0;i<symbs.length;i++){
		if(symbs[i][2]==k && symbs[i][0]==p[0] && symbs[i][1]==p[1]) return symbs[i][2]*10+symbs[i][3];
	}
	return 0;
}

Array.prototype.clone = function() {
	return JSON.parse( JSON.stringify( this ) );
}



function Move(r,moves){
	for(var i=0;i<moves.length;i+=2){
		var k=InvCol[moves[i]];
		var r=MoveRobot(r,k,moves[i+1]);
	}
	return r;
}

var Seen=new Array();

function isSeen(r){
	return (Seen[Math.floor(r/52)]&(1<<r%52))>0;
}

function setSeen(r){
	Seen[Math.floor(r/52)]|=(1<<r%52);
}

function isRobotHere(robots,x,y){
	for(var k=0;k<5;k++){
		var pos=robots[k];
		if(pos[0]==x && pos[1]==y) return true;
	}
	return false;
}



function Solve(Poss,moves,start,newPoss){
		var Increments = 1000;
		var show=false;
		var keys=Object.keys(Poss);
//		console.log("Move: ",moves," Possibilities: ",start," / ",keys.length);
		for(var p=start;p<keys.length && p-start<Increments;p++){
			rpos=Poss[keys[p]]; // robot position array
			if(show){
				showRobots(rpos);
			}
			var rid=getRID(rpos);
			Seen[Math.floor(rid/52)]|=1<<(rid%52); // flag position as seen
			for(var k=0;k<5;k++){ // scan robots color
				var x=rpos[k][0];
				var y=rpos[k][1];
				var C = parseInt(b[y][x]);
				var tests={};
				for(var di=0;di<4;di++){
					var D=['4','6','2','8'][di];
					var r2=MoveRobot(rpos,k,D);
					var rid2=getRID(r2);
					if(rid!=rid2){
						var nm=keys[p]+ShortCol[k]+D;
						var d=isAtDest(r2,k);
						if(d>0){
								if(Solutions[d]==0 || Solutions[d]==moves){
									document.getElementById("SolM-"+d).innerHTML=moves;
									document.getElementById("Sol-"+d).innerHTML+=
									document.getElementById("Sol-"+d).innerHTML+nm+" ; ";
									console.log("Found solution: ",nm," in ",moves, " moves");
									Solutions[d]=moves;
								}
						}
						if(!isSeen(rid2))	newPoss[nm]=r2;
					}
				}
			}
		}
		if(start+Increments<=keys.length){
			var speed=5;
			setTimeout(Solve,speed,Poss,moves,start+Increments,newPoss,Seen);
		}else if(moves<6){
			Solve(newPoss,moves+1,0,new Array());
		}
}
function ShortestPath(col){
	r = robotsPos[col];
	document.getElementById("Cell-"+r[1].toString(16)+r[0].toString(16)).innerHTML+="0";
	
	console.log(r);
}

var R;

function moveRobot(id,dir){
    R.MoveRobot(id,dir);
    $('.robot').remove();
    $('.cursor').remove();
    R.showRobots();
}

function cursorRobot(el){
    $('.cursor').remove();
    if($('#'+el.target.id).hasClass('cursor-on')){
        $('.cursor-on').removeClass('cursor-on');
        return;
    }
    $('#'+el.target.id).addClass('cursor-on');
    var robColor = el.target.id.substr(3);
    var robID = R.InvColLong[robColor];
    var robPos = R.robotsPos[robID];
    var posStatus = R.b[robPos[1]][robPos[0]];

    // Can go Up?
    if(robPos[1]>0 && posStatus<7){
            $('#Cell-'+(robPos[1]-1).toString(16)+robPos[0].toString(16)).append(
            `<div class="cursor cursor-up" onClick="moveRobot(`+robID+','+8+`);">
            <i class="fa fa-caret-square-o-up"></i>
            </div>`);
    }
    // Can go Down?
    if(robPos[1]<15 && posStatus>3){
            $('#Cell-'+(robPos[1]+1).toString(16)+robPos[0].toString(16)).append(
           `<div class="cursor cursor-down" onClick="moveRobot(`+robID+','+2+`);">
           <i class="fa fa-caret-square-o-down"></i>
           </div>`);
    }
    // Can go Left?
    if(robPos[0]>0 && posStatus%3!=1){
            $('#Cell-'+(robPos[1]).toString(16)+(robPos[0]-1).toString(16)).append(
            `<div class="cursor cursor-left" onClick="moveRobot(`+robID+','+4+`);">
            <i class="fa fa-caret-square-o-left"></i>
            </div>`);
    }
    // Can go Right?
    if(robPos[0]<15 && posStatus%3!=0){
            $('#Cell-'+(robPos[1]).toString(16)+(robPos[0]+1).toString(16)).append(
            `<div class="cursor cursor-right" onClick="moveRobot(`+robID+','+6+`);">
            <i class="fa fa-caret-square-o-right"></i>
            </div>`);
    }
}

function S(){
    R = new Ricochet()
    R.drawTable();
    R.drawSymbols();
    R.showRobots();
}
