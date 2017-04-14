						</div>
						
					</div>
				</div>
				
				<div class="clearfix pt pb">
					<div class="col-md-12">
						<p><em>&copy; OTS Spire V3.0</em></p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<style type="text/css">
		.ts-sidebar {display: none !important;}
	</style>
	<!-- Loading Scripts -->
	<script src="/assets/js/bootstrap-select.min.js"></script>
	<script src="/assets/js/bootstrap.min.js"></script>
	<script src="/assets/js/jquery.dataTables.min.js"></script>
	<script src="/assets/js/dataTables.bootstrap.min.js"></script>
	<script src="/assets/js/Chart.min.js"></script>
	<script src="/assets/js/fileinput.js"></script>
	<!-- <script src="/assets/js/chartData.js"></script> -->
	<script src="/assets/js/main.js"></script>
	<?php if ($page_name == 'home') {?>
	<?php 
		// echo '<pre>';
		// var_dump($chartLoadTimeData[0]);
		// echo '</pre>';


		$allLoadTimeData = $chartLoadTimeData[0];
		
		$loadTimeLabelArray = array();
		$loadTimeLabelArrayData = array();

		$manifestDataPointArray = array();
		$manifestDataPointArrayData = array();

		$navDataPointArray = array();
		$navDataPointArrayData = array();

		$sectionDataPointArray = array();
		$sectionDataPointArrayData = array();

		$contentDataPointArray = array();
		$contentDataPointArrayData = array();


		foreach ($allLoadTimeData as $thisReportKey => $thisReportData) {

			// echo $thisReportKey;
			// echo $thisReportData;

			// echo '<pre>';
			// var_dump($thisReportData);
			// echo '</pre>';

echo $thisReportData['loadTimeFrom'].'<br />';
echo $thisReportData['averageLoadTime'].'<br />';
// echo $thisReportData['date'].'<br />';
echo Date('n/d/Y', strtotime($thisReportData['date'])).'<br />';

			$loadTimeLabelArrayData['type'] = $thisReportData['loadTimeFrom'];
			$loadTimeLabelArrayData['loadtime'] = $thisReportData['averageLoadTime'];
			$loadTimeLabelArrayData['date'] = Date('n/d/Y', strtotime($thisReportData['date']));
			
			$loadTimeLabelArray[$thisReportKey] = $loadTimeLabelArrayData;
			
			if (strstr($thisReportData['loadTimeFrom'], 'ManifestTest')) {
				$manifestDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$manifestDataPointArrayData[$thisReportKey] = $manifestDataPointArray;
			}

			if (strstr($thisReportData['loadTimeFrom'], 'NavTest')) {
				$navDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$navDataPointArrayData[$thisReportKey] = $navDataPointArray;
			}

			if (strstr($thisReportData['loadTimeFrom'], 'SectionContent')) {
				$sectionDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$sectionDataPointArrayData[$thisReportKey] = $sectionDataPointArray;
			}

			if (strstr($thisReportData['loadTimeFrom'], 'ContentTest')) {
				$contentDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$contentDataPointArrayData[$thisReportKey] = $contentDataPointArray;
			}

			// echo 'Manifest Stuff </br >';
			// echo 'averageLoadTime => ' . $thisReportData['averageLoadTime'].'<br />';
			// echo 'dataPointName => ' . $thisReportData['dataPointName'].'<br />';
			// 			// echo 'dayDate => ' . $thisReportData['dayDate'].'<br />';
			// echo 'dayDate => ' . Date('n/d/Y', strtotime($thisReportData['dayDate'])).'<br />';
			// echo 'hourInterval => ' . $thisReportData['hourInterval'].'<br />';

			// echo '"' . Date('n/d/Y', strtotime($thisReportData['dayDate'])).'_'.$thisReportData['hourInterval'].'", ';

			// echo '----------------<br />';
		}

		$dateLabels = array_column($loadTimeLabelArray, 'date');

		$manifestPointData = array_column($manifestDataPointArrayData, 'loadtime');
		$navPointData = array_column($navDataPointArrayData, 'loadtime');
		$sectionPointData = array_column($sectionDataPointArrayData, 'loadtime');
		$contentPointData = array_column($contentDataPointArrayData, 'loadtime');



		$loadTimeDataLabels = '"' . implode('","', $dateLabels).'"';

		$manifestLinePoints = implode(",", $manifestPointData);
		$navLinePoints = implode(",", $navPointData);
		$sectionLinePoints = implode(",", $sectionPointData);
		$contentLinePoints = implode(",", $contentPointData);

		// echo '<pre>';
		// var_dump($manifestDataPointArrayData);
		// echo $manifestLinePoints;
		// echo '</pre>';

	?>
	<script type="text/javascript">
		var swirlData = {
		    labels: [<?php echo $loadTimeDataLabels; ?>],
		    datasets: [
		        {
		            label: "Manifest Endpoint",
		            fillColor: "rgba(220,220,220,0.2)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [<?php echo $manifestLinePoints; ?>]
		        },
		        {
		            label: "Nav API Loadtimes",
		            fillColor: "rgba(151,187,205,0.2)",
		            strokeColor: "rgba(151,187,205,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [<?php echo $navLinePoints; ?>]
		        },
		        {
		            label: "Section API Loadtimes",
		            fillColor: "rgba(151,187,205,0.2)",
		            strokeColor: "rgba(51,87,20,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [<?php echo $sectionLinePoints; ?>]
		        },
		        {
		            label: "Content API Loadtimes",
		            fillColor: "rgba(151,187,205,0.2)",
		            strokeColor: "rgba(100,181,200,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [<?php echo $contentLinePoints; ?>]
		        }
		    ]
		}

		window.onload = function(){
			var ctx = document.getElementById("lineChart").getContext("2d");
			window.myLine = new Chart(ctx).Line(swirlData, {
				responsive: true,
				scaleShowVerticalLines: false,
				scaleBeginAtZero : true,
				multiTooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
			});
		}
		// var barChartData = {
		// 	labels: ["January", "February", "March"],
		//     datasets: [
		//         {
		//             label: "Manifest Errors",
		//             fillColor: "rgba(220,220,100,0.5)",
		//             strokeColor: "rgba(220,220,100,0.8)",
		//             highlightFill: "rgba(220,220,100,0.75)",
		//             highlightStroke: "rgba(220,220,100,1)",
		//             data: [<?php echo $man30Day ?>]
		//         },
		//         {
		//             label: "Navigation Errors",
		//             fillColor: "rgba(220,220,220,0.5)",
		//             strokeColor: "rgba(220,220,220,0.8)",
		//             highlightFill: "rgba(220,220,220,0.75)",
		//             highlightStroke: "rgba(220,220,220,1)",
		//             data: [<?php echo $nav30Day ?>]
		//         },
		//         {
		//             label: "Content Errors",
		//             fillColor: "rgba(151,187,205,0.5)",
		//             strokeColor: "rgba(151,187,205,0.8)",
		//             highlightFill: "rgba(151,187,205,0.75)",
		//             highlightStroke: "rgba(151,187,205,1)",
		//             data: [<?php echo $cont30Day ?>]
		//         }
		//     ]
		// }
	</script>
	<?php } ?>
	<script type="text/javascript">
	$(window).load(function() {
		<?php if ($page_name == 'home') { ?>
		// Bar Chart from barChartData
		// var $ctx = document.getElementById("chart-bar").getContext("2d");
		// window.myBar = new Chart($ctx).Bar(barChartData, {
		// 	responsive : true
		// });
		<?php } ?>

		$('input[class^="class"]').click(function() {
		    var $this = $(this);
		    if ($this.is(".class1")) {
		        if ($(".class1:checked").length > 0) {
		            $(".class2").prop({ disabled: true, checked: false });
		            $(".class3").prop({ disabled: true, checked: false });
		        } else {
		        	 $(".class2").prop("disabled", false);
		        	 $(".class3").prop("disabled", false);
		        }
		    } else if ($this.is(".class2")) {
			    if ($(".class2:checked").length > 0) {
		            $(".class1").prop({ disabled: true, checked: false });
		            $(".class3").prop({ disabled: true, checked: false });
		        } else {
		        	 $(".class1").prop("disabled", false);
		        	 $(".class3").prop("disabled", false);
		        }
	        } else if ($this.is(".class3")) {
		        if ($(".class3:checked").length > 0) {
		            $(".class1").prop({ disabled: true, checked: false });
		            $(".class2").prop({ disabled: true, checked: false });
		        } else {
		        	 $(".class1").prop("disabled", false);
		        	 $(".class2").prop("disabled", false);
		        }
	        }
		});

		var button = $('#submit-data');
		var orig = [];

		$.fn.getType = function () {
		    return this[0].tagName == "INPUT" ? $(this[0]).attr("type").toLowerCase() : this[0].tagName.toLowerCase();
		}

		$("form :input").each(function () {
		    var type = $(this).getType();
		    var tmp = {
		        'type': type,
		        'value': $(this).val()
		    };
		    if (type == 'radio') {
		        tmp.checked = $(this).is(':checked');
		    }
		    orig[$(this).attr('id')] = tmp;
		});

		$('form').bind('change keyup', function () {

		    var disable = true;
		    $("form :input").each(function () {
		        var type = $(this).getType();
		        var id = $(this).attr('id');

		        if (type == 'text' || type == 'select') {
		            disable = (orig[id].value == $(this).val());
		        } else if (type == 'radio') {
		            disable = (orig[id].checked == $(this).is(':checked'));
		        }

		        if (!disable) {
		            return false; // break out of loop
		        }
		    });

		    button.prop('disabled', disable);
		});

		$(".process-data").fadeIn("slow");
	})
	</script>
</body>
</html>