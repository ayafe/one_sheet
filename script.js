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

function updateDepositField() {
    const totalPayment = parseFloat(document.getElementById('totalPayment').value) || 0;
    const depositField = document.getElementById('deposit');
    const depositValue = parseFloat(depositField.value) || (totalPayment * 0.5).toFixed(2);

    // Calculate percentage
    const percentage = ((depositValue / totalPayment) * 100).toFixed(2);

    // Update label with percentage
    document.querySelector('label[for="deposit"]').textContent = `Deposit ($): (${percentage}%)`;
}

function calculateTotal() {
    const guests = parseFloat(document.getElementById('guests').value) || 0;
    const pricePerPerson = parseFloat(document.getElementById('pricePerPerson').value) || 0;
    const discountPercentage = parseFloat(document.getElementById('discount').value) || 0;
    const isTaxExempt = document.getElementById('taxExempt').checked;

    // Calculate total before discount
    let totalBeforeDiscount = guests * pricePerPerson;

    // Calculate discount amount
    let discountAmount = totalBeforeDiscount * (discountPercentage / 100);
    document.getElementById('discountAmount').value = discountAmount.toFixed(2);

    // Calculate total after discount
    let totalAfterDiscount = totalBeforeDiscount - discountAmount;
    document.getElementById('totalBeforeTax').value = totalAfterDiscount.toFixed(2);

    // Calculate tax if not exempt
    const taxRate = 0.075;
    const tax = isTaxExempt ? 0 : totalAfterDiscount * taxRate;
    document.getElementById('tax').value = tax.toFixed(2);

    // Calculate gratuity
    const gratuityRate = 0.18;
    const gratuity = totalAfterDiscount * gratuityRate;
    document.getElementById('gratuity').value = gratuity.toFixed(2);

    // Calculate total payment (total after discount + tax + gratuity)
    const totalPayment = totalAfterDiscount + tax + gratuity;
    document.getElementById('totalPayment').value = totalPayment.toFixed(2);

    // Set deposit to 50% of the total payment (after discount, tax, and gratuity)
    const depositField = document.getElementById('deposit');
    depositField.value = (totalPayment * 0.5).toFixed(2);

    // Calculate payment due
    calculatePaymentDue();  // Update the payment due after calculating the total payment
}




function calculatePaymentDue() {
    const totalPayment = parseFloat(document.getElementById('totalPayment').value) || 0;
    const deposit = parseFloat(document.getElementById('deposit').value) || 0;

    const paymentDue = totalPayment - deposit;
    document.getElementById('paymentDue').value = paymentDue.toFixed(2);

    updateDepositField(); // Ensure percentage is updated when the deposit changes
}



function addBoldText(doc, label, value, x, y, lineHeight) {
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + 50, y); // Increase indentation to avoid overlap with label
    return y + lineHeight;
}

function addMultilineText(doc, text, x, y, maxWidth) {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(x, y, lines);
    return y + lines.length * 10; // Adjust y position based on number of lines
}

function formatDateTime(date, time) {
    const dateObj = new Date(`${date}T${time}`);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return dateObj.toLocaleString('en-US', options);
}

