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

addOrEditContactButton.addEventListener('click', addOrEditContact);

phoneInputElement.addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		addNewContact();
	}
});

function addOrEditContact(e) {
	if (e.target.classList.contains('add-contact-btn')) {
		addNewContact();
	} else if (e.target.classList.contains('edit-contact-btn')) {
		editContact();
	}
}

function addNewContact() {
	const name = nameInputElement.value;
	const phoneNumber = phoneInputElement.value;

    if (name.length < 3 || phoneNumber.length < 3) {
		errorOutputParagraph.innerHTML =
			'The name and phone number must contain at least 3 characters';
		errorOutputParagraph.style.color = 'red';
		return;
	}

	if (phoneNumberDetails.length === 0) {
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
        e.target.parentElement.parentElement.remove();
        const remainingRows = table.querySelectorAll('tbody tr').length;
        if (remainingRows === 0) {
            const thead = table.querySelector('thead');
            if (thead) {
                thead.remove();
            }
        }
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

	tableRowToBeEdited.querySelector('td:nth-child(1)').innerHTML = name;

	tableRowToBeEdited.querySelector('td:nth-child(2)').innerHTML = phoneNumber;

	addOrEditContactButton.innerHTML = 'Add Contact';
	addOrEditContactButton.classList.remove('edit-contact-btn');
	addOrEditContactButton.classList.add('add-contact-btn');

	clearInputElements();
}

function clearInputElements() {
	nameInputElement.value = '';
	phoneInputElement.value = '';
	errorOutputParagraph.innerHTML = '';
}