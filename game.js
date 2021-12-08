const gridSize = [10, 20]
const nbMines = 30

function plantMines(nbMines, sizes){
    let minesPos = []

    const generateMinePos = ([rows, cols]) => {
        let randomRow = Math.floor(Math.random() * rows)
        let randomCol = Math.floor(Math.random() * cols)

        return randomRow+"-"+randomCol
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
    
    let nbchecks = 0
    const check = (cell) => {
        nbchecks++
        console.log(nbchecks)
        let coords = cell.dataset.coords
            
        let adjCells = getAdjacentCells(coords)
        let nbMinesAround = countMinesIn(adjCells)

        if(mines.indexOf(coords) > -1){
            
            gameOver(coords)
        }
        else if(nbMinesAround > 0){
            cell.classList.add("near", "near-"+nbMinesAround)
            cell.innerText = nbMinesAround
        }
        else{
            
            cell.classList.add("empty")
            

            for(let adjCell of adjCells){
                let coords = adjCell.dataset.coords
                if(mines.indexOf(coords) == -1 && !adjCell.classList.contains("empty")){
                    check(adjCell)
                }
            }
            
        }
    }

    const gameOver = (explodingCoords) => {
        let delay = 0
        let minesTemp = [...mines]

        minesTemp.sort((a, b) => {
            let coordsA = a.split("-").map(c => parseInt(c))
            let coordsB = b.split("-").map(c => parseInt(c))
            let order = 0
            order = coordsA[0] < coordsB[0] ? order-2 : order+2
            order = coordsA[1] < coordsB[1] ? order-1 : order+1
            return order
        })
        console.log(minesTemp)
        const explodeMine = (coords, delay) => {
            let mineCell = grid.querySelector(".cell[data-coords='"+coords+"']")
            mineCell.style.animationDelay = delay+"s"
            mineCell.classList.add("boom")
        }

        explodeMine(explodingCoords, delay)
        minesTemp.splice(minesTemp.indexOf(explodingCoords), 1)
        delay+= 0.5

        for(let mineCoords of minesTemp){
            explodeMine(mineCoords, delay)
            delay+= 0.05
        }

        grid.classList.add("game-over")
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