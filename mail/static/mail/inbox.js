document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // Submit handler
  document.querySelector('#compose-form').addEventListener('submit', send_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id) {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-detail-view').style.display = 'block';


      // ... do something else with email ...
      document.querySelector('#email-detail-view').innerHTML = `
      <ul class="list-group">
        <li class="list-group-item"><strong>From: </strong>${email.sender}</li>
        <li class="list-group-item"><strong>To: </strong>${email.recipients}</li>
        <li class="list-group-item"><strong>Subject: </strong>${email.subject}</li>
        <li class="list-group-item"><strong>Timestamp:  </strong>${email.timestamp}</li>
        <li class="list-group-item">${email.body}</li>
      </ul>
      `
      // Change to read
      
  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  //  Get the email for that mailbox and user
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Loop through email and create a div for each 
      emails.forEach(singleEmail => {

        console.log(singleEmail);

        // Create  div for each email 
        const newEmail = document.createElement('div');
        newEmail.className = 'list-group-item';
        
        newEmail.innerHTML = `
        <h6>Sender: ${singleEmail.sender}</h3>
        <h5>Subject: ${singleEmail.subject}</h4>
        <p>${singleEmail.timestamp}</p>
        `;
        // Change background-color
        newEmail.className = singleEmail.read ? 'read': 'unread';

        // Add click event to view email
        newEmail.addEventListener('click', function (){
          view_email(singleEmail.id)
        });
        document.querySelector('#emails-view').append(newEmail);
      })
  });
  } 
function send_email(event) {
  event.preventDefault();

   // Store fields
   const recipient = document.querySelector('#compose-recipients').value;
   const subject = document.querySelector('#compose-subject').value;
   const body = document.querySelector('#compose-body').value;
  
   // Send date to backend
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
}
