function addContact() {
    // Get input values
    var contactName = document.querySelector('#contactName').value;
    var contactNumber = document.querySelector('#contactNumber').value;

    // Validate inputs
    if (contactName.trim() === '' || contactNumber.trim() === '') {
        alert('Please enter contact name and number.');
        return;
    }

    // Create new contact object
    var newContact = {
        name: contactName,
        number: contactNumber
    };

    // Get existing contacts from localStorage or initialize empty array
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    // Add new contact to the contacts array
    contacts.push(newContact);

    // Save updated contacts array to localStorage
    localStorage.setItem('contacts', JSON.stringify(contacts));

    // Clear input fields
    document.querySelector('#contactName').value = '';
    document.querySelector('#contactNumber').value = '';

    // Close modal after adding contact
    $('#addNew').modal('hide');

    // Refresh contact list
    displayContacts();
}

// Function to remove a contact
function removeContact(index) {
    // Get contacts from localStorage
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    // Remove contact at the specified index
    contacts.splice(index, 1);

    // Save updated contacts array to localStorage
    localStorage.setItem('contacts', JSON.stringify(contacts));

    // Refresh contact list
    displayContacts();
}

// Function to display contacts
function displayContacts() {
    // Get contacts from localStorage
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    // Get the ul element to display contacts
    var contactList = document.getElementById('listOfContacts');

    // Clear existing list
    contactList.innerHTML = '';

    // Loop through contacts and create list items
    contacts.forEach(function(contact, index) {
        var listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'row');
        listItem.innerHTML = `
            <span>${contact.name}</span>
            <span>${contact.number}</span>
            <button type="button" class="btn btn-sm btn-danger col-1 ml-5" onclick="removeContact(${index})">X</button>
        `;
        contactList.appendChild(listItem);
    });
}

displayContacts();