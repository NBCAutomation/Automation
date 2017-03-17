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
	<!-- Loading Scripts -->
	<script src="/assets/js/bootstrap-select.min.js"></script>
	<script src="/assets/js/bootstrap.min.js"></script>
	<script src="/assets/js/jquery.dataTables.min.js"></script>
	<script src="/assets/js/dataTables.bootstrap.min.js"></script>
	<script src="/assets/js/Chart.min.js"></script>
	<script src="/assets/js/fileinput.js"></script>
	<script src="/assets/js/chartData.js"></script>
	<script src="/assets/js/main.js"></script>
	<?php if ($page_name == 'home') {?>
	<script type="text/javascript">
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

		$(".progress").fadeOut("slow");
		$(".process-data").fadeIn("slow");
	})
	</script>
</body>
</html>