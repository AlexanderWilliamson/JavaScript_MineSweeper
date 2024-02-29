class dadSquare{
	constructor(){
		this.nearby = 0;
		this.revealed = false;
		this.flagged = false;
		this.mine = false;
	}
}

var grid;
var firstclick = true;
var directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
var placingFlags = false;
var unrevealedSquares = 0;
var totalFlags = 0;
var lockclicks = false;
var gridconstructed = false;
var automationlevel = 0;
var mineprobability = 0.16;

function constructgrid(){
	if (gridconstructed)
		return;
	
	let iWidth = document.getElementById("width").value, iHeight = document.getElementById("height").value, iAutomationLevel = document.getElementById("automationlevel").value, iMineProbability = document.getElementById("mineprobability").value;
	const id = document.getElementById("errorOccured");
	const test = document.getElementById("test");
	let width = 0, height = 0;
	if (iWidth.length > 3 || iHeight.length > 3){
		id.innerText = "Inputed Width and Height cannot exceed 3 characters";
		return;
	} 
	
	if (iAutomationLevel.length != 0 && (iAutomationLevel.length > 1 || !(iAutomationLevel.charCodeAt(0) >= 48 && iAutomationLevel.charCodeAt(0) <= 50))){
		id.innerText = "Automation level must be 0, 1, or 2";
		return;
	}
	
	if (iMineProbability.length > 5){
		id.innerText = "Mine probability input length cannot exceed 5 characters";
		return
	}
	
	let temp = 0;
	for (let i = 0; i < iWidth.length; i++){
		 temp = iWidth.charCodeAt(i);
		 if (temp < 48 || temp > 57){
			 id.innerText = "Width is not valid integer";
			 return;
		 }
	}
	
	temp = 0;
	for (let i = 0; i < iHeight.length; i++){
		 temp = iHeight.charCodeAt(i);
		 if (temp < 48 || temp > 57){
			 id.innerText = "Height is not valid integer";
			 return;
		 }
	}
	
	if (iAutomationLevel != 0)
		automationlevel = parseInt(iAutomationLevel);
	
	if (parseFloat(iMineProbability) == NaN){
		id.innerText = "Mine probability is not a valid number";
		return;
	}
	
	if (parseFloat(iMineProbability) < 0 || parseFloat(iMineProbability) > 1){
		id.innerText = "Mine probability must be in range of 0-1";
		return;
	}
	
	if (iMineProbability.length != 0)
		mineprobability = parseFloat(iMineProbability);
	
	if (iWidth.length == 0)
		width = 20;
	else
		width = parseInt(iWidth);
	
	if (iHeight.length == 0)
		height = 15;
	else
		height = parseInt(iHeight);
	
	if (width < 1 || height < 1 || width > 250 || height > 250){
		id.innerText = "Width and Height must be within the bounds of 1-250";
		return;
	}
	
	gridconstructed = true;
	id.innerText = "";
	grid = [];
	for (let i = 0; i < height; i++){
		let row = [];
		for (let j = 0; j < width; j++){
			row.push(new dadSquare());
		}
		grid.push(row);
	}
	for (let i = 0; i < height; i++){ //mine creation
		for (let j = 0; j < width; j++){
			if (Math.random() <= mineprobability){
				grid[i][j].mine = true;
				totalFlags++;
			}
			else{
				unrevealedSquares++;
			}
		}
	}
	
	const aside = document.createElement("ASIDE");
	const label = document.createElement("LABEL");
	const flagbtn = document.createElement("IMG");
	flagbtn.className = "enableflags enableflagsimage";
	flagbtn.onclick = function() {flagclicked()};
	flagbtn.src = "Images/notplacingflag.jpg";
	flagbtn.id = "flagbutton";
	label.innerHTML = "Flags left: <b>?</b>";
	label.className = "enableflags";
	label.id = "flagbuttonlabel";
	aside.id = "aside";
	aside.appendChild(label);
	aside.appendChild(flagbtn);
	document.body.appendChild(aside);
	
	const tbl = document.createElement("TABLE");
	tbl.className = "dadtable";
	tbl.id = "dadtable";
	for (let i = 0; i < height; i++){
		let tr = document.createElement("TR");
		tr.className = "dadrow";
		for (let j = 0; j < width; j++){
			let td = document.createElement("TD");
			let img = document.createElement("IMG");
			img.id = i + "," + j;
			img.src = "Images/unrevealed.jpg";
			img.className = "dadsquare";
			img.onclick = function() {clicked(i, j)};
			td.appendChild(img);
			tr.appendChild(td);
		}
		tbl.appendChild(tr);
	}
	document.body.appendChild(tbl);
}

