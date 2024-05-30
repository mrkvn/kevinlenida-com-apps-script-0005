function doPost(e) {
  const requestData = JSON.parse(e.postData.contents);
  const functionName = requestData.function;
  const args = requestData.args || {};
  let result;

  if (this[functionName] && typeof this[functionName] === 'function') {
    result = this[functionName](args);
  } else {
    result = 'Something went wrong.';
  }

  return ContentService.createTextOutput(result);
}

// CONSTANTS
TIMESHEET_SHEET_ID = "<INSERT_TIMESHEET_SHEET_ID_HERE>";
TIMESHEET_SHEET_NAME = 'timesheet'

function getCurrentDateTimeDay() {
  const now = new Date();

  // Format the current date
  const formattedDate = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "yyyy-MM-dd"
  );

  // Format the current time
  const formattedTime = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "HH:mm:ss"
  );

  // Get the day of the week
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = days[now.getDay()];

  return {
    date: formattedDate,
    time: formattedTime,
    day: dayOfWeek,
  };
}


function clock(args) {
  const { action, latitude, longitude, email } = args
  const key = Session.getTemporaryActiveUserKey();

  const { date, time, day } = getCurrentDateTimeDay();
  data = {
    id: Utilities.getUuid(),
    type: action,
    time,
    date,
    day,
    key,
    email,
    latitude,
    longitude,
    lat_long: `${latitude} ${longitude}`,
  };
  const sheet = SpreadsheetApp.openById(TIMESHEET_SHEET_ID).getSheetByName(TIMESHEET_SHEET_NAME)

  // Get all data in the sheet
  const sheetData = sheet.getDataRange().getValues();

  // Get the header row
  const headers = sheetData[0];

  // Create a new row array with the same length as headers
  const newRow = new Array(headers.length).fill("");

  // Populate the new row with data from the object
  for (let key in data) {
    const columnIndex = headers.indexOf(key);
    if (columnIndex !== -1) {
      newRow[columnIndex] = data[key];
    }
  }

  // Append the new row to the sheet
  sheet.appendRow(newRow);
  return data["time"];
}
