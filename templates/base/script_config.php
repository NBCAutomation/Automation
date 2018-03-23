<?php 
	$db = new DbHandler();
	$globalAPIVer = $db->getStationsGlobalAPIVer();
	$setAPIVer = $globalAPIVer['data']['value'];
?>
	<div class="panel-heading"><i class="fa fa-cogs" aria-hidden="true"></i> Configure Script</div>
	<div class="panel-body">
		<div class="alert alert-dismissible alert-info">
			<p><em>Note: Tests run asynchronously per selected site (test 1 > site 1, test 1 site 2, test 2 > site 1).</em></p>
		</div>
		<form method="post" class="form-horizontal">
			<?php if ($configureOutput) { ?>
			<div class="form-group">
				<label class="col-sm-2 control-label">Console Output
					<br>
				</label>
				<div class="col-sm-10">
					<?php if( $view == 'regressionTest' || $view == 'updateDictionaries' ) { ?>
						<div class="checkbox checkbox-success">
							<input id="checkbox1" name="output" type="checkbox" value="console" checked>
							<label for="checkbox1">Yes</label>
						</div>
					<?php } else { ?>
						<div class="checkbox">
							<input id="checkbox1" name="output" type="checkbox" value="console">
							<label for="checkbox1">Yes</label>
						</div>
					<?php } ?>
				</div>
			</div>
			<hr />
			<?php } ?>
			<div class="form-group">
				<label class="col-sm-2 control-label">Enviroment</label>
				<div class="col-sm-10">
					<select class="form-control" name="enviroment">
						<option>Prod</option>
						<option>Stage</option>
					</select>
				</div>
			</div>
			<hr />
			<?php if($view == 'apiCheck-article'){ ?>
			<div class="form-group">
				<label class="col-sm-2 control-label">Content ID</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" name="content_id">
				</div>
			</div>
			<hr />
			<?php } ?>
			<?php if($view != 'regressionTest'){ ?>
			<div class="form-group" style="margin-left: 3em;">
				<div class="checkbox">
					<label for="checkbox1">Set API Version</label>
					<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcnewyork">
					
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">API Version</label>
				<div class="col-sm-10">
					<select class="form-control" name="api_version">
					<?php
						for ($i = 1; $i <= 20; $i++) {
							if ($i == $setAPIVer) { $selected = 'selected'; } else { $selected = ''; }

				            echo '<option value="'.$i.'" '.$selected.'>'.$i.'</option>';
			        	}
			        ?>
					</select>
				</div>
			</div>
			<hr />
			<?php } ?>
			<?php if ($view == 'updateDictionaries') { ?>
			<div class="form-group">
				<label class="col-sm-2 control-label">Notes/Ticket</label>
				<div class="col-sm-10">
					<!-- <input type="text" class="form-control" name="dictionary_reason"> -->
					<textarea class="form-control" rows="3" name="update_notes"></textarea>
					<span class="help-block m-b-none">Enter a brief description of why the dictionary is being updated. Please be sure to reference a ticket if avail.</span>
				</div>
			</div>
			<?php } ?>
			<?php // if(! $view == 'regressionTest'){ ?>
			<div class="form-group">
				<label class="col-sm-2 control-label">Run Suite
					<br>
				</label>
				<div class="col-sm-10">
					<div class="checkbox">
						<input id="checkbox1" class="class1" name="brand_test" type="checkbox" value="all">
						<label for="checkbox1">Default (ALL Properties)</label>
					</div>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">Brand Specific
					<br>
				</label>
				<div class="col-sm-10">
					<div class="checkbox">
						<input id="checkbox1" class="class2" name="brand_test" type="checkbox" value="nbc">
						<label for="checkbox1">NBC (ALL)</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class2" name="brand_test" type="checkbox" value="telemundo">
						<label for="checkbox1">TSG (ALL)</label>
					</div>
				</div>
			</div>
			<?php // } ?>
			<div class="form-group">
				<label class="col-sm-2 control-label">Specific Sites
					<br>
				</label>
				<div class="col-sm-3">
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcnewyork">
						<label for="checkbox1">NBC New York</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbclosangeles">
						<label for="checkbox1">NBC Los Angeles</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcchicago">
						<label for="checkbox1">NBC Chicago</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcbayarea">
						<label for="checkbox1">NBC Bay Area</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcboston">
						<label for="checkbox1">NBC Boston</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcdfw">
						<label for="checkbox1">NBC DFW</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcmiami">
						<label for="checkbox1">NBC Miami</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcphiladelphia">
						<label for="checkbox1">NBC Philadelphia</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcconnecticut">
						<label for="checkbox1">NBC Connecticut</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcwashington">
						<label for="checkbox1">NBC Washington</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="nbcsandiego">
						<label for="checkbox1">NBC San Diego</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="necn">
						<label for="checkbox1">NECN</label>
					</div>
				</div>
				<div class="col-sm-3">
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundo20">
						<label for="checkbox1">Telemundo 20</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundo40">
						<label for="checkbox1">Telemundo 40</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundo47">
						<label for="checkbox1">Telemundo 47</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundo51">
						<label for="checkbox1">Telemundo 51</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundo52">
						<label for="checkbox1">Telemundo 52</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundo62">
						<label for="checkbox1">Telemundo 62</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundoareadelabahia">
						<label for="checkbox1">Telemundo Area de la Bahia</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundoarizona">
						<label for="checkbox1">Telemundo Arizona</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundoboston">
						<label for="checkbox1">Telemundo Boston</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundochicago">
						<label for="checkbox1">Telemundo Chicago</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundodallas">
						<label for="checkbox1">Telemundo Dallas</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundodenver">
						<label for="checkbox1">Telemundo Denver</label>
					</div>
				</div>
				<div class="col-sm-3">	
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundohouston">
						<label for="checkbox1">Telemundo Houston</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundolasvegas">
						<label for="checkbox1">Telemundo Las Vegas</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundosanantonio">
						<label for="checkbox1">Telemundo San Antonio</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telemundopr">
						<label for="checkbox1">Telemundo PR</label>
					</div>
				<?php if( $view == 'regressionTest'){ ?>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="cozitv">
						<label for="checkbox1">CoziTV</label>
					</div>
					<div class="checkbox">
						<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telexitos">
						<label for="checkbox1">Telexitos</label>
					</div>
				<?php } ?>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-8 col-sm-offset-2">
					<input type="hidden" name="script" value="<?php echo $view; ?>">
					<button class="btn btn-primary" type="submit">Run Script</button>
				</div>
			</div>
			<div class="hr-dashed"></div>
		</form>
	</div>