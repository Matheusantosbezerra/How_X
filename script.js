document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.getElementById('add-item');
    const generateReportButton = document.getElementById('generate-report');
    const itemInput = document.getElementById('item-input');
    const priceInput = document.getElementById('price-input');
    const qtdInput = document.getElementById('qtd-input');
    const shoppingList = document.getElementById('shopping-list');
    // const historyList = document.getElementById('history-list');
    const clearHistoryButton = document.getElementById('clear-history');
    const historyTableBody = document.getElementById('history-list');
    const dateToday = document.getElementById('date-today');
    const totalSumElement = document.getElementById('total-sum');

    const updateDate = () => {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        dateToday.textContent = `${day}/${month}/${year}`;
    };
    updateDate();

    const updateHistory = () => {
        const items = JSON.parse(localStorage.getItem('shoppingHistory')) || [];
        historyTableBody.innerHTML = '';
        let totalSum = 0;
        items.forEach(item => {
            const total = item.qtd * item.price;
            totalSum += total;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.qtd}</td><td>${item.name}</td><td>R$${item.price}</td><td>R$${total.toFixed(2)}</td>`;
            historyTableBody.appendChild(row);
        });
        totalSumElement.textContent = `R$${totalSum.toFixed(2)}`;
    };

    const addItem = () => {
        const itemText = itemInput.value;
        const itemPrice = parseFloat(priceInput.value).toFixed(2); 
        const itemQtd = qtdInput.value;
        if (itemText.trim() && itemPrice.trim() && itemQtd.trim()) {
            const li = document.createElement('li');
            li.innerHTML = `<span>${itemQtd} - ${itemText} - R$${itemPrice}</span> <button class="btn-secondary" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>`;
            shoppingList.appendChild(li);
            itemInput.value = '';
            priceInput.value = '';
            qtdInput.value = '';

            // pra salvar o Historico
            const history = JSON.parse(localStorage.getItem('shoppingHistory')) || [];
            history.push({ qtd: itemQtd, name: itemText, price: itemPrice});
            localStorage.setItem('shoppingHistory', JSON.stringify(history));
            updateHistory();
        }
    };

    window.removeItem = (button) => {
        const li = button.parentElement;
        // const itemText = li.querySelector('span').textContent.split(' - ')[0];
        const itemDetails = li.querySelector('span').textContent.split(' - ');
        const itemQtd = itemDetails[0].replace('Qtd', '').trim();
        const itemName = itemDetails[1].trim();
        const itemPrice = itemDetails[2].replace('R$', '').trim();
        
        // Remove o item da lista
        shoppingList.removeChild(li);
        
        let history = JSON.parse(localStorage.getItem('shoppingHistory')) || [];
        history = history.filter(item => !(item.qtd === itemQtd && item.name === itemName && item.price === itemPrice ));
        localStorage.setItem('shoppingHistory', JSON.stringify(history));
        updateHistory();
    };
    const clearHistory = () => {
        localStorage.removeItem('shoppingHistory');
        updateHistory();
    };

    const saveReportToDatabase = async () => {
        const items = JSON.parse(localStorage.getItem('shoppingHistory')) || [];
        try {
            const response = await fetch('URL_DO_SEU_SERVIDOR', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items })
            });
            const result = await response.json();
            console.log('Relatório salvo:', result);
        } catch (error) {
            window.alert('Erro ao salvar o relatório',error);
            console.error('Erro ao salvar o relatório:', error);
        }
    };

    addItemButton.addEventListener('click', addItem);
    generateReportButton.addEventListener('click', () => {
        updateHistory();
        saveReportToDatabase();
    });
    clearHistoryButton.addEventListener('click', clearHistory);

    updateHistory();

});
