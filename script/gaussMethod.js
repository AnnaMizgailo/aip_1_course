function generateFieldOfVariables(){

    const numOfCols = document.getElementById("gauss_cols").value;
    const numOfRows = document.getElementById("gauss_rows").value;
    const div = document.getElementById("equation_container");
    let htmlCode = "";

    for(i = 1; i <= numOfRows; i++){
        htmlCode += ` <div class="string">`;

        for(j = 1; j <= numOfCols; j++){
            htmlCode+=`<span class="variable"> <input type="number" class="coefficient" id="x` + i + j + `">x` + j;

            if(j != numOfCols){
                    htmlCode += ` +`;
            }

            htmlCode += ` </span>`;
        }
        htmlCode += `=    <input type="number" class="coefficient" id="result` + i + `"></div>`;
    
    }
    console.log(htmlCode);
    div.innerHTML = htmlCode;

        generateMatrixInputs(n);

        generateMatrixButton.addEventListener('click', function() {
            const size = parseInt(nInput.value);
            if (isNaN(size) || size <= 0) {
                alert('Введите корректное количество неизвестных.');
                return;
            }
            generateMatrixInputs(size);
        });
    

};