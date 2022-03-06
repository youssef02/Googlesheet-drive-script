var mainfolder = "";
var pdftemplate ="";
var sendemail = false;
var professoremaillist = ['test01@test.com',
'test02@test.com'];


function onOpen() {
    FormApp.getUi().createMenu('Form Aut')
        .addItem('Run', 'Main')
        .addToUi();
        console.log("Added to Form");
}
//sending email to student can be controlled by setting sendemail to true
function sendmail( response)
{
    var responseValues = response.getItemResponses();
    var mailadress = responseValues[0].getResponse();
    var firstname = responseValues[1].getResponse();
    var lastname = responseValues[2].getResponse();
    var dob = responseValues[3].getResponse();
    var department = responseValues[4].getResponse();
    var privacy = responseValues[5].getResponse();
    //logging
    console.log(mailadress);
   
    //send mail to student with all data
    var body = `
    Dear ${firstname} ${lastname},
    Thank you for your registration.
    Your data:
    Mailadress: ${mailadress}
    Firstname: ${firstname}
    Lastname: ${lastname}
    Date of birth: ${dob}
    Department: ${department}
    Privacy: ${privacy}

    Best regards,
    Your form aut`;
    MailApp.sendEmail(mailadress,"Form aut",body);
    console.log("Email Sent!!");
}

function Main() {
  //get current form
  var form = FormApp.getActiveForm();
  //get all form responses
  var responses = form.getResponses();
  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var responseValues = response.getItemResponses();
    var mailadress = responseValues[0].getResponse();
    var firstname = responseValues[1].getResponse();
    var lastname = responseValues[2].getResponse();
    var dob = responseValues[3].getResponse();
    var department = responseValues[4].getResponse();
    var privacy = responseValues[5].getResponse();
    //logging
    console.log(mailadress);
   
    //sending email to student
    if (sendemail == true)
    {
      sendmail(response);
    }

    //preparing Temp folder
    var folder = DriveApp.getFolderById(mainfolder);
    //get temp document
    var tempfile = DriveApp.getFileById(pdftemplate);
    //copy temp document to folder
    var newfile = tempfile.makeCopy(folder);
    var tempdoc = DocumentApp.openById(newfile.getId());
    //replace placeholders
    
    tempdoc.getBody().replaceText("%firstname%", firstname);
    tempdoc.getBody().replaceText("%lastname%", lastname);
    tempdoc.getBody().replaceText("%mailadress%", mailadress);
    tempdoc.getBody().replaceText("%dob%", dob);
    tempdoc.getBody().replaceText("%department%", department);
    //get current date and time
    var date = new Date();
    var dateString = Utilities.formatDate(date, "GMT", "yyyy-MM-dd HH:mm:ss");
    tempdoc.getBody().replaceText("%date%", dateString);
    //save
    tempdoc.saveAndClose();
    
   // convert doc to pdf blob
    var blob = tempdoc.getAs('application/pdf');
    //send email to professor
    for (var j = 0; j < professoremaillist.length; j++)
    {
      MailApp.sendEmail(professoremaillist[j],"Form aut",`
      New Form Aut
      ${firstname} ${lastname}
      ${mailadress}
      `,{attachments: [blob]});
    }

  }
}
