generateFieldOfVariables();

function generateFieldOfVariables(){
    const numOfCols = document.getElementById("gauss_cols").value;
    const numOfRows = document.getElementById("gauss_rows").value;
    const div = document.getElementById("equation_container");
    let htmlCode = "";

    for(i = 1; i <= numOfRows; i++){
        htmlCode += ` <div class="string">`;

        for(j = 1; j <= numOfCols; j++){
            htmlCode+=`<span class="variable"> <input type="number" class="coefficient" id="x${i}${j}"> x${j}`;

            if(j != numOfCols){
                    htmlCode += ` +`;
            }

            htmlCode += ` </span>`;
        }
        htmlCode += `=<input type="number" class="coefficient" id="result${i}"></div>`;
    }
    div.innerHTML = htmlCode;
}

function printMatrix(matrix, numOfRows, numOfCols){
    let str = '';
    for(i = 0; i < numOfRows; i++){
        str += '<div>';
        for(j = 0; j < numOfCols; j++){
                str += Math.round(matrix[i][j]* 1000)/1000 + " ";
        }
        str += "| " + Math.round(matrix[i][j]*1000)/1000 + '</div>';
    }
    return str;
}

function checkIfAllInputsAreInserted(numOfRows, numOfCols){
    for(i = 1; i <= numOfRows; i++){
        for(j = 1; j <= numOfCols; j++){
            if(document.getElementById(`x${i}${j}`).value == ""){
                alert("Вы ввели не все значения коэффициентов");
                return;
            }
        }
        if(document.getElementById(`result${i}`).value == "") {
            alert("Вы ввели не все значения уравнения");
            return;
        }
    }
};

function formMatrix(numOfRows, numOfCols){
    let matrix = [];

    for(i = 1; i <= numOfRows; i++){
        let arr = [];
        for(j = 1; j <= numOfCols; j++){
            arr.push(+document.getElementById(`x${i}${j}`).value);
        }
        arr.push(+document.getElementById(`result${i}`).value);
        matrix.push(arr);
    }

    return matrix;
}

function deleteNullRowsOfMatrix(matrix, numOfRows, numOfCols){
    for(i = 0; i < numOfRows; i++){
        let numOfZeros = 0;
        for(j = 0; j < numOfRows; j++){
            if(+matrix[i][j] == 0){
                numOfZeros++;
            }
        }
        if(numOfZeros == numOfCols){
            matrix.splice(i, 1);
            i--;
            numOfRows--;
        }
    }
    return matrix;
}

function makeReducedEchelonRowFormOfMatrix(matrix, numOfRows, numOfCols, div){
        let lead = 0; 
        const tolerance = 1e-10;
        let htmlCode = '';
        htmlCode += "<div class='solution'> <div>Дана матрица:</div>";
        htmlCode += printMatrix(matrix, numOfRows, numOfCols - 1) + '</div>';
        try{
            for (let r = 0; r < numOfRows; r++) {
                if (lead >= numOfCols){
                    return matrix;
                }
                let i = r;
                while (Math.abs(matrix[i][lead]) < tolerance) {
                    i++;
                    if (i === numOfRows) {
                        i = r;
                        lead++;
                        if (lead === numOfCols){
                            return matrix;
                        } 
                    }
                }
        
                [matrix[i], matrix[r]] = [matrix[r], matrix[i]];
        
                let pivot = matrix[r][lead];
                if (Math.abs(pivot) > tolerance) {
                    for (let j = 0; j < numOfCols; j++) {
                        matrix[r][j] /= pivot;
                    }
                    htmlCode += `<div class='solution'> <div>Разделим ${r + 1} строку матрицы на ${Math.round(pivot*1000)/1000}:</div>`;
                    htmlCode +=  printMatrix(matrix, numOfRows, numOfCols - 1) + '</div>';
                }
        
                for (let i = 0; i < numOfRows; i++) {
                    if (i !== r) {
                        let factor = matrix[i][lead];
                        for (let j = 0; j < numOfCols; j++) {
                            matrix[i][j] -= factor * matrix[r][j];
                        }  
                        htmlCode += `<div class='solution'><div>Отнимем от элементов ${i + 1} строки матрицы элементы ${r + 1} строки матрицы, умноженной на ${Math.round(factor*1000)/1000}:</div>`;
                        htmlCode +=  printMatrix(matrix, numOfRows, numOfCols - 1) + '</div>';
                    }
                }
        
                lead++;
                if (r === numOfRows - 1) {
                    matrix = deleteNullRowsOfMatrix(matrix, numOfRows, numOfCols);
                    numOfRows = matrix.length;
                }
            }
            div.innerHTML = htmlCode;
            document.getElementById("hideOrUnhideSolution").style.display = "flex";
           
        }
        catch(err){
            console.log(err);
        }
        finally{
            return matrix;
        }
        
}

