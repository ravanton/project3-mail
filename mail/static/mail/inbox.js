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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

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
        newEmail.innerHTML = `
        <h3>Sender: ${singleEmail.sender}</h3>
        <h4>Subject: ${singleEmail.subject}</h4>
        <p>${singleEmail.timestamp}</p>

        
        `;
        newEmail.addEventListener('click', function() {
          console.log('This newEmail has been clicked!')
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