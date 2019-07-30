// D3甘特圖
/**
@author Dion
@version 1.0
var tasknames = ['Job1','Job2','Job3','Job4','Job5']
var task_detail = [
{ 'taskname': 'Job1', 'start': '2019/01/01', 'end': '2019/02/28' },
{ 'taskname': 'Job1', 'start': '2019/03/01', 'end': '2019/04/28' },
{ 'taskname': 'Job2', 'start': '2019/03/01', 'end': '2019/04/28' },
{ 'taskname': 'Job3', 'start': '2019/03/01', 'end': '2019/08/28' },
{ 'taskname': 'Job4', 'start': '2019/05/01', 'end': '2019/09/28' },
{ 'taskname': 'Job5', 'start': '2019/05/01', 'end': '2019/09/31' },
]
d3_gantt('D3_gantt', 'D3_gantt', tasknames, task_detail)
*/
function d3_gantt(gantt_id, gantt_title, tasknames, task_detail) {
    // 寬 高 半徑
    var width = document.documentElement.clientWidth
    if (width < 0) {
        width = '1200'
    }
    var height = 500
    var radius = 200
    var margin_top = 50
    var margin_left = 100
    var margin_right = 100
    var margin_bottom = 10
    var tickFormat = '%H:%M'
    var timeDomainStart = d3.time.day.offset(new Date(), -3)
    var timeDomainEnd = d3.time.hour.offset(new Date(), +3)

    var customTimeFormat = d3.time.format.multi([
            ['.%L', function(d) { return d.getMilliseconds(); }],
            [':%S', function(d) { return d.getSeconds(); }],
            ['%I:%M', function(d) { return d.getMinutes(); }],
            ['%I %p', function(d) { return d.getHours(); }],
            ['%a %d', function(d) { return d.getDay() && d.getDate() != 1; }],
            ['%b %d', function(d) { return d.getDate() != 1; }],
            ['%B', function(d) { return d.getMonth(); }],
            ['%Y', function() { return true; }]
        ])
        // 標題
    var sel_div = d3.select('#' + gantt_id)
    sel_div.append('div')
        .attr('id', 'D3_pie_title')
        .style('width', width - margin_left)
        .style('text-align', 'center')
        .append('p')
        .text(gantt_title)

    // 找出最大與最小日期
    var dates_start = []
    var dates_end = []
    $.each(task_detail, function(d, i) {
        dates_start.push(new Date(i['start']))
        dates_end.push(new Date(i['end']))
    })
    var maxDate = new Date(Math.max.apply(null, dates_end))
    var minDate = new Date(Math.min.apply(null, dates_start))

    // X軸
    var x = d3.time.scale()
        .domain([minDate, maxDate])
        .range([margin_left, width - margin_left])
        .clamp(true)
        // Y軸
    var y = d3.scale.ordinal().domain(tasknames).rangeRoundBands([0, height - margin_top - margin_bottom], .1)
        // 座標設定
    var xAxis = d3.svg.axis().scale(x).orient('top').tickFormat(d3.time.format('%Y/%m/%d')).tickSubdivide(true)
    var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(8)
        // 繪製座標
    var svg = d3.select('#' + gantt_id)
        .append('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height)
        .attr('style', 'background-color: #EEEEEE;')
        .append('g')
        .attr('class', 'gantt-chart')
        .attr('width', width - margin_left)
        .attr('height', height)
        .attr('transform', 'translate(30,0)')
        .attr('fill', '#787878')

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(30, ' + (margin_top) + ')')
        .transition()
        .call(xAxis)

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (margin_left + 30) + ', ' + (margin_top) + ')')
        .transition()
        .call(yAxis)

    svg.selectAll('.y .tick text')
        .attr('dx', '.0em')
        .attr('dy', '-.9em')

    // 內隔線
    var scaleX = d3.scale.linear()
        .domain([minDate, maxDate])
        .range([0, width - margin_left])
        .clamp(true)

    var axisXGrid = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickFormat('')
        .tickSize(height, 10).tickPadding(1)

    var axisYGrid = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat('')
        .tickSize(-width, 0)

    svg.append('g')
        .call(axisXGrid)
        .attr({
            'fill': 'none',
            'stroke': 'rgba(0,0,0,.1)'
        })
        .attr('transform', 'translate(' + (30) + ', 50)')

    svg.append('g')
        .call(axisYGrid)
        .attr({
            'fill': 'none',
            'stroke': 'rgba(0,0,0,.1)',
            'transform': 'translate(' + (margin_left + 30) + ',30)'
        })

    //    繪圖
    var rectTransform = function(d) {
        return 'translate(' + x(d['start']) + ',' + y(d['taskname']) + ')'
    }

    bar_color = ['#f0b400', '#00f000', '#00b4f0', '#7800f0', '#f0003c']
    svg.selectAll('.chart')
        .data(task_detail).enter()
        .append('rect')
        .attr('class', 'bg_bar')
        .attr('height', function(d) { return y.rangeBand(); })
        .attr('width', x(maxDate))
        .attr('y', function(d, i) { return y(d['taskname']); })
        .attr('transform', 'translate(' + (margin_left + 30) + ', ' + (margin_top - 10) + ')')

    svg.selectAll('.chart')
        .data(task_detail).enter()
        .append('rect')
        .on("mouseover", gannt_mouseover)
        .on("mouseleave", gannt_mouseleave)
        .attr('class', 'bar')
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('y', function(d, i) { return y(d['taskname']) + (y.rangeBand() * 0.5) - 45; })
        .attr('x', function(d, i) { return x(new Date(d['start'])); })
        .attr('transform', 'translate(30, ' + (margin_top) + ')')
        .attr('height', '50')
        .attr('width', function(d) {
            return Math.min(1, (x(new Date(d['end'])) - x(new Date(d['start']))))
        })
        .transition()
        .duration(2000)
        .attr('width', function(d) {
            return Math.max(1, (x(new Date(d['end'])) - x(new Date(d['start']))))
        })
        .attr('fill', function(d, i) {
            var index_key = tasknames.indexOf(d['taskname'])
            return bar_color[index_key % 4]
        })
        .attr('transform', 'translate(30, ' + (margin_top) + ')')
    
      

    svg.selectAll('.chart')
        .data(task_detail).enter()
        .append('text')
        .attr('class', 'bar_text')
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('y', function(d, i) { return y(d['taskname']) + (y.rangeBand() * 0.5) - 0; })
        .attr('x', function(d, i) { return x(new Date(d['start'])); })
        .attr('transform', 'translate(30, ' + (margin_top) + ')')
        .attr('fill', '#ffffff')
        .attr('font-size', 'larger')
        .text(function(d) { return d['taskname'] })
    // tooltip使用
    var div = d3.select('#' + gantt_id).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    function gannt_mouseover(d, i) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html(d["taskname"])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }
    function gannt_mouseleave(d,i){
        div.transition()
            .duration(500)
            .style("opacity", 0);	
    }
}

