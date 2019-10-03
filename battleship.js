var view={//file battleship_tester.js
	displayMessage: function(msg){
		var messageArea=document.getElementById("messageArea");
		messageArea.innerHTML=msg;
	},

	displayHit: function(location){
		var cellHit=document.getElementById(location);
		cellHit.setAttribute("class","hit");
	},

	displayMiss: function(location){
		var cellMiss=document.getElementById(location);
		if(cellMiss!=null)
		cellMiss.setAttribute("class","miss");
	}
};

var model={//включає в себе позиції кораблів, координати попадань і counter
	boardSize:7,
	numShips:3,
	shipsSunk:0,
	shipLength:3,
	ships:[
		{locations:[this.shipLength],hits:[this.shipLength],occ:[]},//have arrays in properties "ships"
		{locations:[this.shipLength],hits:[this.shipLength],occ:[]},
		{locations:[this.shipLength],hits:[this.shipLength],occ:[]}],
	
	fire: function(guess){
		for(var i=0;i<this.numShips;i++){
			var ship=this.ships[i];
			var index=ship.locations.indexOf(guess);
			if(index>=0){
				ship.hits[index]="hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if(this.isSunk(ship)){
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		
		return false;
	},
	isSunk: function(ship){
		for(var i=0;i<this.shipLength;i++){
			if(ship.hits[i]!=="hit"){
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function(){
		var locations;
		for(var i=0;i<this.numShips;i++){
			do{
				locations=this.generateShip();
			}while(this.collision(locations));
			this.ships[i].locations=locations;
			//this.ship[i].occ.;
		}
	},
	generateShip: function(){
		var direction=Math.floor(Math.random()*2);
		var row,col;

		if(direction===1){
			row=Math.floor(Math.random()*this.boardSize);
			col=Math.floor(Math.random()*(this.boardSize-this.shipLength+1));
		}else{
			row=Math.floor(Math.random()*(this.boardSize-this.shipLength+1));
			col=Math.floor(Math.random()*this.boardSize);
		}

		var newShipLocations=[];
		for(var i=0;i<this.shipLength;i++){
			if(direction===1){
				newShipLocations.push(row+""+(col+i));
			}else{
				newShipLocations.push((row+i)+""+col);
			}
			/*if(i==1){

			}*/
		}
		return newShipLocations;
	},
	collision:function(locations){
		for(var i=0;i<this.numShips;i++){
			var ship=this.ships[i];
			for(var j=0;j<locations.length;j++){
				if(ship.locations.indexOf(locations[j])>=0){//типу якщо генеруєма локація співпадає з локацією кораблика
					return true;//то буде продовжуватись цикл генерації локації кораблика
				}
			}
		}
		return false;
	}
};

var controller={
	guesses:0,

	proccessGuess:function(guess){
		var location=this.parseGuess(guess);
		if(location){
			this.guesses++;
			var hit=model.fire(location);
			if(hit&&model.shipsSunk===model.numShips){
				view.displayMessage("You sank all my battleship, in "+this.guesses+" guesses");
				var form=document.getElementById("form");
				form.remove();
			}
		}
	},
	parseGuess: function(guess){
		var alphabet=["A","B","C","D","E","F","G"];

		if(guess===null||guess.length!==2){//перевірка на строгу рівність
			alert("Oops, please enter a letter and a number on the board.");
		}else{
			var firstChar=guess.charAt(0);//витягуємо 1-шу літеру
			var row=alphabet.indexOf(firstChar);
			var column=guess.charAt(1);//витягуємо 2-гу літеру

			if(isNaN(row)||isNaN(column)){
				alert("Oops, that isn't on the board.");
			}else if(row<0||row>=model.boardSize||column<0||column>=model.boardSize){
				alert("Oops, that's of the board!");
			}else{
				return row+column;//row - is number, column - is string, in result we have string becouse doing concatinate
			}
		}
		return null;
	}
};

function handleFireButton(){
	var guessInput=document.getElementById("guessInput");//отрмуємо елемент поля вводу
	var guess=guessInput.value;//зчитуємо дані з текстового поля для вводу
	controller.proccessGuess(guess);
	guessInput.value="";//очищуємо поле вводу в браузері
}

function handleKeyPress(e){//короч для спрацьовування при натисненні Enter
	var fireButton=document.getElementById("fireButton");
	if(e.keyCode===13){//при натисненні клавіші Enter
		fireButton.click();//імітація натиснення кнопки
		return false;//щоб функція не робила нічого лишнього
	}
}

window.onload=init;
function init(){
	var fireButton=document.getElementById("fireButton");
	fireButton.onclick=handleFireButton;//викликаємо функцію при натисненні на кнопку
	
	var guessInput=document.getElementById("guessInput");//додаємо новий обробник для обробки натиснення на клавішу в поле вводу HTML
	guessInput.onkeypress=handleKeyPress;

	model.generateShipLocations();
}
