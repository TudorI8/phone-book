const nameInputElement = document.querySelector('#name');
const phoneInputElement = document.querySelector('#phone');
const addOrEditContactButton = document.querySelector('.add-contact-btn');

const phoneNumberDetails = [];

const table = document.querySelector('#phone-book-table');
const rows = table.querySelectorAll('tr');

for (let i = 1; i <= rows.length - 1; i++) {
	phoneNumberDetails.push({
		name: rows[i].querySelector('td:nth-child(1)').innerHTML,
		phoneNumber: rows[i].querySelector('td:nth-child(2)').innerHTML,
	});
}

const errorOutputParagraph = document.querySelector('#error-output');

let tableRowToBeEdited = null;

addOrEditContactButton.addEventListener('click', () => {
    if (addOrEditContactButton.classList.contains('add-contact-btn')) {
        addNewContact();
    } else if (addOrEditContactButton.classList.contains('edit-contact-btn')) {
        editContact();
    }
    updateTableCorners();
});

phoneInputElement.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (addOrEditContactButton.classList.contains('add-contact-btn')) {
            addNewContact();
        } else if (addOrEditContactButton.classList.contains('edit-contact-btn')) {
            editContact();
        }
    }
});

function isPhoneNumberUnique(phoneNumber, ignoreIndex = -1) {
    return !phoneNumberDetails.some((contact, index) =>
        contact.phoneNumber === phoneNumber && index !== ignoreIndex
    );
}

function addNewContact() {
	const name = nameInputElement.value.trim();
	const phoneNumber = phoneInputElement.value.trim();

    if (name.length < 3 || phoneNumber.length < 3) {
		errorOutputParagraph.innerHTML =
			'The name and phone number must contain at least 3 characters';
		errorOutputParagraph.style.color = 'red';
		return;
	}

	if (!isPhoneNumberUnique(phoneNumber)) {
    errorOutputParagraph.innerHTML = 'Phone number already exists for another contact';
    errorOutputParagraph.style.color = 'red';
    return;
	}

	if (!table.querySelector('thead')) {
        const thead = createTableHeader();
        table.appendChild(thead);
    }

	phoneNumberDetails.push({
		name: name,
		phoneNumber: phoneNumber,
	});

	const tableBody = document.createElement('tbody');

	const tableRow = document.createElement('tr');
	const nameTableData = document.createElement('td');
	nameTableData.innerHTML =
		phoneNumberDetails[phoneNumberDetails.length - 1].name;

	const phoneNumberTableData = document.createElement('td');
	phoneNumberTableData.innerHTML =
		phoneNumberDetails[phoneNumberDetails.length - 1].phoneNumber;

    const editButtonElement = document.createElement('td');
	editButtonElement.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

	const deleteButtonElement = document.createElement('td');
	deleteButtonElement.innerHTML = '<i class="fa-solid fa-trash"></i>';

	tableRow.appendChild(nameTableData);
	tableRow.appendChild(phoneNumberTableData);
    tableRow.appendChild(editButtonElement);
	tableRow.appendChild(deleteButtonElement);

	tableBody.appendChild(tableRow);
	table.appendChild(tableBody);

	updateTableCorners();
    clearInputElements();
}

function createTableHeader() {
	const nameHeader = document.createElement('th');
	nameHeader.innerHTML = 'Name';

	const phoneNumberHeader = document.createElement('th');
	phoneNumberHeader.innerHTML = 'Phone Number';

	const editHeader = document.createElement('th');
	editHeader.innerHTML = 'Edit';

	const deleteHeader = document.createElement('th');
	deleteHeader.innerHTML = 'Delete';

	const thead = document.createElement('thead');
	thead.appendChild(nameHeader);
	thead.appendChild(phoneNumberHeader);
	thead.appendChild(editHeader);
	thead.appendChild(deleteHeader);

	return thead;
}

table.addEventListener('click', handleTableActions);

function handleTableActions(e) {
    if (e.target.classList.contains('fa-trash')) {
        const row = e.target.parentElement.parentElement;
        const name = row.querySelector('td:nth-child(1)').innerHTML;
        const phoneNumber = row.querySelector('td:nth-child(2)').innerHTML;

        const contactIndex = phoneNumberDetails.findIndex(contact => contact.name === name && contact.phoneNumber === phoneNumber);
        if (contactIndex !== -1) {
            phoneNumberDetails.splice(contactIndex, 1);
        }

        row.remove();

        const remainingRows = table.querySelectorAll('tbody tr').length;
        if (remainingRows === 0) {
            const thead = table.querySelector('thead');
            if (thead) {
                thead.remove();
            }
        }
		updateTableCorners();
    } else if (e.target.classList.contains('fa-pen-to-square')) {
        tableRowToBeEdited = e.target.parentElement.parentElement;
        const name = tableRowToBeEdited.querySelector('td:nth-child(1)').innerHTML;
        const phoneNumber = tableRowToBeEdited.querySelector('td:nth-child(2)').innerHTML;

        nameInputElement.value = name;
        phoneInputElement.value = phoneNumber;

        addOrEditContactButton.innerHTML = 'Edit contact';
        addOrEditContactButton.classList.remove('add-contact-btn');
        addOrEditContactButton.classList.add('edit-contact-btn');
    }
}

function editContact() {
	const name = nameInputElement.value;
	const phoneNumber = phoneInputElement.value;

	if (name.length < 3 || phoneNumber.length < 3) {
		errorOutputParagraph.innerHTML =
			'The name and phone number must contain at least 3 characters';
		errorOutputParagraph.style.color = 'red';
		return;
	}

	const originalPhoneNumber = tableRowToBeEdited.querySelector('td:nth-child(2)').innerHTML;

	if (phoneNumber !== originalPhoneNumber && !isPhoneNumberUnique(phoneNumber, phoneNumberDetails.indexOf({ phoneNumber: originalPhoneNumber }))) {
		errorOutputParagraph.innerHTML = 'Phone number already exists for another contact';
		errorOutputParagraph.style.color = 'red';
		return;
	}

	tableRowToBeEdited.querySelector('td:nth-child(1)').innerHTML = name;

	tableRowToBeEdited.querySelector('td:nth-child(2)').innerHTML = phoneNumber;

	const editIndex = Array.from(table.querySelectorAll('tbody tr')).indexOf(tableRowToBeEdited);
	phoneNumberDetails[editIndex] = { name: name, phoneNumber: phoneNumber };

	addOrEditContactButton.innerHTML = 'Add Contact';
	addOrEditContactButton.classList.remove('edit-contact-btn');
	addOrEditContactButton.classList.add('add-contact-btn');

	clearInputElements();
}

function updateTableCorners() {
    const rows = table.querySelectorAll('tbody tr');
    
    if (rows.length > 0) {
        rows.forEach(row => {
            row.querySelectorAll('td').forEach(cell => {
                cell.style.borderRadius = '0';
            });
        });

        const lastRow = rows[rows.length - 1];
        lastRow.querySelector('td:first-child').style.borderBottomLeftRadius = '10px';
        lastRow.querySelector('td:last-child').style.borderBottomRightRadius = '10px';
    }

    const firstRow = table.querySelector('thead tr');
    if (firstRow) {
        firstRow.querySelector('th:first-child').style.borderTopLeftRadius = '10px';
        firstRow.querySelector('th:last-child').style.borderTopRightRadius = '10px';
    }
}

function clearInputElements() {
	nameInputElement.value = '';
	phoneInputElement.value = '';
	errorOutputParagraph.innerHTML = '';
}