function solveOverdeterminedSystem(matrix, rows, cols, divRes, divSol){
    let augmentedMatrix = matrix.map(row => [...row]);
    let htmlCode = "<div class='solution'><div>Дана матрица: </div>"
    htmlCode += printMatrix(augmentedMatrix, rows, cols - 1);
    htmlCode += "</div>";

    for (let i = 0; i < rows; i++) {
        let pivot = augmentedMatrix[i][i];
        if (Math.abs(pivot) < 1e-10) {
            for (let k = i + 1; k < rows; k++) {
                if (Math.abs(augmentedMatrix[k][i]) > 1e-10) {
                    [augmentedMatrix[i], augmentedMatrix[k]] = 
                    [augmentedMatrix[k], augmentedMatrix[i]];
                    pivot = augmentedMatrix[i][i];
                    break;
                }
            }
        }

        if (Math.abs(pivot) < 1e-10) continue;

        
        htmlCode +=`<div class = "solution"><div>Умножим ${i + 1} ряд на ${pivot}:</div>`;
        for (let j = i; j < cols; j++) {
            augmentedMatrix[i][j] /= pivot;
        }
        htmlCode += printMatrix(augmentedMatrix, rows, cols - 1) + '</div>';

        for (let k = 0; k < rows; k++) {
            if (k !== i) {
                let factor = augmentedMatrix[k][i];
                htmlCode +=`<div class = "solution"><div>Отнимем от ${k + 1} ряда ${i + 1} ряд, умноженный на ${factor}:</div>`;
                for (let j = i; j < cols; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
                htmlCode += printMatrix(augmentedMatrix, rows, cols - 1) + '</div>';
            }
            
        }
        
    }

    let solution = [];
    let freeVars = new Set();

    for (let i = 0; i < cols - 1; i++) {
        freeVars.add(i);
    }

    for (let i = 0; i < rows; i++) {
        let pivotCol = -1;
        for (let j = 0; j < cols - 1; j++) {
            if (Math.abs(augmentedMatrix[i][j]) > 1e-10) {
                pivotCol = j;
                break;
            }
        }
        if (pivotCol !== -1) {
            freeVars.delete(pivotCol);
        }
    }

    for (let i = 0; i < rows; i++) {
        let pivotCol = -1;
        for (let j = 0; j < cols - 1; j++) {
            if (Math.abs(augmentedMatrix[i][j]) > 1e-10) {
                pivotCol = j;
                break;
            }
        }

        if (pivotCol !== -1) {
            let expression = {};
            for (let freeVar of freeVars) {
                if (freeVar > pivotCol) {
                    let coeff = -augmentedMatrix[i][freeVar];
                    if (Math.abs(coeff) > 1e-10) {
                        expression[`x${freeVar + 1}`] = coeff;
                    }
                }
            }
            let constant = augmentedMatrix[i][cols - 1];
            if (Math.abs(constant) > 1e-10) {
                expression['constant'] = constant;
            }
            solution[pivotCol] = expression;
        }
    }

    let resultParts = "";
    for (let i = 0; i < cols - 1; i++) {
        resultParts += '<div>';
        if (freeVars.has(i)) {
            resultParts += `x${i + 1} - свободная переменная`;
        } else if (solution[i]) {
            let expr = `x${i + 1} = `;
            let terms = [];
            for (let [varName, coeff] of Object.entries(solution[i])) {
                if (varName === 'constant') {
                    terms.push(coeff > 0 ? `+${formatNumber(coeff)}` : formatNumber(coeff));
                } else {
                    let term = coeff > 0 ? `+${formatNumber(coeff)}${varName}` : `${formatNumber(coeff)}${varName}`;
                    terms.push(term);
                }
            }
            expr += terms.join(' ') || '0';
            resultParts += expr.trim();
        }
        resultParts += '</div>';
    }
    divRes.innerHTML = resultParts;
    divRes.style.display = "block";
    divSol.innerHTML = htmlCode;
    document.getElementById("hideOrUnhideSolution").style.display = "flex";
}

function formatNumber(num) {
    return Number(num.toFixed(3)).toString().replace(/^-0$/, '0');
}

function hideOrUnhideSolution(){
    const div = document.getElementById("solution");
    const button = document.getElementById("hideOrUnhideSolution");
    if(div.style.display == "none"){
        div.style.display = "flex";
        button.innerText = "Скрыть решение";
    }else{
        div.style.display = "none";
        button.innerText = "Раскрыть решение";
    }
}

function deriveNoResult(div){
    div.innerHTML = "Решений системы не существует";
    div.style.display = "flex";
}

function deriveResultForSquareMatrix(matrix, numOfRows, numOfCols, div){
    let htmlCode = "";
    for(i = 1; i <= numOfRows; i++){
        htmlCode +=  '<div>x' + i + " = " + Math.round(matrix[i - 1][numOfCols]*1000)/1000 + "</div>";
    }
    div.innerHTML = htmlCode; 
    div.style.display = "block";   
}

function calculateEquation(){
    let arrOfNums = {numOfCols: document.getElementById("gauss_cols").value, numOfRows: document.getElementById("gauss_rows").value};
    const divResult = document.getElementById("result");
    const divSolution = document.getElementById("solution");

    checkIfAllInputsAreInserted(arrOfNums.numOfRows, arrOfNums.numOfCols);
    let matrix = formMatrix(arrOfNums.numOfRows, arrOfNums.numOfCols)

    if(arrOfNums.numOfCols > arrOfNums.numOfRows){
        solveOverdeterminedSystem(matrix, arrOfNums.numOfRows, +arrOfNums.numOfCols + 1, divResult, divSolution);
    }else{
        matrix = makeReducedEchelonRowFormOfMatrix(matrix, arrOfNums.numOfRows, +arrOfNums.numOfCols + 1, divSolution);
        arrOfNums.numOfRows = matrix.length;    
        if(arrOfNums.numOfCols == arrOfNums.numOfRows){
            deriveResultForSquareMatrix(matrix, arrOfNums.numOfRows, arrOfNums.numOfCols, divResult);
            return;
         }else if (arrOfNums.numOfCols < arrOfNums.numOfRows){
             deriveNoResult(divResult);
             return;
         }
    }
   
}