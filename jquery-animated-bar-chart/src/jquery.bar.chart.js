/*
 *   Animated bar chart library v1.0
 *   jquery.bar.chart.js
 *   Author: vnidev
 *
 *   License: Open source - MIT
 *   Please visit http://opensource.org/licenses/MIT for more information
 *
 *   Full details and documentation:
 *   https://github.com/vnidev/animated-bar-chart.git
 */

(function($) {

   $.fn.animatedBarChart = function(prop) {
      var self = this;
      var item_id = $(self).attr('id');

      // init default params
      var defaults = $.extend(true, {}, {
         data: [], // data for chart rendering
         params: { // columns from data array for rendering graph
            group_name: 'group_name', // title for group name to be shown in legend
            name: 'name', // name for xaxis
            value: 'value' // value for yaxis
         },
         chart_height: 400, // default chart height in px
         colors: null, // colors for chart
         show_legend: true, // show chart legend
         x_grid_lines: true, // show x grid lines
         y_grid_lines: true, // show y grid lines
         tweenDuration: 300, // speed for tranistions
         bars: { // default bar settings
            padding: 0.075, // padding between bars
            opacity: 0.7, // default bar opacity
            opacity_hover: 0.45, // default bar opacity on mouse hover
            disable_hover: false, // disable animation and legend on hover
            hover_name_text: 'name', // text for name column for label displayed on bar hover
            hover_value_text: 'value', // text for value column for label displayed on bar hover
         },
         number_format: { // default locale for number format
            format: ',.2f', // default number format
            decimal: '.', // decimal symbol
            thousands : ',', // thousand separator symbol
            grouping: [3], // thousand separator grouping
            currency: ['$'] // currency symbol
         },
         margin: { // margins for chart rendering
            top: 0, // top margin
            right: 35, // right margin
            bottom: 20, // bottom margin
            left: 70 // left margin
         },
         rotate_x_axis_labels: { // rotate xaxis label params
            process: true, // process xaxis label rotation
            minimun_resolution: 720, // minimun_resolution for label rotating
            bottom_margin: 15, // bottom margin for label rotation
            rotating_angle: 90, // angle for rotation,
            x_position: 9, // label x position after rotation
            y_position: -3 // label y position after rotation
         }
      }, prop);

      if (!defaults.colors) {
         defaults.colors = [];
         var temp_color = d3.scaleOrdinal(d3.schemeCategory10);
         for (var i = 0; i < 10; i++)
         defaults.colors.push(temp_color(i));
      }

      var chart_container_margin = 0;
      if (!defaults.bars.disable_hover) chart_container_margin = 20;

      var data_distinct = [];
      $.each(defaults.data, function(idx, item) {
         data_distinct.push(item[defaults.params.group_name]);
      });
      data_distinct = $.unique(data_distinct);

      // rotate xaxis labels if resolution is less then defined in defaults
      var rotate_labels = false;
      if ($(document).width() < defaults.rotate_x_axis_labels.minimun_resolution && defaults.rotate_x_axis_labels.process) {
         defaults.margin.bottom = defaults.margin.bottom + defaults.rotate_x_axis_labels.bottom_margin;
         rotate_labels = true;
      }

      // set d3 format locale
      d3.formatDefaultLocale(defaults.number_format);
      // set number formaat
      var number_format = d3.format(defaults.number_format.format);

      // get container width and height
      var _container = $('#' + item_id);
      var _width = _container.width();
      var _height = defaults.chart_height; //_container.height();

      // draw svg container for chart
      var _svg = d3.select('#' + item_id).append("svg")
         .attr("width", "100%").attr("height", defaults.chart_height)
         .attr('viewBox', '0 0 ' + _width + ' ' + _height)
         .attr('preserveAspectRatio', 'none');

      // init container for chart and move after legend
      var _svg_chart = _svg.append('g').attr("class", "svg_chart").attr("transform", 'translate(' + defaults.margin.left + ', ' + defaults.margin.top + chart_container_margin + ')');

      // define xScale
      var _xScale = d3.scaleBand()
         .range([0, _width - defaults.margin.left - defaults.margin.right])
         .domain(defaults.data.map( function(d) { return d[defaults.params.name]; }))
         .padding(defaults.bars.padding);

      // define yScale
      var _yScale = d3.scaleLinear() // ovo je njemu y
         .range([_height - defaults.margin.top - defaults.margin.bottom - chart_container_margin, 0])
         .domain([0, d3.max(defaults.data, function(d) {
            return d[defaults.params.value]
      })]);

      // add x and y scale to svg
      _svg_chart.append("g").attr("class", "xaxis")
         .attr("transform", 'translate(0, ' + (_height - defaults.margin.top - defaults.margin.bottom - chart_container_margin) + ')').call(d3.axisBottom(_xScale));
      _svg_chart.append("g").attr("class", "yaxis").call(d3.axisLeft(_yScale).ticks(5));

      // chart container initialization
      var chart_container = _svg_chart.append('g').attr('class', 'chart_container');

      // function for creating gridlines in x and y axis
      function make_x_gridlines() { return d3.axisBottom(_xScale); }
      function make_y_gridlines() { return d3.axisLeft(_yScale); }

      // init container for y grid lines
      var x_lines;
      if (defaults.x_grid_lines) x_lines = _svg_chart.append("g").attr("class", "x_lines")
         .attr("transform", "translate(0," + (_height - defaults.margin.top - defaults.margin.bottom - chart_container_margin) + ")");

      // init container for y grid lines
      var y_lines;
      if (defaults.y_grid_lines) y_lines = _svg_chart.append("g").attr("class", "y_lines");

      var ul_container;
      if (defaults.show_legend) ul_container = d3.select('#' + item_id).append('div').attr('class', 'legend_div').append('ul');

      /**************************************************************************************/
      /*** function for chart render ********************************************************/
      /**************************************************************************************/
      self.render = function () {
         // redraw y scale for new values
         _yScale.domain([0, d3.max(defaults.data, function(d) { return d[defaults.params.value] })]);
         _svg_chart.select(".yaxis").transition().duration(defaults.tweenDuration).call(d3.axisLeft(_yScale));

         _xScale.domain(defaults.data.map(function(d) { return d[defaults.params.name]; }));
         _svg_chart.select(".xaxis").transition().duration(defaults.tweenDuration).call(d3.axisBottom(_xScale));

         if (rotate_labels) {
            _svg_chart.select('.xaxis').selectAll("text").transition().duration(defaults.tweenDuration)
                  .attr("y", defaults.rotate_x_axis_labels.y_position).attr("x", defaults.rotate_x_axis_labels.x_position)
                  .attr("transform", 'rotate(' + defaults.rotate_x_axis_labels.rotating_angle + ')')
                  .style("text-anchor", "start");
         }

         // redraw x scale gridlines
         if (defaults.x_grid_lines) {
            x_lines.transition().duration(defaults.tweenDuration).call(make_x_gridlines()
               .tickSize(-(_height - defaults.margin.top - defaults.margin.bottom - chart_container_margin)).tickFormat(""));
         }

         // redraw y scale gridlines
         if (defaults.y_grid_lines) {
            y_lines.transition().duration(defaults.tweenDuration).call(make_y_gridlines()
               .tickSize(-(_width - defaults.margin.left - defaults.margin.right)).tickFormat(""));
         }

         // add chart legend
         if (defaults.show_legend) self.addChartLegend();

         // init chart groups with data
         var chart_groups = chart_container.selectAll('rect').data(defaults.data);

         // draw bars on enter
         chart_groups.enter()
         .append('rect')
         .attr("class", "bar_item")
         .style("fill", function(d, i) {
            //var index = data_distinct.findIndex(x => x === d[defaults.params.group_name]);
            var index = self.getDistinctDataIndex(d[defaults.params.group_name]);
            return defaults.colors[index];
         })
         .style('opacity', defaults.bars.opacity)
         .attr("x", function(d, i) {
            //var index = data_distinct.findIndex(x => x === d[defaults.params.group_name]);
            var index = self.getDistinctDataIndex(d[defaults.params.group_name]);
            return _xScale(d[defaults.params.name]) + (index * _xScale.bandwidth() / data_distinct.length);
         })
         .attr("y", function(d) { return _yScale(0) } )
         .attr("width", function(d) { return _xScale.bandwidth() / data_distinct.length })
         .attr("height", 0)
         .on("mouseover", function (d, i) { // on mouse hover animation
            if (!defaults.bars.disable_hover) {
               var text_value = d[defaults.params.group_name] + ', ' + defaults.bars.hover_name_text + ': ' + d[defaults.params.name] + ', ' + defaults.bars.hover_value_text + ': ' + number_format(d[defaults.params.value]);
               _svg.append("text")
                  .attr("class", "title-text")
                  .style("fill", function() {
                     //var index = data_distinct.findIndex(x => x === d[defaults.params.group_name]);
                     var index = self.getDistinctDataIndex(d[defaults.params.group_name]);
                     return defaults.colors[index];
                  })
                  .text(text_value)
                  .attr("text-anchor", "middle")
                  .attr("x", (_width ) / 2)
                  .attr("y", chart_container_margin - 7);
               d3.select(this).style('opacity', defaults.bars.opacity_hover).style("cursor", "pointer");
            }
         })
         .on("mouseout", function(d) { // on mouse out animation
            if (!defaults.bars.disable_hover) {
               _svg.select(".title-text").remove();
               d3.select(this).style('opacity', defaults.bars.opacity);
            }
         })
         .transition().duration(defaults.tweenDuration)
            .attr("y", function(d) { return _yScale(d[defaults.params.value]) })
            .attr("height", function(d) { return _height - defaults.margin.top - defaults.margin.bottom - chart_container_margin - _yScale(d[defaults.params.value]) });

         // update bar width, height and position
         chart_groups.data(defaults.data)
            .transition().duration(defaults.tweenDuration)
               .style("fill", function(d, i) {
                  //var index = data_distinct.findIndex(x => x === d[defaults.params.group_name]);
                  var index = self.getDistinctDataIndex(d[defaults.params.group_name]);
                  return defaults.colors[index];
               })
               .attr("x", function(d, i) {
                  //var index = data_distinct.findIndex(x => x === d[defaults.params.group_name]);
                  var index = self.getDistinctDataIndex(d[defaults.params.group_name]);
                  return _xScale(d[defaults.params.name]) + (index * _xScale.bandwidth() / data_distinct.length)
               })
               .attr("width", _xScale.bandwidth() / data_distinct.length)
               .attr("y", function(d) { return _yScale(d[defaults.params.value]) })
               .attr("height", function(d) { return _height - defaults.margin.top - defaults.margin.bottom - chart_container_margin - _yScale(d[defaults.params.value]) });

         // remove empty bars
         chart_groups.exit()
            .transition().duration(defaults.tweenDuration)
            .style('opacity', 0).remove();
      }

      // generate chart legend
      self.addChartLegend = function() {

         // init li elements for legend
         var div_legend = ul_container.selectAll('li').data(data_distinct);

         // draw li elements for legend
         var li = div_legend.enter().append("li");
         li.append("div").attr('style', function(d, i) { return 'background-color: ' + defaults.colors[i] });
         li.append("p").text( function(d) { return d; } );

         // update li elements with new values
         var li_update = div_legend.data(data_distinct);
         li_update.select('div').attr('style', function(d, i) { return 'background-color: ' + defaults.colors[i] });
         li_update.select('p').text( function(d) { return d; } );

         // remove empty li elements from legend
         div_legend.exit().remove();
      }


      /**************************************************************************************/
      /*** function for chart update ********************************************************/
      /**************************************************************************************/
      self.updateChart = function (prop) {
         defaults = $.extend(defaults, prop);

         data_distinct = [];
         $.each(defaults.data, function(idx, item) {
            data_distinct.push(item[defaults.params.group_name]);
         });
         data_distinct = $.unique(data_distinct);

         self.render();
      };

      /**************************************************************************************/
      /*** function for get item index from data_distinct ***********************************/
      /**************************************************************************************/
      self.getDistinctDataIndex = function(item)
      {
         var index = 0;
         $.each(data_distinct, function(idx, curr_item) {
            if (item == curr_item)
            {
               index = idx;
               return false;
            }
         });
         return index;
      }


      // render initial chart
      self.render();

      return self;
   }

}(jQuery));
