const nameInputElement = document.querySelector('#name');
const phoneInputElement = document.querySelector('#phone');
const addContactButton = document.querySelector('#add-btn');
const table = document.querySelector('#phone-book-table');
const phoneNumberDetails = [];

addContactButton.addEventListener('click', addNewContact);

function addNewContact() {
	const name = nameInputElement.value;
	const phoneNumber = phoneInputElement.value;

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

	tableRow.appendChild(nameTableData);
	tableRow.appendChild(phoneNumberTableData);

	tableBody.appendChild(tableRow);

	table.appendChild(tableBody);
}

function createTableHeader() {
	const nameHeader = document.createElement('th');
	nameHeader.innerHTML = 'Name';

	const phoneNumberHeader = document.createElement('th');
	phoneNumberHeader.innerHTML = 'Phone Number';

	const thead = document.createElement('thead');
	thead.appendChild(nameHeader);
	thead.appendChild(phoneNumberHeader);

	return thead;
}