function toggleDJName() {
    const djSelection = document.getElementById('dj').value;
    const djNameField = document.getElementById('djName');
    if (djSelection === 'Yes') {
        djNameField.style.display = 'inline';
        djNameField.required = true;
    } else {
        djNameField.style.display = 'none';
        djNameField.required = false;
    }
}



function calculateTotalEventTime() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (startTime && endTime) {
        const start = new Date(`1970-01-01T${startTime}Z`);
        const end = new Date(`1970-01-01T${endTime}Z`);

        let diff = (end - start) / (1000 * 60); // Difference in minutes

        if (diff < 0) {
            diff += 24 * 60; // Handle overnight events
        }

        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;

        let totalTime;
        if (minutes === 0) {
            totalTime = `${hours} hour(s)`;
        } else {
            totalTime = `${hours} hour(s) and ${minutes} minute(s)`;
        }

        document.getElementById('totalEventTime').value = totalTime;
    }
}

function generatePDF() {
    calculateTotal(); // Ensure all calculations are up-to-date

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById('name').value;
    const room = document.getElementById('room').value;
    const eventDate = document.getElementById('eventDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const totalEventTime = document.getElementById('totalEventTime').value;
    const eventType = document.getElementById('eventType').value;
    const eventTypeComment = document.getElementById('eventTypeComment').value;
    const guests = document.getElementById('guests').value;
    const clientInfo = document.getElementById('clientInfo').value;
    const dj = document.getElementById('dj').value;
    const djName = document.getElementById('djName').value;
    const menu = document.getElementById('menu').value;
    const desserts = document.getElementById('desserts').value;
    const bar = document.getElementById('bar').value;
    const comments = document.getElementById('comments').value;
    const pricePerPerson = `$${document.getElementById('pricePerPerson').value}`;
    const totalBeforeTax = `$${document.getElementById('totalBeforeTax').value}`;
    const discount = `${document.getElementById('discount').value}%`;
    const discountAmount = `$${document.getElementById('discountAmount').value}`;
    const tax = `$${document.getElementById('tax').value}`;
    const gratuity = `$${document.getElementById('gratuity').value}`;
    const totalPayment = `$${document.getElementById('totalPayment').value}`;
    const deposit = `$${document.getElementById('deposit').value}`;
    const paymentDue = `$${document.getElementById('paymentDue').value}`;

    // Customizable values
    let lineHeight = 8; // Increase for more space between lines
    let fontSize = 12; // Change to adjust text size

    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Set font size globally
    doc.setFontSize(fontSize);

    function checkPageBreak(doc, yPosition, lineHeight) {
        if (yPosition + lineHeight > pageHeight - 20) {
            doc.addPage();
            return 20; // Reset yPosition to the top of the new page
        }
        return yPosition;
    }

    // Add data to the PDF
    doc.setFillColor(180, 198, 231); // Background color for "Name"
    doc.rect(10, yPosition - 8, 190, lineHeight + 2, 'F');
    yPosition = addBoldText(doc, 'Name:', name, 10, yPosition, lineHeight);
	yPosition = addBoldText(doc, 'Room #:', room, 110, yPosition - lineHeight, lineHeight); // Align with the same line


    yPosition = checkPageBreak(doc, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Date of Event:', eventDate, 10, yPosition, lineHeight);
    
    // Start Time and End Time on the same line
    yPosition = checkPageBreak(doc, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Start Time:', startTime, 10, yPosition, lineHeight);
yPosition = addBoldText(doc, 'End Time:', endTime, 110, yPosition - lineHeight, lineHeight); // No need to increment yPosition after this

    yPosition += lineHeight; // Move to the next line after adding Start and End Time

    yPosition = addBoldText(doc, 'Total Event Time (hours):', totalEventTime, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Event Type:', `${eventType} ${eventTypeComment ? `(${eventTypeComment})` : ''}`, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Number of Guests:', guests, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, "Client's Info:", clientInfo, 10, yPosition, lineHeight);

    // DJ Required and DJ Name on the same line
    yPosition = checkPageBreak(doc, yPosition, lineHeight);
yPosition = addBoldText(doc, 'DJ Required:', dj, 10, yPosition, lineHeight);
if (dj === 'Yes' && djName) {
    yPosition = addBoldText(doc, 'DJ Name:', djName, 110, yPosition - lineHeight, lineHeight); // Align with the same line, no extra space
}

    yPosition += lineHeight; // Move to the next line after adding DJ info

    // Handle Menu and Desserts
    yPosition = checkPageBreak(doc, yPosition, lineHeight);
    yPosition = addRegularText(doc, 'Menu:', 10, yPosition);
    yPosition = addBoldMultilineText(doc, menu, 10, yPosition, 190, lineHeight); // Pass lineHeight to the function

    yPosition = checkPageBreak(doc, yPosition, lineHeight);
    yPosition = addRegularText(doc, 'Desserts:', 10, yPosition);
    yPosition = addBoldMultilineText(doc, desserts, 10, yPosition, 190, lineHeight); // Pass lineHeight to the function

    yPosition = checkPageBreak(doc, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Chosen Bar:', bar, 10, yPosition, lineHeight);

    // Print Additional Items
    const additionalItems = document.querySelectorAll('#additionalItemsContainer .item');
    if (additionalItems.length > 0) {
        yPosition = checkPageBreak(doc, yPosition, lineHeight);
        yPosition = addBoldText(doc, 'Additional Items:', '', 10, yPosition, lineHeight);
        additionalItems.forEach(item => {
            yPosition = checkPageBreak(doc, yPosition, lineHeight);
            const itemName = item.querySelector('input[type="text"]').value;
            const itemPrice = `$${item.querySelector('input[type="number"]').value}`;
            yPosition = addBoldText(doc, `  ${itemName}:`, itemPrice, 10, yPosition, lineHeight);
        });
    }

    // Add Other Comments
    yPosition = checkPageBreak(doc, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Other Comments:', comments, 10, yPosition, lineHeight);

    // Payment Details section
yPosition = checkPageBreak(doc, yPosition, lineHeight);
yPosition += 2; // Add this line to prevent overlap
doc.setFillColor(255, 255, 0); // Yellow background for payment section
doc.rect(10, yPosition - 8, 190, lineHeight + 2, 'F');
doc.setFont('helvetica', 'normal');
doc.text('Payment Details', 10, yPosition);
yPosition += lineHeight;


    yPosition = checkPageBreak(doc, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Price per Person ($):', pricePerPerson, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Total Before Tax ($):', totalBeforeTax, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Discount (%):', discount, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Total Discount Amount ($):', discountAmount, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Tax (7.5%):', tax, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Gratuity (18%):', gratuity, 10, yPosition, lineHeight);

    // Totals and Payment Due
	yPosition
    yPosition = checkPageBreak(doc, yPosition, lineHeight);
    doc.setFillColor(255, 255, 0); // Yellow background for totals
    doc.rect(10, yPosition - 8, 190, lineHeight + 2, 'F');
	yPosition = addBoldText(doc, 'Total Payment ($):', totalPayment, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, `Deposit ($): (${((parseFloat(deposit.slice(1)) / parseFloat(totalPayment.slice(1))) * 100).toFixed(2)}%)`, deposit, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Payment Due ($):', paymentDue, 10, yPosition, lineHeight);
	
    // Save the PDF
    doc.save(`${name}_${eventDate}.pdf`);
}

function addBoldText(doc, label, value, x, y, lineHeight = 10) {
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + 50, y);
    return y + lineHeight;
}

function addRegularText(doc, text, x, y) {
    doc.setFont('helvetica', 'normal');
    doc.text(text, x, y);
    return y + 10; // Increment y position
}

function addBoldMultilineText(doc, text, x, y, maxWidth, lineHeight) {
    doc.setFont('helvetica', 'bold');
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(x, y, lines);
    return y + lines.length * lineHeight; // Adjust y position based on number of lines
}




function generateKitchenSheetPDF() {
   calculateTotal(); // Ensure all calculations are up-to-date

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById('name').value;
    const eventDate = document.getElementById('eventDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const totalEventTime = document.getElementById('totalEventTime').value;
    const eventType = document.getElementById('eventType').value;
    const eventTypeComment = document.getElementById('eventTypeComment').value;
    const guests = document.getElementById('guests').value;
    const room = document.getElementById('room').value;
    const menu = document.getElementById('menu').value;
    const desserts = document.getElementById('desserts').value;
    const bar = document.getElementById('bar').value;
    const comments = document.getElementById('comments').value;
    const dj = document.getElementById('dj').value;
    const djName = document.getElementById('djName').value;

    const lineHeight = 10;
    let yPosition = 20;

    // Add data to the kitchen sheet PDF
    doc.setFontSize(12);
    doc.setFillColor(180, 198, 231); // Background color for "Name"
    doc.rect(10, yPosition - 8, 190, lineHeight + 2, 'F');
    yPosition = addBoldText(doc, 'Event Name:', name, 10, yPosition, lineHeight);

    yPosition = addBoldText(doc, 'Date of Event:', eventDate, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Start Time:', startTime, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'End Time:', endTime, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Total Event Time (hours):', totalEventTime, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Event Type:', `${eventType} ${eventTypeComment ? `(${eventTypeComment})` : ''}`, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Number of Guests:', guests, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Room #:', room, 10, yPosition, lineHeight);

    // Add DJ information
    yPosition = addBoldText(doc, 'DJ Required:', dj, 10, yPosition, lineHeight);
    if (dj === 'Yes' && djName) {
        yPosition = addBoldText(doc, 'DJ Name:', djName, 10, yPosition, lineHeight);
    }

    // Handle multiline text for menu
    yPosition = addMultilineText(doc, `Menu: ${menu}`, 10, yPosition, 190);
    yPosition = addMultilineText(doc, `Desserts: ${desserts}`, 10, yPosition, 190);

    yPosition = addBoldText(doc, 'Chosen Bar:', bar, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Other Comments:', comments, 10, yPosition, lineHeight);

    // Save the kitchen sheet PDF
    doc.save(`${name}_Kitchen_One_Sheet.pdf`);
}


async function parsePDF() {
    try {
        const file = document.getElementById('pdfUpload').files[0];
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map(item => item.str);
        const text = textItems.join(' ');

        // Extract and map fields with better isolation of data
        document.getElementById('name').value = extractText(text, 'Name:', 'Date of Event:').trim();
        document.getElementById('eventDate').value = extractText(text, 'Date of Event:', 'Start Time:').trim();
        document.getElementById('startTime').value = extractText(text, 'Start Time:', 'End Time:').trim();
        document.getElementById('endTime').value = extractText(text, 'End Time:', 'Total Event Time (hours):').trim();
        document.getElementById('totalEventTime').value = extractText(text, 'Total Event Time (hours):', 'Event Type:').trim();

        // Extract event type and comment correctly
        const eventTypeWithComment = extractText(text, 'Event Type:', 'Number of Guests:').trim();
        const eventType = findMatchingEventType(eventTypeWithComment);
        const eventTypeComment = extractEventComment(eventTypeWithComment, eventType);
        document.getElementById('eventType').value = eventType;
        document.getElementById('eventTypeComment').value = eventTypeComment;

        // Correctly extract the number of guests and the room number
        document.getElementById('guests').value = extractText(text, 'Number of Guests:', 'Room #:').trim();
        document.getElementById('room').value = extractText(text, 'Room #:', "Client's Info:").trim();

        document.getElementById('clientInfo').value = extractText(text, "Client's Info:", 'DJ Required:').trim();

        // Extract and handle DJ information correctly
        const djInfo = extractText(text, 'DJ Required:', 'Menu:').trim();
        if (djInfo.startsWith('Yes')) {
            document.getElementById('dj').value = 'Yes';
            document.getElementById('djName').value = extractText(text, 'DJ Name:', 'Menu:').trim();
            document.getElementById('djName').style.display = 'inline';
        } else {
            document.getElementById('dj').value = 'No';
            document.getElementById('djName').style.display = 'none';
            document.getElementById('djName').value = '';
        }

        document.getElementById('menu').value = extractText(text, 'Menu:', 'Desserts:').trim();
        document.getElementById('desserts').value = extractText(text, 'Desserts:', 'Chosen Bar:').trim();
        document.getElementById('bar').value = extractText(text, 'Chosen Bar:', 'Other Comments:').trim();
        document.getElementById('comments').value = extractText(text, 'Other Comments:', 'Payment Details').trim();

        document.getElementById('pricePerPerson').value = extractText(text, 'Price per Person ($):', 'Total Before Tax ($):').replace('$', '').trim();
        document.getElementById('totalBeforeTax').value = extractText(text, 'Total Before Tax ($):', 'Discount (%):').replace('$', '').trim();
        document.getElementById('discount').value = extractText(text, 'Discount (%):', 'Total Discount Amount ($):').replace('%', '').trim();
        document.getElementById('discountAmount').value = extractText(text, 'Total Discount Amount ($):', 'Tax (7.5%):').replace('$', '').trim();
        document.getElementById('tax').value = extractText(text, 'Tax (7.5%):', 'Gratuity (18%):').replace('$', '').trim();
        document.getElementById('gratuity').value = extractText(text, 'Gratuity (18%):', 'Deposit ($):').replace('$', '').trim();
        document.getElementById('totalPayment').value = extractText(text, 'Total Payment ($):', 'Deposit ($):').replace('$', '').trim();
        document.getElementById('deposit').value = extractText(text, 'Deposit ($):', 'Payment Due ($):').replace('$', '').trim();
        document.getElementById('paymentDue').value = extractText(text, 'Payment Due ($):', '').replace('$', '').trim();

        // Handle additional items
        const additionalItemsText = extractText(text, 'Additional Items:', 'Other Comments:');
        if (additionalItemsText) {
            const additionalItemsArray = additionalItemsText.split('  ').filter(item => item.trim());
            additionalItemsArray.forEach(itemText => {
                const [itemName, itemPrice] = itemText.split(':').map(s => s.trim());
                addItemToForm(itemName, itemPrice);
            });
        }

        console.log("PDF parsing completed successfully.");
    } catch (error) {
        console.error("Error during PDF parsing:", error);
    }
}

// Add the extracted additional items to the form
function addItemToForm(itemName, itemPrice) {
    const container = document.getElementById('additionalItemsContainer');
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    const itemNameInput = document.createElement('input');
    itemNameInput.type = 'text';
    itemNameInput.value = itemName;
    itemNameInput.required = true;

    const itemPriceInput = document.createElement('input');
    itemPriceInput.type = 'number';
    itemPriceInput.value = parseFloat(itemPrice.replace('$', ''));
    itemPriceInput.min = '0';
    itemPriceInput.step = '0.01';
    itemPriceInput.required = true;
    itemPriceInput.oninput = calculateTotal;

    const removeLink = document.createElement('a');
    removeLink.href = '#';
    removeLink.className = 'remove-item';
    removeLink.textContent = '- Remove';
    removeLink.onclick = function (event) {
        event.preventDefault();
        container.removeChild(itemDiv);
        calculateTotal();
    };

    itemDiv.appendChild(itemNameInput);
    itemDiv.appendChild(itemPriceInput);
    itemDiv.appendChild(removeLink);
    container.appendChild(itemDiv);
}

function extractText(text, start, end) {
    const startIndex = text.indexOf(start) + start.length;
    const endIndex = end ? text.indexOf(end) : text.length;
    return text.substring(startIndex, endIndex).trim();
}

function findMatchingEventType(extractedEventType) {
    const eventTypeSelect = document.getElementById('eventType');
    const options = Array.from(eventTypeSelect.options);
    const match = options.find(option => extractedEventType.includes(option.value));
    return match ? match.value : '';
}

function extractEventComment(eventTypeWithComment, eventType) {
    const commentStartIndex = eventTypeWithComment.indexOf(eventType) + eventType.length;
    const comment = eventTypeWithComment.substring(commentStartIndex).trim();
    return comment.startsWith('(') && comment.endsWith(')') ? comment.slice(1, -1) : comment;
}


function formatDate(dateStr) {
    return dateStr; // Assuming the date is already in the correct format
}

function formatTime(timeStr) {
    return timeStr; // Assuming the time is already in the correct format
}

function addItem(event) {
    if (event) event.preventDefault(); // Prevent the default link behavior

    const container = document.getElementById('additionalItemsContainer');

    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    const itemName = document.createElement('input');
    itemName.type = 'text';
    itemName.placeholder = 'Item Name';
    itemName.required = true;

    const itemPrice = document.createElement('input');
    itemPrice.type = 'number';
    itemPrice.placeholder = 'Item Price ($)';
    itemPrice.min = '0';
    itemPrice.step = '0.01';
    itemPrice.required = true;
    itemPrice.oninput = calculateTotal;

    const removeLink = document.createElement('a');
    removeLink.href = '#';
    removeLink.className = 'remove-item';
    removeLink.textContent = '- Remove';
    removeLink.onclick = function(event) {
        event.preventDefault();
        container.removeChild(itemDiv);
        calculateTotal();
    };

    itemDiv.appendChild(itemName);
    itemDiv.appendChild(itemPrice);
    itemDiv.appendChild(removeLink);
    container.appendChild(itemDiv);
}

document.getElementById('addItemLink').addEventListener('click', addItem);




function calculateTotal() {
    const guests = parseFloat(document.getElementById('guests').value) || 0;
    const pricePerPerson = parseFloat(document.getElementById('pricePerPerson').value) || 0;
    let totalBeforeDiscount = guests * pricePerPerson;

    // Calculate total for additional items
    const additionalItems = document.querySelectorAll('#additionalItemsContainer .item input[type="number"]');
    additionalItems.forEach(item => {
        totalBeforeDiscount += parseFloat(item.value) || 0;
    });

    // Get the discount amount (fixed amount)
    const discountAmount = parseFloat(document.getElementById('discount').value) || 0;

    // Calculate the discount percentage based on the total before discount
    const discountPercentage = totalBeforeDiscount > 0 ? (discountAmount / totalBeforeDiscount) * 100 : 0;
    document.getElementById('discountAmount').value = discountPercentage.toFixed(2) + '%';

    // Calculate the total after applying the discount
    const totalAfterDiscount = totalBeforeDiscount - discountAmount;
    document.getElementById('totalBeforeTax').value = totalAfterDiscount.toFixed(2);

    // Handle tax exemption
    const isTaxExempt = document.getElementById('taxExempt').checked;
    const taxRate = 0.075;
    const tax = isTaxExempt ? 0 : totalAfterDiscount * taxRate;
    document.getElementById('tax').value = tax.toFixed(2);

    // Calculate gratuity
    const gratuityRate = 0.18;
    const gratuity = totalAfterDiscount * gratuityRate;
    document.getElementById('gratuity').value = gratuity.toFixed(2);

    // Calculate total payment
    const totalPayment = totalAfterDiscount + tax + gratuity;
    document.getElementById('totalPayment').value = totalPayment.toFixed(2);

    // Update deposit field and label
    updateDepositField();

    // Calculate payment due
    calculatePaymentDue();
}


function updateDepositField() {
    const totalPayment = parseFloat(document.getElementById('totalPayment').value) || 0;
    const depositField = document.getElementById('deposit');
    const userEnteredDeposit = parseFloat(depositField.value);

    // If the user hasn't entered a deposit, default to 50% of the total payment
    const depositValue = !isNaN(userEnteredDeposit) && userEnteredDeposit > 0 
        ? userEnteredDeposit 
        : totalPayment * 0.5;

    // Calculate percentage
    const percentage = ((depositValue / totalPayment) * 100).toFixed(2);

    // Update label with percentage
    document.querySelector('label[for="deposit"]').textContent = `Deposit ($): (${percentage}%)`;

    // Update the deposit field value
    depositField.value = depositValue.toFixed(2);
}


function calculatePaymentDue() {
    const totalPayment = parseFloat(document.getElementById('totalPayment').value) || 0;
    const deposit = parseFloat(document.getElementById('deposit').value) || 0;

    const paymentDue = totalPayment - deposit;
    document.getElementById('paymentDue').value = paymentDue.toFixed(2);
}

function addMultilineText(doc, text, x, y, maxWidth) {
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(x, y, lines);
    return y + lines.length * 10; // Adjust y position based on number of lines
}


