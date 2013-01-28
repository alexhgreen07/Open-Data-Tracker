<?php

$d3_header_text = '
<script src="js/d3/d3.min.js"></script>

<style>

div.graphs {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.bar {
  fill: steelblue;
}

.x.axis path {
  display: none;
}


</style>

';

function Create_Graph($div_id,$dataset)
{

	$html_output = '';

	$html_output .= '<script>';

	$html_output .= 'var dataset = [';

	foreach($dataset as $x => $y)
	{

		$html_output .= '{x: "'.$x.'", y: "'.$y.'"},';	
	}

	$html_output .= '];';

	$html_output .= '

	var margin = {top: 20, right: 20, bottom: 30, left: 30};
	var width = 500 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	var formatPercent = d3.format(".0%");

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(formatPercent);

	var svg = d3.select("#'.$div_id.'").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data = dataset;

	data.forEach(function(d) {
		d.y = +d.y;
	});

	x.domain(data.map(function(d) {
		return d.x; 
	}));
	y.domain([0,d3.max(data,function(d) { 
		return d.y; 
	})]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Frequency");

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) {
			return x(d.x); 
		})
		.attr("width", x.rangeBand())
		.attr("y", function(d) { 
			return y(d.y); 
		})
		.attr("height", function(d) { 
			return height - y(d.y); 
		});

	';	
	
	$html_output .= '</script>';
	
	return $html_output;
}

/*
$tabs = array(
    "Tab 1" => "Hello from tab 1.",
    "Tab 2" => "Hello from tab 2.",
);

echo Create_Tabs($tabs);
*/


?>