function clicked(r, c){
	if (lockclicks)
		return;
	
	if (placingFlags){
		if (grid[r][c].revealed)
			return;
		
		if (grid[r][c].flagged){
			grid[r][c].flagged = !grid[r][c].flagged;
			totalFlags++;
		}
		else if (totalFlags > 0) {
			grid[r][c].flagged = !grid[r][c].flagged;
			totalFlags--;
		}
		
		if (!firstclick)
			document.getElementById("flagbuttonlabel").innerHTML = "Flags left: <b>" + totalFlags + "</b>";
		editSquare(r, c);
		return;
	}
	
	if (firstclick){
		if (unrevealedSquares == 0){
			gameWin();
			return;
		}
		if (grid[r][c].mine){
			unrevealedSquares++;
			totalFlags--;
		}
		grid[r][c].mine = false;
		for (let i = 0; i < 8; i++){
			if (r + directions[i][0] >= 0 && r + directions[i][0] < grid.length && c + directions[i][1] >= 0 && c + directions[i][1] < grid[0].length){
				if (grid[r + directions[i][0]][c + directions[i][1]].mine){
					unrevealedSquares++;
					totalFlags--;
				}
				grid[r + directions[i][0]][c + directions[i][1]].mine = false;
			}
		}
		firstclick = false;
		
		let height = grid.length
		let width = grid[0].length
		for (let i = 0; i < height; i++){ //nearby creation
			for (let j = 0; j < width; j++){
				if (i - 1 >= 0 && j - 1 >= 0 && grid[i - 1][j - 1].mine)
					grid[i][j].nearby += 1;
				if (i - 1 >= 0 && grid[i - 1][j].mine)
					grid[i][j].nearby += 1;
				if (i - 1 >= 0 && j + 1 < width && grid[i - 1][j + 1].mine)
					grid[i][j].nearby += 1;
				if (j - 1 >= 0 && grid[i][j - 1].mine)
					grid[i][j].nearby += 1;
				if (j + 1 < width && grid[i][j + 1].mine)
					grid[i][j].nearby += 1;
				if (i + 1 < height && j - 1 >= 0 && grid[i + 1][j - 1].mine)
					grid[i][j].nearby += 1;
				if (i + 1 < height && grid[i + 1][j].mine)
					grid[i][j].nearby += 1;
				if (i + 1 < height && j + 1 < width && grid[i + 1][j + 1].mine)
					grid[i][j].nearby += 1;
			}
		}
		document.getElementById("flagbuttonlabel").innerHTML = "Flags left: <b>" + totalFlags + "</b>";
	}
	
	if (grid[r][c].revealed || grid[r][c].flagged)
		return;
	
	if (grid[r][c].mine){
		mineClicked();
		return;
	}
	
	const queue = [];
	queue.push([r, c]);
	grid[r][c].revealed = true;
	unrevealedSquares--;
	editSquare(r, c);
	
	while (queue.length != 0){
		let node = queue.pop();
		let row = node[0], col = node[1];
		
		if (grid[row][col].nearby != 0)
			continue;
		
		for (let i = 0; i < directions.length; i++){
			if (row + directions[i][0] >= 0 && row + directions[i][0] < grid.length && col + directions[i][1] >= 0 && col + directions[i][1] < grid[0].length)
				if (!grid[row + directions[i][0]][col + directions[i][1]].flagged && !grid[row + directions[i][0]][col + directions[i][1]].revealed){
					grid[row + directions[i][0]][col + directions[i][1]].revealed = true;
					unrevealedSquares--;
					editSquare(row + directions[i][0], col + directions[i][1]);
					queue.push([row + directions[i][0], col + directions[i][1]]);
			}
		}
	}
	
	if (automationlevel >= 1){
		dadAutomation();
		document.getElementById("flagbuttonlabel").innerHTML = "Flags left: <b>" + totalFlags + "</b>";
	}
	
	if (unrevealedSquares == 0)
		gameWin();
}

