  //using google sheets app script to get data from google sheets
  
  //MAinFolder
  var FolderID = "FolderID";
  //subfolders
  var subFolder = ["Folder1", "Folder2", "Folder3"]; 
  
  function getData() {
    var sheet = SpreadsheetApp.getActiveSheet();
    //range of data to get
    //ignore first row
    //range row number 2 because first row is header
    //Range 4 columns (Team, Professors, Students, students email)
    var range = sheet.getRange(2, 1, sheet.getLastRow() - 1,4 );
    var values = range.getValues();
    return values;
  }

  var maindir = DriveApp.getFolderById(FolderID);
  var data = getData();
  var dataLength = data.length;
 
  for (var i = 0; i < dataLength; i++) {
    var row = data[i];
    var Team = row[0];
    var Profesor = row[1];
    var Student = row[2];
    var StudentEmail = row[3];

    //check if Folder Team_Profesor exists or not
    var folder = maindir.getFoldersByName(Team + "_" + Profesor);
    var found = folder.hasNext();
    console.log("Is there folder:"+found);
    if (!found) {
      //create folder Team_Profesor
      var folder = maindir.createFolder(Team + "_" + Profesor);
      var folder = maindir.getFoldersByName(Team + "_" + Profesor);
    }
    
      //now the folder exists
      var folder = folder.next();
      //create 3 subfolders
      for (var j = 0; j < subFolder.length; j++) {
        var subfolder = folder.getFoldersByName(subFolder[j]);
        var foundsub = subfolder.hasNext();
        console.log("Is there subfolder:"+foundsub);
        if (!foundsub) {
           var subfolder = folder.createFolder(subFolder[j]);
           var subfolder = folder.getFoldersByName(subFolder[j]);
        }
        
        var subfolder = subfolder.next();
          //create file with name Student_Profesor
          var file = subfolder.createFile(Student + "_" + Profesor,'Empty');
          //what next?
          console.log(file.name);
        
      }

    
    

  }
