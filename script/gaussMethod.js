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

function calculateEquation(){
    checkIfAllInputsAreInserted();
}