function flagclicked(){
	placingFlags = !placingFlags;
	if (placingFlags)
		document.getElementById("flagbutton").src = "Images/placingflag.jpg";
	else
		document.getElementById("flagbutton").src = "Images/notplacingflag.jpg";
}

function editSquare(row, col){
	square = document.getElementById(row + "," + col);
	if (grid[row][col].revealed){
		if (grid[row][col].mine){
			square.src = "Images/uhoh.jpg";
		}
		else{
			square.src = "Images/revealed" + grid[row][col].nearby + ".jpg";
		}
	}
	else{
		if (grid[row][col].flagged){
			square.src = "Images/flag.jpg";
		}
		else{
			square.src = "Images/unrevealed.jpg";
		}
	}
}

function mineClicked(){
	lockclicks = true;
	for (let i = 0; i < grid.length; i++){
		for (let j = 0; j < grid[0].length; j++){
			if (grid[i][j].mine){
				grid[i][j].revealed = true;
				editSquare(i, j);
			}
		}
	}
	
	return;
}

function gameWin(){
	lockclicks = true;
	let winText = document.createElement("img");
	winText.id = "wintext";
	winText.src = "Images/winner.jpg";
	document.body.appendChild(winText);
}

function newGame(){
	if (document.getElementById("dadtable") != null)
		document.getElementById("dadtable").remove();
	if (document.getElementById("aside") != null)
		document.getElementById("aside").remove();
	if (document.getElementById("wintext") != null)
		document.getElementById("wintext").remove();
	grid = [];
	firstclick = true;
	placingFlags = false;
	totalMines = 0;
	totalFlags = 0;
	automationlevel = 0;
	unrevealedSquares = 0;
	mineprobability = 0.16;
	lockclicks = false;
	gridconstructed = false;
	constructgrid();
}

function dadAutomation(){
	for (let i = 0; i < grid.length; i++){
		for (let j = 0; j < grid[0].length; j++){
			if (!grid[i][j].revealed)
				continue;
			
			let unrevealed = [];
			for (let k = 0; k < 8; k++)
				if (i + directions[k][0] >= 0 && i + directions[k][0] < grid.length && j + directions[k][1] >= 0 && j + directions[k][1] < grid[0].length && !grid[i + directions[k][0]][j + directions[k][1]].revealed)
					unrevealed.push([i + directions[k][0], j + directions[k][1]]);
			
			if (automationlevel == 1 && unrevealed.length == 1 && grid[i][j].nearby == 1)
				dadAutomationFlagging(unrevealed[0][0], unrevealed[0][1]);
			
			else if (automationlevel == 2 && unrevealed.length == grid[i][j].nearby){
				for (let k = 0; k < unrevealed.length; k++)
					dadAutomationFlagging(unrevealed[k][0], unrevealed[k][1]);
			}
		}
	}
}

function dadAutomationFlagging(row, col){
	if (grid[row][col].flagged || totalFlags <= 0)
		return;
	
	grid[row][col].flagged = true;
	totalFlags--;
	editSquare(row, col);
}