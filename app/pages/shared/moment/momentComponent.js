define(['moment'], function(moment) {

  function convertStringToDateTime(data, horario) {
    var momentDate = moment(data + " " + horario, "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToDate(data) {
    var momentDate = moment(data + " 00:00", "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToTime(time) {
    var momentDate = moment("11/11/1900 " + time, "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToMomentTime(time) {
    return momentDate = moment(time, "HH:mm");
  }

  function convertDateToString(data) {
    return moment(data).utcOffset(0).format("DD/MM/YYYY");
  }

  function convertTimeToString(time) {
    return moment(time).utcOffset(0).format("HH:mm");
  }

  function calculateFinTime(data, horario, duracao) {
    var momentDate = moment(data + ' ' + horario,'DD/MM/YYYY HH:mm', true);

    if (momentDate.isValid()) {
      momentDate.add(duracao, 'minutes');
      return momentDate.format("HH:mm");
    }
  }

  return {
    convertStringToDateTime:convertStringToDateTime,
    convertStringToDate:convertStringToDate,
    convertStringToTime:convertStringToTime,
    convertStringToMomentTime:convertStringToMomentTime,
    convertDateToString:convertDateToString,
    convertTimeToString:convertTimeToString,
    calculateFinTime:calculateFinTime
  };
});
