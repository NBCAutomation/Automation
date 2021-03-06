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
		/*.ts-sidebar {display: none !important;}*/
	</style>
	<!-- Loading Scripts -->
	<script src="/assets/js/bootstrap-select.min.js"></script>
	<script src="/assets/js/bootstrap.min.js"></script>
	<!-- <script src="/assets/js/jquery.dataTables.min.js"></script> -->
	<script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.js"></script>
	<script src="/assets/js/dataTables.bootstrap.min.js"></script>
	<script src="/assets/js/Chart.min.js"></script>
	<script src="/assets/js/fileinput.js"></script>
	<!-- <script src="/assets/js/chartData.js"></script> -->
	<script src="/assets/js/main.js"></script>
	<?php if ($page_name == 'home' || $loadTimesView) {?>
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

		$ottDataPointArray = array();
		$ottDataPointArrayData = array();

// var_dump(cal_days_in_month(CAL_GREGORIAN, 6, 2018));

		foreach ($allLoadTimeData as $thisReportKey => $thisReportData) {
			$loadTimeLabelArrayData['type'] = $thisReportData['loadTimeFrom'];
			$loadTimeLabelArrayData['loadtime'] = $thisReportData['averageLoadTime'];
			$loadTimeLabelArrayData['date'] = Date('n/d/Y', strtotime($thisReportData['date']));

			// echo $loadTimeLabelArrayData['date'].'<br />';
			
			$loadTimeLabelArray[$thisReportKey] = $loadTimeLabelArrayData;
			
			if (strstr($thisReportData['loadTimeFrom'], 'ManifestTest')) {
				$manifestDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$manifestDataPointArrayData[$thisReportKey] = ($manifestDataPointArray);
			}

			if (strstr($thisReportData['loadTimeFrom'], 'NavTest')) {
				$navDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$navDataPointArrayData[$thisReportKey] = ($navDataPointArray);
			}

			if (strstr($thisReportData['loadTimeFrom'], 'SectionContent')) {
				$sectionDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$sectionDataPointArrayData[$thisReportKey] = ($sectionDataPointArray);
			}

			if (strstr($thisReportData['loadTimeFrom'], 'ContentTest')) {
				$contentDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$contentDataPointArrayData[$thisReportKey] = ($contentDataPointArray);
			}

			if (strstr($thisReportData['loadTimeFrom'], 'OTTTest')) {
				$ottDataPointArray['loadtime'] = $thisReportData['averageLoadTime'];
				$ottDataPointArrayData[$thisReportKey] = ($ottDataPointArray);
			}
		}

		natsort($dateLabels);
		$dateLabels = array_column($loadTimeLabelArray, 'date');

		$manifestPointData = array_column($manifestDataPointArrayData, 'loadtime');
		$navPointData = array_column($navDataPointArrayData, 'loadtime');
		$sectionPointData = array_column($sectionDataPointArrayData, 'loadtime');
		$contentPointData = array_column($contentDataPointArrayData, 'loadtime');
		$ottPointData = array_column($ottDataPointArrayData, 'loadtime');


		$loadTimeDataLabels = '"' . implode('","', $dateLabels).'"';
		$interimCleanedTimeDataLabels = array_unique(explode(',', $loadTimeDataLabels));
		asort($interimCleanedTimeDataLabels);
		$cleanedTimeDataLabels = implode(',',$interimCleanedTimeDataLabels);

		$manifestLinePoints = (implode(",", $manifestPointData));
		$navLinePoints = (implode(",", $navPointData));
		$sectionLinePoints = (implode(",", $sectionPointData));
		$contentLinePoints = (implode(",", $contentPointData));
		$ottLinePoints = (implode(",", $ottPointData));

		// echo '<pre>';
		// natsort($cleanedTimeDataLabels);
		// var_dump($cleanedTimeDataLabels);
		// echo $manifestLinePoints.'<br />';
		// echo $navLinePoints.'<br />';
		// echo $manifestLinePoints.'<br />';
		// echo '</pre>';

	?>
	<?php //echo $manifestLinePoints; ?>
	<?php //echo $navLinePoints; ?>
	<?php //echo $sectionLinePoints; ?>
	<?php //echo $contentLinePoints; ?>
	<script type="text/javascript">
		var swirlData = {
		    labels: [<?php echo $cleanedTimeDataLabels; ?>],
		    datasets: [
		        {
		            label: "Manifest Endpoint",
		            fillColor: "rgba(255,255,255,0)",
		            strokeColor: "rgba(204,29,20,1)",
		            pointColor: "rgba(204,29,20,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [<?php echo $manifestLinePoints; ?>]
		        },
		        {
		            label: "Nav API Loadtimes",
		            fillColor: "rgba(255,255,255,0)",
		            strokeColor: "rgba(86,152,56,1)",
		            pointColor: "rgba(86,152,56,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [<?php echo $navLinePoints; ?>]
		        },
		        {
		            label: "Section API Loadtimes",
		            fillColor: "rgba(255,255,255,0)",
		            strokeColor: "rgba(248,127,6,1)",
		            pointColor: "rgba(248,127,6,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [<?php echo $sectionLinePoints; ?>]
		        },
		        {
		            label: "Content API Loadtimes",
		            fillColor: "rgba(255,255,255,0)",
		            strokeColor: "rgba(100,181,200,1)",
		            pointColor: "rgba(100,181,200,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [<?php echo $contentLinePoints; ?>]
		        },
		        {
		            label: "OTT API Loadtimes",
		            fillColor: "rgba(252,252,252,0)",
		            strokeColor: "rgba(138,43,226,1)",
		            pointColor: "rgba(138,43,226,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [<?php echo $ottLinePoints; ?>]
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
	</script>
	<?php } ?>
	<script type="text/javascript">
	$(window).load(function() {
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

		if ($("#apiversionSelect").length > 0) {
			document.getElementById("apiversionSelect").disabled = true;
		}

		$('input[class^="apiversionSet"]').click(function() {
		    var $thisOption = $(this);
		    if ($thisOption.is(".apiversionSet")) {
		        if ($(".apiversionSet:checked").length > 0) {
		            $("#apiversionSelect").prop({ disabled: false});
		        } else {
		        	$("#apiversionSelect").prop({ disabled: true});
		        }
		    }
		});

		if ($("#setContentIDInput").length > 0) {
			document.getElementById("setContentIDInput").disabled = true;
		}

		if ($("#setSectionPathInput").length > 0) {		
			document.getElementById("setSectionPathInput").disabled = true;
		}

		$('input[class^="setContentIDToggle"]').click(function() {
		    var $setIDToggle = $(this);
		    if ($setIDToggle.is(".setContentIDToggle")) {
		        if ($(".setContentIDToggle:checked").length > 0) {
		            $("#setContentIDInput").prop({disabled: false});
		            $(".setSectionPathToggle").prop({disabled: true});
		        } else {
		        	$("#setContentIDInput").val('');
		        	$(".setSectionPathToggle").prop({disabled: false});
		        	$("#setContentIDInput").prop({disabled: true});
		        }
		    }
		});

		$('input[class^="setSectionPathToggle"]').click(function() {
		    var $setIDToggle = $(this);
		    if ($setIDToggle.is(".setSectionPathToggle")) {
		        if ($(".setSectionPathToggle:checked").length > 0) {
		            $("#setSectionPathInput").prop({disabled: false});
		            $(".setContentIDToggle").prop({disabled: true});
		        } else {
		        	$("#setSectionPathInput").val('');
		        	$(".setContentIDToggle").prop({disabled: false});
		        	$("#setSectionPathInput").prop({disabled: true});
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