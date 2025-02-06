function addRow() {
    const tableBody = document.getElementById('pointsTable');
    const newRow = document.createElement('tr');
    newRow.innerHTML = ` 
        <td><input type="number" class="x-input" placeholder="x"></td>
        <td><input type="number" class="y-input" placeholder="y"></td>
        <td><button onclick="removeRow(this)">Удалить</button></td>
    `; //создали содержимое строки
    tableBody.appendChild(newRow); //добавили строку в тело
}

function removeRow(button) {
    const row = button.parentNode.parentNode; // нашла родительский элемент строки для удаления
    row.parentNode.removeChild(row); //удаление из родителя
}

function calculateLagrange() {
    const xValue = parseFloat(document.getElementById('x').value);
    const points = [];
    const xInputs = document.querySelectorAll('.x-input'); //все поля для х
    const yInputs = document.querySelectorAll('.y-input'); //все поля для у

    for (let i = 0; i < xInputs.length; i++) {
        const x = parseFloat(xInputs[i].value); //из строки в число
        const y = parseFloat(yInputs[i].value);
        if (!isNaN(x) && !isNaN(y)) {
            points.push({ x, y }); //добавление в массив
        }
    }
    const resultDiv = document.getElementById('result'); 
    //здесь уже вычисления надо добавить
        resultDiv.innerHTML = "Вычисление для x = " + xValue + " с точками: " + JSON.stringify(points);
}
