const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');
const moment = require('moment');
var DateFormats = {
  short: "DD-MM-YYYY",
  short2: "MM-DD-YYYY",
  short3: "YYYY/MM/DD",
  long: "DD-MM-YYYY HH:mm",
  long2: "Do MMMM YYYY HH:mm",
  long3: "HH:mm DD/MM/YYYY",
};

module.exports = function (app) {
  app.engine('hbs', exphbs({
    layoutsDir: 'views/_layouts',
    defaultLayout: 'main',
    partialsDir: 'views/_partials',
    extname: '.hbs',
    helpers: {
      section: hbs_sections(),
      format_number: function (value) {
        return numeral(value).format('0,0');
      },
      ifEquals: function (arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
      },
      ifNotEquals: function (arg1, arg2, options) {
        return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
      },
      formatDate: function (datetime, format) {
        if (moment) {
          // can use other formats like 'lll' too
          // console.log(datetime);
          format = DateFormats[format] || format;
          return moment(datetime).format(format);
        }
        else {
          return datetime;
        }
      },
      formatDateAgo: function (datetime) {
        if (moment) {
          moment.locale('vi');
          var end = moment();
          var duration = moment.duration(end.diff(datetime));
          var day = duration.asDays();
          if (day < 1) {
            return moment(datetime).fromNow();
          }
          return moment(datetime).format('HH:mm DD/MM/YYYY');
        }
        else {
          return datetime;
        }
      },
      formatDateVN: function (datetime, format) {
        if (moment) {
          moment.locale('vi');
          format = DateFormats[format] || format;
          return moment(datetime).format(format);
        }
        else {
          return datetime;
        }
      },
    }
  }));
  app.set('view engine', 'hbs');
}