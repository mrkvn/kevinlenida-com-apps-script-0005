function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// CONSTANTS
const TIMESHEET_API_URL = '<INSERT_TIMESHEET_API_URL_HERE>'

function getUserEmail(){
  return Session.getActiveUser().getEmail()
}

function clock(action, latitude, longitude) {
  const email = Session.getActiveUser().getEmail()
  const url = TIMESHEET_API_URL;
  const payload = {
    function: 'clock',
    args: {
      action, latitude, longitude, email
    }
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  const response = UrlFetchApp.fetch(url, options);

  return response.getContentText()

}
