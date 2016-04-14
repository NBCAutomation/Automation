<?php include_once './views/base/header.php' ?>
	<div>
		<p>Please login</p>
	</div>
	<div class="row">
		<div class="entry_form">
			<form action="/" method="post" id="main_entry_form">
				<div class="form_field">
					<label>Name:</label>
					<input type="input" name="name" size="35" id="name" class="inputField" />
					<div class="clear"></div>
				</div>
				<div class="form_field">
					<label>Email:</label>
					<input type="input" name="email" size="35" id="email" class="inputField" />
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
<?php include_once './views/base/footer.php' ?>