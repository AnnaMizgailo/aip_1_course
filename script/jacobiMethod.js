document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate-matrix');
    const solveButton = document.getElementById('solve-button');
    const matrixContainer = document.getElementById('matrix-container');
    const matrixSize = document.getElementById('n');
    const toleranceInput = document.getElementById('tolerance');
    const maxIterationsInput = document.getElementById('max-iterations');
    const infoButton = document.getElementById('info-button');
    
    let n = 0; 

    generateButton.addEventListener('click', () => {
      n = parseInt(matrixSize.value);
      if (isNaN(n) || n < 1) {
        alert("Введите корректный размер (целое число > 0)");
        return;
      }
  
      matrixContainer.innerHTML = ''; // Очищаем контейнер
  
      const table = createMatrixTable(n, n + 1); // n строк, n+1 столбец (для b)
      matrixContainer.appendChild(table);
      solveButton.disabled = false;
    });
    function createMatrixTable(rows, cols) {
        const table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
          const row = table.insertRow();
          for (let j = 0; j < cols; j++) {
            const cell = row.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            input.step = "any";
            if(j !== cols - 1){
                input.id = "x" + i + j;
            }else{
                input.id = "result" + i;
            }
            
            cell.appendChild(input);

            if (j < cols - 2 ){
                const cell1 = row.insertCell();
                const el1 = document.createElement('div');
                el1.innerHTML = 'x' + j + "+";
                cell1.appendChild(el1);
            }
            if (j==cols-2){
                const cell1 = row.insertCell();
                const el1 = document.createElement('div');
                el1.innerHTML = 'x' + j + "=";
                cell1.appendChild(el1);
            }
          }
        }
        return table;
      }
    
    function isMatrixFilled(n){
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (document.getElementById("x"+i+j).value === ""){
            alert(`Ячейка ${i} ${j} пустая`);
            return false;
          }
        }
        if (document.getElementById("result"+i).value===""){
          alert(`Ячейка result ${i} пустая`);
          return false;
        }
      }
      return true;
    }

    solveButton.addEventListener('click', () => {
      if (!isMatrixFilled(n)) {
        return;
      }
      const tolerance = parseFloat(toleranceInput.value);
      const maxIterations = parseInt(maxIterationsInput.value);
      if (isNaN(tolerance) || tolerance <= 0) {
        alert("Введите корректную погрешность (положительное число).");
        return;
      }
      if (isNaN(maxIterations) || maxIterations <= 0) {
        alert("Введите корректное максимальное количество итераций (целое число > 0).");
        return;
      }
      if (!checkDiagonalDominance(n)) {
        alert("Матрица не является диагонально доминирующей. Попробуем привести ее к нужному виду");
        makeDiagonallyDominant(n);
      }else{
        alert ("Матрциа диагонально доминирующая");
      }
      displayMatrix(n);
      jacobi(n, tolerance, maxIterations);
    });

    //проверяем, что матрица диагонально доминирующая 
    function checkDiagonalDominance(n) {
      for (let i = 0; i < n; i++) {
        let rowSum = 0;
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            rowSum += Math.abs(parseFloat(document.getElementById("x" + i + j).value));
          }
        }
        let SumAii=0;
        SumAii = Math.abs(parseFloat(document.getElementById("x" + i + i).value));
        if (SumAii<=rowSum)
          return false;
      }
      return true;
    }
    
    function makeDiagonallyDominant(n) { //попытаемся привести к виду диагольного доминирования
      let swaps = 0;
      for (let i = 0; i < n; i++) {
        let maxVal = 0;
        let maxRow = i;
        for (let k = i; k < n; k++) {
          let akk = Math.abs(parseFloat(document.getElementById("x" + k + i).value));
          if (akk > maxVal) {
              maxVal = akk;
              maxRow = k;
          }
        }
        if (maxRow !== i) {
          swapRows(n, i, maxRow);
          swaps++;
        }
      }
      if (!checkDiagonalDominance(n)){
        alert("Не удалось привести к диагональному доминированию. Решение может не сойтись");
      }else{
        alert("Матрица диагонально доминирующая");
      }

    }

    function swapRows(n, row1, row2) {
    for (let j = 0; j < n + 1; j++) {
      let element1, element2;
      if (j === n) {
        element1 = document.getElementById("result" + row1);
        element2 = document.getElementById("result" + row2);
      } else {
        element1 = document.getElementById("x" + row1 + j);
        element2 = document.getElementById("x" + row2 + j);
      }
        let temp = element1.value;
        element1.value = element2.value;
        element2.value = temp;
    }
  }
  function displayMatrix(n) {
    const matrixDisplay = document.getElementById('matrix-display');
    matrixDisplay.innerHTML = ''; 
    const table = document.createElement('table');
    for (let i = 0; i < n; i++) {
      const row = table.insertRow();
      for (let j = 0; j < n + 1; j++) {
          const cell = row.insertCell();
          let value;
          if (j === n) {
              value = parseFloat(document.getElementById("result" + i).value).toFixed(3);
          } else {
              value = parseFloat(document.getElementById("x" + i + j).value).toFixed(3);
          }
          cell.textContent = value;
      }
  }
    matrixDisplay.appendChild(table);
  }
  function jacobi(n, tolerance, maxIterations) {
    let x = new Array(n).fill(0); // начальное приближение
    let xNew = new Array(n).fill(0); //тут будут решения
    let iteration = 0; 
    let outputString = ""; 
    let resultoutput = document.getElementById("result-output");
    while (iteration < maxIterations) {
    outputString += `<b>Итерация ${iteration + 1}:</b><br>`;
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
            sum += parseFloat(document.getElementById("x" + i + j).value) * x[j];
        }
      }
      let b = parseFloat(document.getElementById("result" + i).value);
      let aii = parseFloat(document.getElementById("x" + i + i).value);
      if (aii === 0) {
        outputString += `<br>Ошибка: диагональный элемент a<sub>${i + 1}${i + 1}</sub> равен нулю.<br>`;
        resultoutput.innerHTML = outputString;
        return;
      }
      xNew[i] = (b - sum) / aii;
      outputString += `x<sub>${i + 1}</sub> = (${b} - ${sum.toFixed(6)}) / ${aii} = ${xNew[i].toFixed(6)}<br>`; 
      }
      let accuracy = 0;
      for (let i = 0; i < n; i++) {
        accuracy += Math.abs(xNew[i] - x[i]);
      }
      if (accuracy < tolerance) {
        outputString += `<br>Решение найдено за ${iteration + 1} итераций:<br>`;
        for (let i = 0; i < n; i++) {
          outputString +=  `x<sub>${i + 1}</sub> = ${xNew[i].toFixed(6)}<br> `;
        }
        resultoutput.innerHTML = outputString;
        return;
      }
      x = [...xNew];
      iteration++;
    }
    outputString += `<br>Решение не найдено за ${maxIterations} итераций.<br>`;
    resultoutput.innerHTML = outputString;
  }
  infoButton.addEventListener('click', () => {
    const infoDiv = document.createElement('div');
    infoDiv.id = 'jacobi-info';
    infoDiv.innerHTML = `
    <h2>Метод Якоби</h2>
    <p>
      Метод Якоби - это итерационный способ решения системы линейных алгебраических уравнений (СЛАУ). 
      Он работает, выражая каждую переменную в системе через остальные, и затем последовательно уточняя значения этих переменных на каждой итерации.
    </p>
    
    <h3>Основные шаги метода:</h3>
    <ol>
      <li><b>Подготовка системы:</b> Убедитесь, что на главной диагонали матрицы коэффициентов нет нулевых элементов. По возможности, выполните перестановку строк для улучшения диагонального доминирования.</li>
      <li><b>Разрешение уравнений:</b> Выразите каждую переменную <i>x<sub>i</sub></i> через остальные переменные и свободный член <i>b<sub>i</sub></i> соответствующего уравнения.</li>
      <li><b>Начальное приближение:</b> Выберите начальные значения для всех переменных. Часто в качестве начального приближения используют нулевые значения (<i>x<sub>i</sub></i> = 0).</li>
      <li><b>Итерации:</b> Последовательно вычисляйте новые значения переменных, используя значения с предыдущей итерации.</li>
      <li><b>Критерий остановки:</b> Продолжайте итерации до достижения заданной точности или превышения максимального числа итераций.</li>
    </ol>
    
    <h3>Пример:</h3>
    <p>
      Рассмотрим следующую систему уравнений:
    </p>
    <p>
        10<i>x</i><sub>1</sub> + <i>x</i><sub>2</sub> - <i>x</i><sub>3</sub> = 11<br>
        <i>x</i><sub>1</sub> + 10<i>x</i><sub>2</sub> - <i>x</i><sub>3</sub> = 10<br>
        -<i>x</i><sub>1</sub> + <i>x</i><sub>2</sub> + 10<i>x</i><sub>3</sub> = 10
    </p>
    <p>
     Начальное приближение: <i>x</i> = [0, 0, 0]. После нескольких итераций метод Якоби сходится к решению <i>x</i> = [1.102000, 0.990900, 1.011100].
    </p>
  `;
    document.body.appendChild(infoDiv);
    infoButton.style.display = 'none';

  });
  })