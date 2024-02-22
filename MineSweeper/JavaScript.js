class dadSquare{
	constructor(){
		this.nearby = 0;
		this.revealed = false;
		this.flagged = false;
		this.mine = false;
	}
}

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
	if (width < 1 || height < 1 || width > 30 || height > 30){
		id.innerText = "Width or Height must be within the bounds of 1-30";
		return
	}
	//document.write()
	const grid = new Array(height).fill(new dadSquare()).map(() => new Array(width).fill(new dadSquare()));
	for (let i = 0; i < grid.length; i++){
		for(let j = 0; j < grid[0].length; j++){
			let curbutton = document.createElement("BUTTON");
			let curbuttonText = document.createTextNode("Test");
			curbutton.className = "dadsquare";
			curbutton.id = i + "," + j;
			curbutton.appendChild(curbuttonText);
			document.body.appendChild(curbutton);
		}
		document.body.appendChild(document.createElement("BR"));
	}
}
