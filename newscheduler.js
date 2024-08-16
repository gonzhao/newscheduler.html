<!DOCTYPE html>

<html lang='en'>
  <head>

    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css' rel='stylesheet'>

    <script src='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/6.1.9/index.global.js'></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    
    <!-- Include jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    
    <!-- Include Tippy -->
    <script src="https://unpkg.com/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://unpkg.com/tippy.js@6.3.1/dist/tippy-bundle.umd.min.js"></script>
    
    <!--Full Calendar Plugins -->
    <!--
    <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/multimonth@5.10.0/main.min.js'></script>
    -->

    <meta charset='utf-8' />
    <title> New CDN Calendar </title>
  <style>

  body {
    background-color: #ffffff;
    margin-top: 40px;
    font-size: 16px;
    font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  }

  .fc-event-main {
    cursor: move;
    /*color of the ticket*/
    background-color: #567eb5;
    color: #FFF;
    width: 100%;
    box-sizing: border-box; 
    margin: 0; 
    padding: 3px; 
    font-size: 17px;
  }

  #external-events {
    position: fixed;
    left: 20px;
    top: 20px;
    width: 150px;
    height: 400px;
    padding: 0 10px;
    border: 1px solid #ccc;
    background: #eee;
    text-align: left;
  }
  
  #external-events-list {
    text-align: center;
  }

  #external-events-list button {
    margin-bottom: 10px; /* Adjust the margin as needed */
  }
  /*Keep track of updates version*/
  #app-version {
    font-size: 12px;
    color: #040404;
  }

  #external-events h4 {
    font-size: 20px;
    margin-top: 0;
    padding-top: 1em;
    text-align: center;
  }

  #calendar-wrap {
    margin-left: 200px;
  }

  #calendar {
    max-width: 1300px;
    margin: 0 auto;
  }

  .delete-icon {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }

  .fade-out {
    opacity: 0;
  }
  /*Dark Theme Settings*/
  #toggle-darktheme-button {
    margin: 0 auto;
    display: block;
  }

  .dark-theme {
    background-color: #333;
    color: #fff;
  }

  .dark-theme #external-events {
    background: #444;
    border-color: #555;
  }

  .dark-theme .fc-event-main {
    background-color: #d7a258;
    /* Font color*/
    color: #333;
  }

  .dark-theme .enlarged-event {
    background-color: #222;
    border-color: #333;
    color: #fff;
  }
  /*Tippy*/
  .tippy-light-custom {
    background-color: #d7a258;
    color: #3063ab;
    /* Add other styles as needed */
  }

  .modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border: 1px solid #ccc;
    z-index: 1;
    /*Modal Feature Request*/
  }

  #feature-request-modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    z-index: 2;
  }

  #feature-request-modal-background {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  /**/
  .past-event {
    background-color: #4a4a4a; /* Set your desired background color */
    border-color: #4a4a4a; /* Set border color */
    color: #d2cdcd; /* Set text color */
  }

  .same-day-event {
    background-color: #fff387; /* Set your desired background color */
    border-color: #fff387; /* Set border color */
    color: #323131; /* Set text color */    
  }
  </style>

  <script>

  //This Script controls all logic to display Tickets from QB to the Scheduler

  //TODO: Some lines in this script will need to be changed/updated once the 
  //app its being used since there is ownership/passwords and specific data/tables
  //that is link with the user usage owerniship in Quickbase.
    
  //#region API QB_Query records)
  //Prepare API call to go over the records and pull information for my table
 
  //#region Get Role to authennticate.

     // Function to extract the role from the URL parameters
     function getRoleFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('role');
    }

    // Function to print the role information
    function ProcessRoleInformation() {
        // Get the role from the URL
        const role = getRoleFromURL();

        // Print the role information
        console.log("Role:", role);

        //check for Authorized Roles
        if (role === 'Administrator') {
            //if you Authorized, DO the API call
            QueryForData_APICall();
        } else {
            alert("Role: " + role + " is not Authorized.");
            console.log("Role: " + role + " Is not Authorized.");
        }
        
    }

    //Call the function when the page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Print role information when the page loads
        ProcessRoleInformation();
    });

  //#endregion
  

  function QueryForData_APICall() {
    // 7: Name, 8: phone number, 11: start date,
    // 13: end date, 15: start time, 16: end time, 18: Notes
    var headers = {
        'QB-Realm-Hostname': 'https://builderprogram-gcarrasco8152.quickbase.com',
        'User-Agent': '{User-Agent}',
        'Authorization': 'QB-USER-TOKEN b8s6k4_qtgt_0_bmhwy65c8k8zjie6tq6ed8826dm',
        'Content-Type': 'application/json'
        };

    var body = {
        "from":"btpwea66k",
        "select":[7,8,11,13,15,16,26,3,18],
        "sortBy":[{"fieldId":7,"order":"ASC"}],
        "groupBy":[{"fieldId":7,"grouping":"equal-values"}],
        "options":{"skip":0,"top":0,"compareWithAppLocalTime":false}
    }

    fetch('https://api.quickbase.com/v1/records/query', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(res => {
        if (res.ok) {
        // If the response is OK, parse the JSON response
        return res.json().then(data => {
        console.log("Raw Data: ", data); // Log the entire API response
        return data;
        });
    }
    // If there's an error, parse the JSON error response and reject the promise
    return res.json().then(resBody => Promise.reject({ status: res.status, ...resBody }));
    })
    .then((data) => {
        console.log(data); // Raw data from the API call

        // Parse the data into a ticket format
        var tickets = data.data.map((record) => ({
            Name: record[7].value,
            PhoneNumber: record[8].value,
            StartDate: record[11].value,
            EndDate: record[13].value,
            StartTime: record[15].value,
            EndTime: record[16].value,
            EventType: record[26].value,
            RecordID: record[3].value,
            Notes: record[18].value
        }));

        // Debug Print Array of ticket data
        console.log(tickets); 
        
        // Function to create the tickets
        createEventDivs(tickets);
    })
    .catch(err => console.log(err))
  }
  //#endregion

  //#region API QB_deleteRecord 
  // Function to delete a record by its ID in Quickbase
  //TODO
  function QB_deleteRecord(recordID) {
    var headers = {
        'QB-Realm-Hostname': 'xxxx-xxxxxx.quickbase.com',
        'User-Agent': '{User-Agent}',
        'Authorization': 'QB-USER-TOKEN xxxxxxxxx',
        'Content-Type': 'application/json'
    };

    var body = {
        "from": "btpwea66k",
        "where": `{3.EX.${recordID}}`
    };

    fetch('https://api.quickbase.com/v1/records', {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(response => {
        if (response.ok) {
            return response.json().then(res => console.log(res));
        }
        return response.json().then(resBody => Promise.reject({ status: response.status, ...resBody }));
    })
    .then(data => {
        console.log('Record in Quickbase deleted successfully:', data);
        // If needed, you can also handle the response data here
    })
    .catch(error => {
        console.error('Error deleting record:', error);
    });
  }
  //#endregion

  //#region Functions
  //This function will create te tickets
  function createEventDivs(tickets) {
    var calendarEl = document.getElementById('calendar');
    
    // Loop through the 'tickets' array and create a div for each ticket
    tickets.forEach((ticket, index) => {
      // Log the RecordID for each ticket
      
      // Update the date and time format
      var startDate = moment(ticket.StartDate + ' ' + ticket.StartTime, 'YYYY-MM-DD HH:mm:ss');
      var endDate = moment(ticket.EndDate + ' ' + ticket.EndTime, 'YYYY-MM-DD HH:mm:ss');

      var event = {
        title: ticket.Name,
        start: startDate.toISOString(), // Convert to ISO format
        end: endDate.toISOString(),
        
        allDay: false, 
        extendedProps: {
          RecordID: ticket.RecordID,
          StartTime: ticket.StartTime,
          EndTime: ticket.EndTime,
          PhoneNumber: ticket.PhoneNumber,
          EventType: ticket.EventType,
          Name: ticket.Name,
          Notes: ticket.Notes
        },
      };

      calendar.addEvent(event);
      
      var eventDiv = document.createElement('div');
      eventDiv.classList.add(
          'fc-event',
          'fc-h-event',
          'fc-daygrid-event',
          'fc-daygrid-block-event'
      );
    });
  }

  function constructEditURL(recordID) {
    //Double click on the ticket to go QB and edit it.
    
    //TODO: 
    //This will need update when we move the scheduler
    //needs to point to correct builder, table and recordID 
    //that we want to edit/update
    var editURL = `https://builderprogram-gcarrasco8152.quickbase.com/db/btpwea66k?a=er&rid=${RecordID}`;
    return editURL;
  }
  // Function to open the QuickBase edit page in a new tab
  function openEditPage(recordID) {
    var editURL = constructEditURL(recordID);
    window.open(editURL, '_blank');
  }  
  //#endregion
 
  //#region InitCalendar
  //Init CDN Full Calendar
  document.addEventListener('DOMContentLoaded', function() {
    var enlargedElement = null;
    var isEnlargedVisible = false; // Flag to track the visibility of the enlarged element
    var enterTimeout; 
    var leaveTimeout;

    calendarEl = document.getElementById('calendar');

    // Add event listener for the dark theme button
    document.getElementById('toggle-darktheme-button').addEventListener('click', function () {
      document.body.classList.toggle('dark-theme');
    });

    function handleEventDrop(info) {
      var ticketID =
       info.event.extendedProps && info.event.extendedProps.RecordID;

      // If the extendedProps doesn't have RecordID, try to get it from the DOM attribute
      if (!ticketID) {
        var recordIDAttr = info.event.el.getAttribute('data-record-id');
        if (recordIDAttr) {
            ticketID = recordIDAttr;
        }
      }

      // Convert Data to Update in QB
      var startDate = moment(info.event.start);       
      var endDate   = moment(info.event.end);

      var startTime = moment(info.event.start).format('HH:mm:ss');
      var endTime   = moment(info.event.end).format('HH:mm:ss');

      //API Call To update data
      var headers = {
          'QB-Realm-Hostname': 'builderprogram-gcarrasco8152.quickbase.com',
          'User-Agent': '{User-Agent}',
          'Authorization': 'QB-USER-TOKEN b8s6k4_qtgt_0_bmhwy65c8k8zjie6tq6ed8826dm' ,
          'Content-Type': 'application/json'
      };

      // Prepare data to make API call and update QB data  
      var updateData = {
          to: 'btpwea66k',
          "where": `{3.EX.${ticketID}}`,
          data: [
              {
              '3':  { 'value': ticketID },
              '11': { 'value': startDate.format('YYYY-MM-DD') },  
              '13': { 'value': endDate.format('YYYY-MM-DD') }, 
              '15': { 'value': startTime},
              '16': { 'value': endTime },
              }
          ],
          fieldsToReturn: [3, 11, 13, 15] 
      };

      // Log the data to be sent to Quickbase for debugging
      console.log('Update Data:', JSON.stringify(updateData));

      // API call to update the record
      fetch('https://api.quickbase.com/v1/records', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(updateData)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to update record');
          }
          return response.json();
      })
      .then(data => {
          console.log('Record updated successfully:', data);
          // If needed, you can also handle the response data here
          
      })
      .catch(error => {
          console.error('Error updating record:', error);
      });
  
    }

    //Calendar Config
    calendar = new FullCalendar.Calendar(calendarEl, {
      themeSystem: 'bootstrap5',
      editable: true,
      eventResize: function(info) {
        handleEventDrop(info);
      },

      //#region DEBUG -> Manually add an event to the calendar
      /* events: [
        { // this object will be "parsed" into an Event Object
          title: 'Manual Add TEST ', // a property!
          start: '2023-11-10', // a property!
          end: '2023-11-11', // a property! ** see important note below about 'end' **
        
        }
      ],*/
      //#endregion
      //plugins: [multiMonthPlugin],
      initialView: 'dayGridMonth',
      
      customButtons: {
        newTicketButton: {
        text: '+ New Ticket',
          click: function() {
            // Tooltip content
            content: 'Create a new ticket in QB', 
            //TODO
            //This will need to be handle when change owner/table
            window.open(
              'https://builderprogram-gcarrasco8152.quickbase.com/db/btpwea66k/form?a=nwr&originalQid=td&originalqid=td&page=1', '_blank');
          }
        }
      },
      
      //Add New buttons here in (headerToolbar)  
      headerToolbar: {        
        left: 'dayGridMonth,timeGridWeek,timeGridDay,listYear, newTicketButton',
        center: 'title',
        right: 'today prev,next',
      },

      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
     
      //Handle tickets in calendar 
      eventDrop: function (info) {
        handleEventDrop(info);
      },
      
      eventMouseEnter: function (info) {
        //we set up the data to display in tooltip
        // Hover tickets
        // Access the event's data and extended properties
        var ticket = info.event.extendedProps || {};
        var notes = ticket.Notes || 'No notes available';

        // Create a custom HTML structure with additional Viaero data to display
        var enlargedContent = `
          <div class="enlarged-event-content">
            <h4><strong>Event: </strong> ${ticket.EventType}</h3>
            <p><strong>Name:</strong> ${ticket.Name || 'N/A'}</p>
            <p><strong>Start Date:</strong> ${moment(info.event.start).format("YYYY-MM-DD")}</p>
            <p><strong>End Date:</strong> ${moment(info.event.start).format("YYYY-MM-DD")}</p>
            <p><strong>Start Time:</strong> ${moment(info.event.start).format('hh:mm A') || 'N/A'}</p>
            <p><strong>End Time:</strong> ${moment(info.event.end).format('hh:mm A') || 'N/A'}</p>
            <p><strong>Phone Number:</strong> ${ticket.PhoneNumber || 'N/A'}</p>
            <button id="expand-notes-button">Notes</button>
            <div id="notes-container" style="display: none;">${notes}</div>
            
            <!-- Add more information as needed -->
          </div>`;

        //Display the Data Tooltip with Tippy
        tippy(info.el, {
          content: enlargedContent,
          placement: 'right',
          arrow: true,
          theme: 'light-custom', // Use a custom theme name
          allowHTML: true,
          interactive: true,
          onShow(instance) {
            // Add a click event listener to the "Show Notes" button
            var expandNotesButton = instance.popper.querySelector('#expand-notes-button');
            
            if (expandNotesButton) {
              expandNotesButton.addEventListener('click', function () {
                var notesContainer = instance.popper.querySelector('#notes-container');
                if (notesContainer) {
                  // Toggle the visibility of the notes container
                  notesContainer.style.display = (notesContainer.style.display === 'none') ? 'block' : 'none';
                }
              });
            }
          }
        });

        //#region (Deprecated) 
        
        //Manual Tooltip

        // Check if an enlarged event is already visible, and remove it
        /*if (isEnlargedVisible && enlargedElement) {
          enlargedElement.remove();
          isEnlargedVisible = false;
        }

        // Create an element to hold the enlarged content
        enlargedElement = document.createElement('div');
        enlargedElement.classList.add('enlarged-event');
        enlargedElement.innerHTML = enlargedContent;
        
        // Determine the position of the ticket element within the calendar
        var ticketElement = info.el; // The DOM element of the ticket
        var rect = ticketElement.getBoundingClientRect();

        // Position the enlarged element to the right of the ticket element
        enlargedElement.style.left = rect.right + offsetX + 'px';
        enlargedElement.style.top = rect.top + offsetY + 'px';
        // Set the background color with transparency
        //enlargedElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Adjust the last value (0.9) for transparency
         
        //var mouseX = info.jsEvent.pageX;
        //var mouseY = info.jsEvent.pageY;
        
        //show box in mouse position + offset 
        //enlargedElement.style.left = mouseX + offsetX + 'px';   
        //enlargedElement.style.top = mouseY + offsetY + 'px';
        
        // Append the enlarged content to the body or another container
        //document.body.appendChild(enlargedElement);
      
        // Update the flag to indicate that the enlarged element is now visible
        isEnlargedVisible = true;      
      //}, 200);
        */
      //#endregion
      },
    
      eventMouseLeave: function (info) {
        //We dont use this anymore to control tooltip logic  
        //since we are using Tippy that handles  
        //the logic of tooltip automatically.

      },
  
      eventClassNames: function(info) {
        //function to calculate the current and late tickets
        //so they are marked with gray for passed event tickets dates
        //or highlight color for current (same day) event tickets
        
        var eventStart  = new Date(info.event.start);
        var currentDate = new Date();

          // Compare event date with current date
        if (eventStart.getDate() < currentDate.getDate()) {
          // If the event date is before the current date, return a class for styling
          return ['past-event'];
        } 

        // Check if the event date is on the same day as the current date
        if ( eventStart.getDate() === currentDate.getDate() &&
            eventStart.getMonth() === currentDate.getMonth() &&
            eventStart.getFullYear() === currentDate.getFullYear()) {
          // If the event is on the same day, return a class for a different styling
          return ['same-day-event'];
        }

        // If none of the conditions match, return an empty array
        return [];
      },

    });

  // Display Tickets in Calendar
  calendar.setOption('eventContent', function (arg) {
    var ticket = arg.event.extendedProps || {}; // Get the ticket information, or an empty object if not available
    var startDate = moment(arg.event.start);
    var endDate = moment(arg.event.end);

    var eventDiv = document.createElement('div');
  
    // What text we display in Ticket
    //eventDiv.innerHTML = `${ticket.Name}, ${ticket.EventType}`;
    eventDiv.innerHTML = `${ticket.Name}`;
    
    // Apply the same style as the external events
    eventDiv.classList.add('fc-event-main');

    //Double click on Ticket edit link 
    eventDiv.addEventListener('dblclick', function (event) {
      var recordID = ticket.RecordID || this.parentElement.extendedProps.RecordID;

      // Construct the edit URL
      var editURL = `https://builderprogram-gcarrasco8152.quickbase.com/db/btpwea66k?a=er&rid=${recordID}`;

      // Open the edit URL in a new tab
      window.open(editURL, '_blank');
      
    });

    //#region "X" Icon     
    // Create "X" Icon for deletion
    var deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = 'x';
    
    // Set styling to position the icon to the far right
    deleteIcon.style.position = 'absolute';
    deleteIcon.style.right = '5px';

    // Attach a click event listener to the "X" icon
    deleteIcon.addEventListener('click', function (event) {
      //event.stopPropagation(); // Prevent the click event from propagating to the parent
      
      // Get the RecordID from the extendedProps or data attribute
      var recordID = ticket.RecordID 
      || this.parentElement.extendedProps.RecordID;
      
      var confirmDelete = confirm('Are you sure you want to delete this ticket here and in QB?');

      if (confirmDelete) {
          // Perform the delete operation
          QB_deleteRecord(recordID);
          // Remove the event from the calendar
          arg.event.remove();
      }
    });
    
    eventDiv.appendChild(deleteIcon);
    //#endregion

    eventDiv.extendedProps = {
      RecordID: arg.event.extendedProps.RecordID,
    };

    return { domNodes: [eventDiv] };
  });
  
  calendar.render();
      
  });
  
   //#endregion

  </script>
  </head>
    <body>
        <div id='wrap'>
          <div id='external-events'>
            <!--<h4>Scheduler </h4>-->
            <h4>Scheduler <span id="app-version">v1.3</span></h4>
            
            <!--Buttons External List -->
            <div id='external-events-list'>
              <button id="toggle-darktheme-button">Dark Theme</button>
              <!-- <button id="feature-request-button">Feature Request</button> -->
                <!--<div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'> -->
                <!-- <div class='fc-event-main'>Debug Event</div> -->
            </div>
          </div>
        </div>
      
          <div id='calendar-wrap'>
            <div id='calendar'></div>
          </div>

          <!--Feature Request Modal -->
          <!--this might be better handle in QB side. -->
          <div id='feature-request-modal' class="modal">
            <form>
              <label for="featureName">Name:</label>
              <input type="text" id="featureName" name="featureName" required>        
              
              <label for="featurePriority">Priority:</label>
              <input type="text" id="featurePriority" name="featurePriority" required>

              <label for="featureDescription">Description:</label>
              <input type="text" id="featureDescription" name="featureDescription" required>

              <button type="submit">Submit</button>
              <button type="button" id="close-modal-button">Close</button>
            </form>
          </div>

        </div>
    </body>
</html>



