function plantMines(nbMines, sizes){
    let minesPos = []

    const generateMinePos = ([maxY, maxX]) => {
        let randomX = Math.floor(Math.random() * maxX)
        let randomY = Math.floor(Math.random() * maxY)

        return randomX+"-"+randomY
    }
    
    while(minesPos.length < nbMines){
        let coords = generateMinePos(sizes)
        while(minesPos.indexOf(coords) > -1){
            coords = generateMinePos(sizes)
        } 
        minesPos.push(coords)
    }
    
    console.log(minesPos)
    return minesPos
}

document.addEventListener("DOMContentLoaded", () => {
    let gameStart = true

    const gridSize = [20, 20]
    const nbMines = 50
    const grid = document.querySelector("#grid")
    grid.style.gridTemplateColumns = "repeat("+gridSize[0]+", 50px)"
    grid.style.gridTemplateRows = "repeat("+gridSize[1]+", 50px)"

    const mines = plantMines(nbMines, gridSize)

    const cell = document.createElement("div")
    cell.classList.add("cell")
    
    for(let x = 0; x < gridSize[1]; x++){
        for(let y = 0; y < gridSize[0]; y++){
            let thisCell = cell.cloneNode(true)
            thisCell.dataset.coords = x+"-"+y
            grid.appendChild(thisCell)
        }
    }

    const getCell = (coords) => {
        let datacoords = coords.map(num => parseInt(num)).join("-")
        return document.querySelector(".cell[data-coords='"+datacoords+"']")
    }

    const getAdjacentCells = (coords) => {

        let adjacentCells = []
        console.log(coords)
        let tabCoords = coords.split("-")

        for(let x = 1; x >= -1; x--){
            for(let y = 1; y >= -1; y--){
                let cell = getCell([tabCoords[0] - x, tabCoords[1] - y])
                if(cell !== null 
                    && cell.dataset.coords != coords 
                    && !cell.classList.contains("empty")
                    && !cell.classList.contains("near")){
                    adjacentCells.push(cell)
                }
            }
        }
        console.log(adjacentCells)
        return adjacentCells
    }

    const countMinesIn = (cells) => {
        let nb = 0
        for(let cell of cells){
            if(mines.indexOf(cell.dataset.coords) > -1){
                nb++
            }
        }
        return nb
    }

    let delay = 0
    let nbchecks = 0
    const check = (cell) => {
        nbchecks++
        console.log(nbchecks)
        let coords = cell.dataset.coords
            
        let adjCells = getAdjacentCells(coords)
        let nbMinesAround = countMinesIn(adjCells)

        if(mines.indexOf(coords) > -1){
            
            gameOver()
        }
        else if(nbMinesAround > 0){
            cell.classList.add("near", "near-"+nbMinesAround)
            cell.innerText = nbMinesAround
        }
        else{
            cell.style.transitionDelay = delay+"s"
            cell.classList.add("empty")
            delay+= 0.02

            for(let adjCell of adjCells){
                let coords = adjCell.dataset.coords
                if(mines.indexOf(coords) == -1 && !adjCell.classList.contains("empty")){
                    check(adjCell)
                }
            }
            delay = 0
        }
    }

    const gameOver = () => {
        for(let mineCoords of mines){
            let mineCell = grid.querySelector(".cell[data-coords='"+mineCoords+"']")
            mineCell.classList.add("boom")
        }
        gameStart = false
    }
   
//-------EVENTS-------
    document.querySelectorAll(".cell").forEach(cell => {
        cell.addEventListener("click", () => {
            if(gameStart){
                if(!cell.classList.contains("flag") && !cell.classList.contains("doubt")){
                    check(cell)
                }
            }
            
        })
        cell.addEventListener("contextmenu", event => {
            event.preventDefault()
            if(gameStart && cell.innerText == ""){
                if(cell.classList.contains("doubt")){
                    cell.classList.remove("doubt")
                }
                else if(cell.classList.contains("flag")){
                    cell.classList.remove("flag")
                    cell.classList.add("doubt")
                }
                else{
                    cell.classList.add("flag")
                }
            }
            return false;
        })
    })

})