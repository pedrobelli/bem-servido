define(['moment'], function(moment) {

  function convertStringToDateTime(date, horario) {
    var momentDate = moment(date + " " + horario, "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToDate(date) {
    var momentDate = moment(date + " 00:00", "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToTime(time) {
    var momentDate = moment("11/11/1900 " + time, "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToMomentTime(time) {
    return momentDate = moment(time, "HH:mm");
  }

  function convertDateToString(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  function convertDayMonthToString(date) {
    return moment(date).format("DD/MM");
  }

  function convertTimeToString(time) {
    return moment(time).format("HH:mm");
  }

  function returnDateWeekday(date) {
    var momentDate = moment(date);
    var weekday = momentDate.weekday();

    if (weekday == 7) {
      return 0;
    }

    return weekday + 1;
  }

  function calculateFinTime(date, horario, duracao) {
    var momentDate = moment(date + ' ' + horario,'DD/MM/YYYY HH:mm', true);

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
    convertDayMonthToString:convertDayMonthToString,
    convertTimeToString:convertTimeToString,
    returnDateWeekday:returnDateWeekday,
    calculateFinTime:calculateFinTime
  };
});
