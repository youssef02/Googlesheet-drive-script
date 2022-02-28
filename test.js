
//using google sheets app script to get data from google sheets
function onOpen() {
  //add main function to menu
  SpreadsheetApp.getUi()
    .createMenu('Main')
    .addItem('Run', 'Main')
    .addToUi();
}


//-Mainfolder
// -team profesor folder
//  -folder1
//  -folder2
//  -folder3
//  -temlate file

//MAinFolder
var FolderID = "FOLDER ID";
var FileTemplateid = " FILE TEMPLATE ID";
//subfolders
var subFolder = ["Folder1", "Folder2", "Folder3"];
//send email to students
var sendmail = false; //set to false to not send email to students by error.
//get file template


function getData() {
  var sheet = SpreadsheetApp.getActiveSheet();
  //range of data to get
  //ignore first row
  //range row number 2 because first row is header
  //Range 4 columns (Team, Professors, Students, students email)
  var range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4);
  var values = range.getValues();
  return values;
}



function Main() {

  //main function
  var maindir = DriveApp.getFolderById(FolderID);
  var fileT = DriveApp.getFileById(FileTemplateid);
  var data = getData();
  var dataLength = data.length;

  for (var i = 0; i < dataLength; i++) {
    var row = data[i];
    var Team = row[0];
    var Profesor = row[1];
    var Student = row[2];
    var StudentEmail = row[3];
    //replace spaces from Team, Profesor, Student with _
    Team = Team.replace(/\s+/g, '_');
    Profesor = Profesor.replace(/\s+/g, '_');
    Student = Student.replace(/\s+/g, '_');

    //check if Folder Team_Profesor exists or not
    var folder = maindir.getFoldersByName(Team + "_" + Profesor);
    var found = folder.hasNext();
    console.log("Is there folder:" + found);
    if (!found) {
      //create folder Team_Profesor
      folder = maindir.createFolder(Team + "_" + Profesor);

    }
    else {
      continue;
    }
    folder = maindir.getFoldersByName(Team + "_" + Profesor);
    //now the folder exists
    var folder = folder.next();

    //create file for each student
    //create file with name Student_Profesor and add to folder
    var temp = fileT.makeCopy(Student + "_" + Profesor, folder);
    folder.addEditor(StudentEmail);
    temp.addEditor(StudentEmail);

    //create 3 subfolders
    for (var j = 0; j < subFolder.length; j++) {
      var subfolder = folder.getFoldersByName(subFolder[j]);
      var foundsub = subfolder.hasNext();
      console.log("Is there subfolder:" + foundsub);
      if (!foundsub) {
        subfolder = folder.createFolder(subFolder[j]);

      }
      else {
        continue;
      }
      
      




    }
    //get url of the subfolder
    var url = folder.getUrl();

    //if sendemail is true
    if (sendmail) {
      

      //send an email to student
      var subject = "Your file is ready";
      var body = `Hi ${Student}, 

          Your Professor ${Profesor} has uploaded a file to the folder ${Team}_${Profesor}.
          You can access the file by clicking on the link below: 
          ${url}
        
          `;
      var email = StudentEmail;
      MailApp.sendEmail(email, subject, body);
    }
    //write to the 5 row of the sheet the date with i +2 because the first row is header 
  var sheet = SpreadsheetApp.getActiveSheet();
  var date = Utilities.formatDate(new Date(), "GMT", "dd/MM/yyyy");
  sheet.getRange(i + 2, 5).setValue(date);
  //get team_professor folder id
  var folderid = folder.getId();
  sheet.getRange(i + 2, 6).setValue(folderid);
  //tempplate url
  sheet.getRange(i + 2, 7).setValue(temp.getUrl());


  }
  
}

