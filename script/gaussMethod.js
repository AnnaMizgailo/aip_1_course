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

function checkIfAllInputsAreInserted(){
    const numOfCols = document.getElementById("gauss_cols").value;
    const numOfRows = document.getElementById("gauss_rows").value;

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

    alert("Вы ввели все коэффициенты!");
};

function formMatrix(){
    let matrix = [];
    const numOfCols = document.getElementById("gauss_cols").value;
    const numOfRows = document.getElementById("gauss_rows").value;

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

function makeReducedEchelonRowFormOfMatrix(matrix){
        let lead = 0; 
        const numOfCols = +document.getElementById("gauss_cols").value + 1;
        const numOfRows = +document.getElementById("gauss_rows").value;
        const tolerance = 1e-10;
    
        for (let r = 0; r < numOfRows; r++) {
            if (lead >= numOfCols) return matrix;
    
            let i = r;
            while (Math.abs(matrix[i][lead]) < tolerance) {
                i++;
                if (i === numOfRows) {
                    i = r;
                    lead++;
                    if (lead === numOfCols) return matrix;
                }
            }
    
            [matrix[i], matrix[r]] = [matrix[r], matrix[i]];
    
            let pivot = matrix[r][lead];
            if (Math.abs(pivot) > tolerance) {
                for (let j = 0; j < numOfCols; j++) {
                    matrix[r][j] /= pivot;
                }
            }
    
            for (let i = 0; i < numOfRows; i++) {
                if (i !== r) {
                    let factor = matrix[i][lead];
                    for (let j = 0; j < numOfCols; j++) {
                        matrix[i][j] -= factor * matrix[r][j];
                    }
                }
            }
    
            lead++;
        }
    
        return matrix;
}



function calculateEquation(){
    const numOfCols = document.getElementById("gauss_cols").value;
    const numOfRows = document.getElementById("gauss_rows").value;
    const div = document.getElementById("result");

    checkIfAllInputsAreInserted();

    let matrix = makeReducedEchelonRowFormOfMatrix(formMatrix());
    let htmlCode = "";

    if(numOfCols == numOfRows){
        for(i = 1; i <= numOfRows; i++){
            htmlCode +=  '<div>x' + i + " = " + matrix[i - 1][numOfCols] + "</div>";
        }
    }
    div.innerHTML = htmlCode;    
}