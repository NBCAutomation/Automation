<?php include_once './views/base/header.php' ?>
<?php if ($mainView) { ?>
	<div>
		<h3>Please login</h3>
	</div>
	<?php if($messages){ ?>
		<div class="alert alert-dismissible alert-warning">
			<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
			<h4>Warning!</h4>
			<p>Best check yo self; <?php echo $messages; ?>.</p>
		</div>
	<?php } ?>
	<div class="row">
			<div class="entry_form">
				<form action="/login/main" method="post" id="main_entry_form">
					<div class="form_field">
						<label>Email:</label>
						<input type="input" name="email" size="35" id="email" class="inputField" />
						<div class="clear"></div>
					</div>
					<div class="form_field">
						<label>Password:</label>
						<input type="input" name="password" size="35" id="password" class="inputField" />
						<div class="clear"></div>
					</div>
					<div class="clear"></div>
					<div id="input_buttons">
						<input type="hidden" value="set" name="method" />
						<input type="hidden" value="true" name="submitted" />
						<input type="submit" value="Submit" name="submit" class="submit_button" />
					</div>
				</form>
			</div>		   
		</div>
<?php } ?>
<?php include_once './views/base/footer.php' ?>