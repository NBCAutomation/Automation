 $(document).ready(function () {
	 
 	$(".ts-sidebar-menu li a").each(function () {
 		if ($(this).next().length > 0) {
 			$(this).addClass("parent");
 		};
 	})
 	var menux = $('.ts-sidebar-menu li a.parent');
 	$('<div class="more"><i class="fa fa-angle-down"></i></div>').insertBefore(menux);
 	$('.more').click(function () {
 		$(this).parent('li').toggleClass('open');
 	});
	$('.parent').click(function (e) {
		e.preventDefault();
 		$(this).parent('li').toggleClass('open');
 	});
 	$('.menu-btn').click(function () {
 		$('nav.ts-sidebar').toggleClass('menu-open');
 	});
	 
	 

	// Table settings
	$('#zctb').DataTable({
		"scrollX": true,
		"order": [[ 2, "desc" ]],
		"iDisplayLength": 25
	});

 	$('.data_table').DataTable();

	$('.report_data_table').DataTable({
		"scrollX": true,
		"iDisplayLength": 100
	});

	$('#stations-table').DataTable({
		"scrollX": true,
		"iDisplayLength": 100
	});


	// $.fn.dataTable.ext.search.push(
	// 	function( settings, data, dataIndex ) {
	// 		var min = parseInt( $('#min').val(), 10 );
	// 		var max = parseInt( $('#max').val(), 10 );
	// 		var age = parseFloat( data[3] ) || 0; // use data for the age column

	// 		if ( ( isNaN( min ) && isNaN( max ) ) ||
	// 		( isNaN( min ) && age <= max ) ||
	// 		( min <= age   && isNaN( max ) ) ||
	// 		( min <= age   && age <= max ) )
	// 		{
	// 			return true;
	// 		}
	// 			return false;
	// 	}
	// );
	  
 
	// var table = $('#zctb').DataTable();

	// // Event listener to the two range filtering inputs to redraw on input
	// $('#min, #max').keyup( function() {
	// table.draw();
	// } );
 
	 
	//  $("#input-43").fileinput({
	// 	showPreview: false,
	// 	allowedFileExtensions: ["zip", "rar", "gz", "tgz"],
	// 	elErrorContainer: "#errorBlock43"
	// 		// you can configure `msgErrorClass` and `msgInvalidFileExtension` as well
	// });



    
 	// Line chart from swirlData for dashReport
 	// var ctx = document.getElementById("dashReport").getContext("2d");
 	// window.myLine = new Chart(ctx).Line(swirlData, {
 	// 	responsive: true,
 	// 	scaleShowVerticalLines: false,
 	// 	scaleBeginAtZero : true,
 	// 	multiTooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
 	// }); 
 	
 	// // Pie Chart from doughutData
 	// var doctx = document.getElementById("chart-area3").getContext("2d");
 	// window.myDoughnut = new Chart(doctx).Pie(doughnutData, {responsive : true});

 	// // Dougnut Chart from doughnutData
 	// var doctx = document.getElementById("chart-area4").getContext("2d");
 	// window.myDoughnut = new Chart(doctx).Doughnut(doughnutData, {responsive : true});


 });
