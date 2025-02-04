document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate-matrix');
    const matrixContainer = document.getElementById('matrix-container');
    const matrixSize = document.getElementById('n');
  
    generateButton.addEventListener('click', () => {
      const n = parseInt(matrixSize.value);
      if (isNaN(n) || n < 1) {
        alert("Введите корректный размер (целое число > 0)");
        return;
      }
  
      matrixContainer.innerHTML = ''; // Очищаем контейнер
  
      const table = createMatrixTable(n, n + 1); // n строк, n+1 столбец (для b)
      matrixContainer.appendChild(table);
    });
    function createMatrixTable(rows, cols) {
        const table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
          const row = table.insertRow();
          for (let j = 0; j < cols; j++) {
            const cell = row.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            cell.appendChild(input);
          }
        }
        return table;
      }
    }); 