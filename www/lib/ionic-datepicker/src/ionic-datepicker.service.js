angular.module('ionic-datepicker.service', [])

  .service('IonicDatepickerService', function () {

    this.monthsList = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

    this.getYearsList = function (from, to) {
      var yearsList = [];
      var minYear = 1900;
      var maxYear = 2100;

      minYear = from ? new Date(from).getFullYear() : minYear;
      maxYear = to ? new Date(to).getFullYear() : maxYear;

      for (var i = minYear; i <= maxYear; i++) {
        yearsList.push(i);
      }

      return yearsList;
    };
  });