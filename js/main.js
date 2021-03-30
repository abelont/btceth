'use strict';

var options = {
  width: 750,
  height: 300,
  showPoint: false,
  axisX: {
    showGrid: false
  }
};

$(function () {
  var queryString = location.search.substr(1);
  var query = {};
  if(queryString !== '') {
    queryString.split('&').forEach(function (paramString) {
      var param = paramString.split('=');
      if(param && param.length) { query[param[0]] = param[1] || null; }
    });
  }
  var post = {};

  console.dir(query);

  var days = query.days || 7;
  if(days < 1) days = 7;

  $('#content').html(days + ((days == 1) ? ' day' : ' days') + ' shown<br><br><div class="chart ct-chart ct-perfect-fourth"></div>');

  var ctData = { labels: [], series: [[], []] };

  var from = query.from || 'BTC';
  var to = query.to || 'ETH';

  console.info('Showing graph:', from, '-', to);
  
  var url = 'https://min-api.cryptocompare.com/data/v2/histoday';
  
  post.fsym = from.toUpperCase();
  post.tsym = to.toUpperCase();
  post.limit = days;
  if(query.key) post.api_key = query.key;
  var eachKey = Math.round(days / 7);

  $.post(url, JSON.stringify(post), function(api) {
    var data = api.Data.Data;
    console.log(data);
    $.each(data, function (k, v) {
      var date = new Date(v.time * 1000);
      ctData.labels.push((k % eachKey == 0) ? (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() : null);
      ctData.series[0].push(v.close);
    });
    new Chartist.Line('.ct-chart', ctData, options);
  }, 'json');

  $('#api-key').val(query.key).on('input change', function() {
    var key = $(this).val();
    console.log(key);
    $('.append-key').each(function() {
      $(this).attr('href', $(this).attr('href').split('&')[0]);
      if(key) {
        $(this).attr('href', $(this).attr('href') + '&key=' + key);
      }
    });
  });  
});
