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