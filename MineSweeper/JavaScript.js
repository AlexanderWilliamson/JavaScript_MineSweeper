class dadSquare{
	constructor(){
		this.nearby = 0;
		this.revealed = false;
		this.flagged = false;
		this.mine = false;
	}
}

var grid;
var directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
var directions8 = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function constructgrid(){
	let iWidth = document.getElementById("width").value, iHeight = document.getElementById("height").value;
	const id = document.getElementById("errorOccured");
	const test = document.getElementById("test");
	let width = 0, height = 0;
	if (iWidth.length == 0 || iWidth.length > 2 || iHeight.length == 0 || iHeight.length > 2){
		id.innerText = "Inputed Width and Height must be in the range of 1-2 characters";
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
	temp = 0
	for (let i = 0; i < iHeight.length; i++){
		 temp = iHeight.charCodeAt(i);
		 if (temp < 48 || temp > 57){
			 id.innerText = "Height is not valid integer";
			 return;
		 }
	}
	width = parseInt(iWidth);
	height = parseInt(iHeight);
	if (width < 1 || height < 1 || width > 99 || height > 99){
		id.innerText = "Width or Height must be within the bounds of 1-30";
		return
	}
	
	grid = [];
	for (let i = 0; i < height; i++){
		let row = []
		for (let j = 0; j < height; j++){
			row.push(new dadSquare());
		}
		grid.push(row);
	}
	for (let i = 0; i < height; i++){ //mine creation
		for (let j = 0; j < width; j++){
			if (Math.random() < 0.12){
				grid[i][j].mine = true;
			}
		}
	}
	
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
	
	const tbl = document.createElement("TABLE");
	tbl.className = "dadtable";
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
	if (grid[r][c].revealed)
		return
	
	const queue = [];
	if (!grid[r][c].mine)
		queue.push([r, c]);
	grid[r][c].revealed = true;
	editSquare(r, c);
	
	while (queue.length != 0){
		let node = queue.pop();
		let row = node[0], col = node[1];
		
		if (grid[row][col].nearby != 0)
			continue;
		
		for (let i = 0; i < directions.length; i++){
			if (row + directions[i][0] >= 0 && row + directions[i][0] < grid.length && col + directions[i][1] >= 0 && col + directions[i][1] < grid[0].length && !grid[row + directions[i][0]][col + directions[i][1]].revealed && !grid[row + directions[i][0], col + directions[i][1]].flagged){
				grid[row + directions[i][0]][col + directions[i][1]].revealed = true;
				editSquare(row + directions[i][0], col + directions[i][1]);
				queue.push([row + directions[i][0], col + directions[i][1]]);
			}
		}
	}
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
