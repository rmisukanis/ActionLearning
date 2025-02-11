function consoleParseCSV(deposits) {
    const resultBox = document.getElementById('result');
    resultBox.innerHTML = '';

    // Get total row count at the beginning
    const totalRows = deposits.length;

    // Display the total rows first
    const totalRowElement = document.createElement('div');
    totalRowElement.innerHTML = `<strong>Total Rows: ${totalRows}</strong>`;
    resultBox.appendChild(totalRowElement);
    
    // Iterate over the array
    deposits.forEach((item, index) => {
        // Create a new paragraph for each item in the array
        const itemElement = document.createElement('div'); // Use div instead of p for flexibility

        // Check if the item is an object
        if (typeof item === 'object' && item !== null) {
            // Iterate over the object's key-value pairs
            itemElement.innerHTML += '{';
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    // Add each key-value pair with <br> after it
                    const logEntry = `${key}: <span class="key">${item[key]}</span><br>`;
                    itemElement.innerHTML += logEntry; // Append to item element
                }
            }
            itemElement.innerHTML += '}';
        } else {
            // For non-objects (just primitive values like strings, numbers), display them
            itemElement.innerHTML = `Item ${index + 1}: ${item}`;
        }

        // Append the item element to the result-box
        resultBox.appendChild(itemElement);
    });
}
