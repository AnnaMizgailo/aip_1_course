generateFieldOfVariables();

function generateFieldOfVariables(){
    const numOfCols = document.getElementById("gauss_cols").value;
    const numOfRows = document.getElementById("gauss_rows").value;
    const div = document.getElementById("equation_container");
    let htmlCode = "";

    for(i = 1; i <= numOfRows; i++){
        htmlCode += ` <div class="string">`;

        for(j = 1; j <= numOfCols; j++){
            htmlCode+=`<span class="variable"> <input type="number" class="coefficient" id="x` + i + j + `"> x` + j;

            if(j != numOfCols){
                    htmlCode += ` +`;
            }

            htmlCode += ` </span>`;
        }
        htmlCode += `=<input type="number" class="coefficient" id="result` + i + `"></div>`;
    }
    div.innerHTML = htmlCode;
};

function printMatrix(matrix, numOfRows, numOfCols){
    let str = '<div>';
    for(i = 0; i < numOfRows; i++){
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
            if(document.getElementById("x"+i+j).value == ""){
                alert("Вы ввели не все значения коэффициентов");
                return;
            }
        }
        if(document.getElementById("result"+i).value == "") {
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
            arr.push(+document.getElementById("x" + i + j).value);
        }
        arr.push(+document.getElementById("result" + i).value);
        matrix.push(arr);
    }

    return matrix;
}

function makeReducedEchelonRowFormOfMatrix(matrix, numOfRows, numOfCols, div){
        let lead = 0; 
        const tolerance = 1e-10;
        let htmlCode = '';
        htmlCode += "<div class='solution'> <div>Дана матрица:</div>";
        htmlCode += printMatrix(matrix, numOfRows, numOfCols - 1) + '</div>';
    
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
                htmlCode += "<div class='solution'> <div>Разделим " + +(r + 1) + ' строку матрицы на ' + Math.round(pivot*1000)/1000 + ':</div>';
                htmlCode +=  printMatrix(matrix, numOfRows, numOfCols - 1) + '</div>';
            }
    
            for (let i = 0; i < numOfRows; i++) {
                if (i !== r) {
                    let factor = matrix[i][lead];
                    for (let j = 0; j < numOfCols; j++) {
                        matrix[i][j] -= factor * matrix[r][j];
                    }  
                    htmlCode += "<div class='solution'><div>Отнимем от элементов " + +(i + 1) + ' строки матрицы элементы ' + +(r + 1) + ' строки матрицы, умноженной на ' + Math.round(factor*1000)/1000 + ':</div>';
                    htmlCode +=  printMatrix(matrix, numOfRows, numOfCols - 1) + '</div>';
                }
            }
    
            lead++;
        }

        div.innerHTML = htmlCode;
        div.style.display = "flex";
    
        return matrix;
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
    const numOfCols = document.getElementById("gauss_cols").value;
    const numOfRows = document.getElementById("gauss_rows").value;
    const divResult = document.getElementById("result");
    const divSolution = document.getElementById("solution");

    checkIfAllInputsAreInserted(numOfRows, numOfCols);

    let matrix = makeReducedEchelonRowFormOfMatrix(formMatrix(numOfRows, numOfCols), numOfRows, +numOfCols + 1, divSolution);

    if(numOfCols == numOfRows){
       deriveResultForSquareMatrix(matrix, numOfRows, numOfCols, divResult);
       return;
    }
   
}