function generatePDF() {
    calculatePaymentDue(); // Ensure payment due is up-to-date

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById('name').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const formattedDateTime = formatDateTime(eventDate, eventTime);
    const eventType = document.getElementById('eventType').value;
    const eventTypeComment = document.getElementById('eventTypeComment').value;
    const guests = document.getElementById('guests').value;
    const room = document.getElementById('room').value;
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

    const lineHeight = 10;
    let yPosition = 20;

    // Add data to the PDF
    doc.setFontSize(12);
    doc.setFillColor(180, 198, 231); // Background color for "Name"
    doc.rect(10, yPosition - 8, 190, lineHeight + 2, 'F');
    yPosition = addBoldText(doc, 'Name:', name, 10, yPosition, lineHeight);

    yPosition = addBoldText(doc, 'Date and Time of Event:', formattedDateTime, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Event Type:', `${eventType} ${eventTypeComment ? `(${eventTypeComment})` : ''}`, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Amount of Guests:', guests, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Room #:', room, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, "Client's Info:", clientInfo, 10, yPosition, lineHeight);

    // Handle multiline text for menu
    yPosition = addMultilineText(doc, `Menu: ${menu}`, 10, yPosition, 190);
    yPosition = addMultilineText(doc, `Desserts: ${desserts}`, 10, yPosition, 190);

    yPosition = addBoldText(doc, 'Chosen Bar:', bar, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Other Comments:', comments, 10, yPosition, lineHeight);

    doc.setFillColor(255, 255, 0); // Yellow background for payment section
    doc.rect(10, yPosition - 8, 190, lineHeight + 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Details', 10, yPosition);
    yPosition += lineHeight;

    yPosition = addBoldText(doc, 'Price per Person ($):', pricePerPerson, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Total Before Tax ($):', totalBeforeTax, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Discount (%):', discount, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Total Discount Amount ($):', discountAmount, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Tax (7.5%):', tax, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Gratuity (18%):', gratuity, 10, yPosition, lineHeight);

    doc.setFillColor(255, 255, 0); // Yellow background for totals
    doc.rect(10, yPosition - 8, 190, lineHeight + 2, 'F');

    yPosition = addBoldText(doc, `Deposit ($): (${((parseFloat(deposit.slice(1)) / parseFloat(totalPayment.slice(1))) * 100).toFixed(2)}%)`, deposit, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Payment Due ($):', paymentDue, 10, yPosition, lineHeight);

    // Save the PDF
    doc.save(`${name}_${formattedDateTime}.pdf`);
}



async function parsePDF() {
    try {
        console.log("Starting PDF upload...");
        const file = document.getElementById('pdfUpload').files[0];
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        console.log("PDF loaded successfully.");

        const page = await pdf.getPage(1);
        console.log("Page 1 loaded.");

        const textContent = await page.getTextContent();
        console.log("Text content extracted.");

        const textItems = textContent.items.map(item => item.str);
        const text = textItems.join(' ');

        console.log("Combined text content:", text);

        // Extract fields and log results
        document.getElementById('name').value = extractText(text, 'Name:', 'Date and Time of Event:');
        document.getElementById('eventDate').value = extractText(text, 'Date and Time of Event:', 'Event Type:').substring(0, 10);
        document.getElementById('eventTime').value = extractText(text, 'Date and Time of Event:', 'Event Type:').substring(11, 16);
        document.getElementById('eventType').value = extractText(text, 'Event Type:', 'Amount of Guests:').trim();
        document.getElementById('guests').value = extractText(text, 'Amount of Guests:', 'Room #:').trim();
        document.getElementById('room').value = extractText(text, 'Room #:', "Client's Info:").trim();
        document.getElementById('clientInfo').value = extractText(text, "Client's Info:", 'DJ:').trim();

        const djText = extractText(text, 'DJ:', 'Menu:').trim();
        document.getElementById('dj').value = djText.startsWith('Yes') ? 'Yes' : 'No';
        document.getElementById('djName').value = djText.includes('Name:') ? djText.split('Name:')[1].trim() : '';

        document.getElementById('menu').value = extractText(text, 'Menu:', 'Desserts:').trim();
        document.getElementById('desserts').value = extractText(text, 'Desserts:', 'Chosen Bar:').trim();
        document.getElementById('bar').value = extractText(text, 'Chosen Bar:', 'Other Comments:').trim();
        document.getElementById('comments').value = extractText(text, 'Other Comments:', 'Payment Details').trim();
        document.getElementById('pricePerPerson').value = extractText(text, 'Price per Person ($):', 'Total Before Tax ($):').trim();
        
        const totalBeforeTax = extractText(text, 'Total Before Tax ($):', 'Discount (%):').trim();
        document.getElementById('totalBeforeTax').value = totalBeforeTax;
        
        const discount = extractText(text, 'Discount (%):', 'Total Discount Amount ($):').replace('%', '').trim();
        document.getElementById('discount').value = discount;
        
        const discountAmount = extractText(text, 'Total Discount Amount ($):', 'Tax (7.5%):').trim();
        document.getElementById('discountAmount').value = discountAmount;
        
        document.getElementById('tax').value = extractText(text, 'Tax (7.5%):', 'Gratuity (18%):').trim();
        document.getElementById('gratuity').value = extractText(text, 'Gratuity (18%):', 'Total Payment ($):').trim();
        document.getElementById('totalPayment').value = extractText(text, 'Total Payment ($):', 'Deposit ($):').trim();
        document.getElementById('deposit').value = extractText(text, 'Deposit ($):', 'Payment Due ($):').trim();
        document.getElementById('paymentDue').value = extractText(text, 'Payment Due ($):', '').trim();

        updateDepositField(); // Update percentage display

        console.log("PDF parsing completed successfully.");
    } catch (error) {
        console.error("Error during PDF parsing:", error);
    }
}


function extractText(text, start, end) {
    const startIndex = text.indexOf(start) + start.length;
    const endIndex = end ? text.indexOf(end) : text.length;
    return text.substring(startIndex, endIndex).trim();
}
function formatDate(dateStr) {
    // Convert a date string like '08/30/2024' to '2024-08-30' for the HTML date input
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function formatTime(timeStr) {
    // Convert a 12-hour time string like '10:00 PM' to '22:00' for the HTML time input
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    if (period === 'PM' && hours !== '12') {
        hours = String(parseInt(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
        hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
}

// Existing functions

async function parsePDF() {
    try {
        console.log("Starting PDF upload...");
        const file = document.getElementById('pdfUpload').files[0];
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        console.log("PDF loaded successfully.");

        const page = await pdf.getPage(1);
        console.log("Page 1 loaded.");

        const textContent = await page.getTextContent();
        console.log("Text content extracted.");

        const textItems = textContent.items.map(item => item.str);
        const text = textItems.join(' ');

        console.log("Combined text content:", text);

        // Extract fields and log results
        const name = extractText(text, 'Name:', 'Date and Time of Event:');
        console.log("Extracted Name:", name);
        document.getElementById('name').value = name;

        const dateTime = extractText(text, 'Date and Time of Event:', 'Event Type:').trim();
        const [datePart, timePart] = dateTime.split(',');

        if (datePart) {
            const formattedDate = formatDate(datePart.trim());
            console.log("Formatted Date:", formattedDate);
            document.getElementById('eventDate').value = formattedDate;
        }

        if (timePart) {
            const formattedTime = formatTime(timePart.trim());
            console.log("Formatted Time:", formattedTime);
            document.getElementById('eventTime').value = formattedTime;
        }

        // Continue with other fields
        console.log("Parsing other fields...");
        document.getElementById('eventType').value = extractText(text, 'Event Type:', 'Amount of Guests:').trim();
        document.getElementById('guests').value = extractText(text, 'Amount of Guests:', 'Room #:').trim();
        document.getElementById('room').value = extractText(text, 'Room #:', "Client's Info:").trim();
        document.getElementById('clientInfo').value = extractText(text, "Client's Info:", 'DJ:').trim();

        const djText = extractText(text, 'DJ:', 'Menu:').trim();
        if (djText.startsWith('Yes')) {
            document.getElementById('dj').value = 'Yes';
            document.getElementById('djName').value = djText.includes('Name:') ? djText.split('Name:')[1].trim() : '';
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
        
        const totalBeforeTax = extractText(text, 'Total Before Tax ($):', 'Discount (%):').replace('$', '').trim();
        document.getElementById('totalBeforeTax').value = totalBeforeTax;
        
        document.getElementById('discount').value = extractText(text, 'Discount (%):', 'Tax (7.5%):').replace('%', '').trim();
        document.getElementById('tax').value = extractText(text, 'Tax (7.5%):', 'Gratuity (18%):').replace('$', '').trim();
        document.getElementById('gratuity').value = extractText(text, 'Gratuity (18%):', 'Total Payment ($):').replace('$', '').trim();
        document.getElementById('totalPayment').value = extractText(text, 'Total Payment ($):', 'Deposit ($):').replace('$', '').trim();
        document.getElementById('deposit').value = extractText(text, 'Deposit ($):', 'Payment Due ($):').replace('$', '').trim();
        document.getElementById('paymentDue').value = extractText(text, 'Payment Due ($):', '').replace('$', '').trim();

        updateDepositField(); // Update percentage display

        console.log("PDF parsing completed successfully.");
    } catch (error) {
        console.error("Error during PDF parsing:", error);
    }
}

function generateKitchenSheetPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById('name').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const formattedDateTime = formatDateTime(eventDate, eventTime);
    const eventType = document.getElementById('eventType').value;
    const eventTypeComment = document.getElementById('eventTypeComment').value;
    const guests = document.getElementById('guests').value;
    const room = document.getElementById('room').value;
    const menu = document.getElementById('menu').value;
    const desserts = document.getElementById('desserts').value;
    const bar = document.getElementById('bar').value;
    const comments = document.getElementById('comments').value;

    const lineHeight = 10;
    let yPosition = 20;

    // Add data to the kitchen sheet PDF
    doc.setFontSize(12);
    doc.setFillColor(180, 198, 231); // Background color for "Name"
    doc.rect(10, yPosition - 8, 190, lineHeight + 2, 'F');
    yPosition = addBoldText(doc, 'Event Name:', name, 10, yPosition, lineHeight);

    yPosition = addBoldText(doc, 'Date and Time of Event:', formattedDateTime, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Event Type:', `${eventType} ${eventTypeComment ? `(${eventTypeComment})` : ''}`, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Amount of Guests:', guests, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Room #:', room, 10, yPosition, lineHeight);

    // Handle multiline text for menu
    yPosition = addMultilineText(doc, `Menu: ${menu}`, 10, yPosition, 190);
    yPosition = addMultilineText(doc, `Desserts: ${desserts}`, 10, yPosition, 190);

    yPosition = addBoldText(doc, 'Chosen Bar:', bar, 10, yPosition, lineHeight);
    yPosition = addBoldText(doc, 'Other Comments:', comments, 10, yPosition, lineHeight);

    // Save the kitchen sheet PDF
    doc.save(`${name}_Kitchen_Sheet_${formattedDateTime}.pdf`);
}
