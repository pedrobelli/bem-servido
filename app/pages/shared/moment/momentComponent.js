define(['moment'], function(moment) {

  function convertStringToDateTime(data, horario) {
    var momentDate = moment(data + " " + horario, "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertDateToString(data) {
    return moment(data).format("DD/MM/YYYY");
  }

  function convertTimeToString(time) {
    return moment(time).format("HH:mm");
  }

  return {
    convertStringToDateTime:convertStringToDateTime,
    convertDateToString:convertDateToString,
    convertTimeToString:convertTimeToString
  }

});
