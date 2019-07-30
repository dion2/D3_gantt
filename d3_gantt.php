<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Gantt</title>
</head>
<body>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="d3_gantt.js"></script>
<link href="d3_gantt.css" rel="stylesheet" type="text/css">
<style>

</style>
<div id="D3_gantt"></div>

<script>


$(document).ready(function(){

    var tasknames = ['AIX稽核 001'];
    var task_detail = [
        {'taskname':'AIX稽核 001','start':'2019/01/01','end':'2019/02/28'},
        {'taskname':'AIX稽核 001','start':'2019/03/01','end':'2019/04/28'}
        
    ];
    d3_gantt('D3_gantt','D3_gantt',tasknames,task_detail)
});

</script>


</body>
</html>