<?php 
	$db = new DbHandler();
	$globalAPIVer = $db->getStationsGlobalAPIVer();
	$setAPIVer = $globalAPIVer['data']['value'];
	$getStations = $db->getAllStations();
	$stations = $getStations['data'];
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
					<div class="input-group mb"><span class="input-group-addon"> <input type="checkbox" class="setContentIDToggle"> </span>
						<input type="text" class="form-control" id="setContentIDInput" 	name="content_id">
					</div>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">Section Path</label>
				<div class="col-sm-10">
					<div class="input-group mb"><span class="input-group-addon"> <input type="checkbox" class="setSectionPathToggle"> </span>
						<input type="text" class="form-control"  id="setSectionPathInput" name="section_path">
					</div>
				</div>
			</div>
			<div class="alert alert-dismissible alert-info">
				<p class="help-block"><em>If testing specific content endpoints and/or content payloads, select the checkbox for the desired testable item, then enter the details. Only one option can be selected at a time.</em> If testing path, enter as: /news/local/</p>
			</div>
			<hr />
			<?php } ?>
			<?php if($view != 'regressionTest'){ ?>
			<div class="form-group" style="margin-left: 3em;">
				<div class="checkbox">
					<label for="checkbox1">Set API Version for test? </label>
					<input id="checkbox1" class="apiversionSet" type="checkbox" name="setTestingApiVer" value="true">
					
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label">API Version</label>
				<div class="col-sm-10">
					<select class="form-control" id="apiversionSelect" name="api_version">
					<?php
						for ($i = 1; $i <= 20; $i++) {
							if ($i == $setAPIVer) { $selected = 'selected'; } else { $selected = ''; }

				            echo '<option value="'.$i.'" '.$selected.'>'.$i.'</option>';
			        	}
			        ?>
					</select>
					<br />
					<p class="small">current global API version: <?php echo $setAPIVer; ?>. <a href="/admin/stations/main">update/change here</a></p>
				</div>
			</div>
			<hr />
			<div class="form-group">
				<label class="col-sm-2 control-label">Enable JSON Validation</label>
				<div class="col-sm-10">
					<div class="checkbox checkbox-success">
						<input id="checkbox1" name="output" type="checkbox" value="json_validation">
						<label for="checkbox1">Yes (not recommended)</label>
					</div>
				</div>
			</div>
			<div class="alert alert-dismissible alert-info">
				<p class="help-block">When this is set, the API tries to be "error-proof" by validating JSON before appending to the payload. If something doesn’t validate, it will be removed from the payload, allowing the response to be returned minus any broken items. If it’s set to "No"/false (default), the payload is not verified, thereby exposing any broken content items and/or a malformed payload.</p>
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
			<div class="form-group">
				<label class="col-sm-2 control-label">Specific Sites
					<br>
				</label>
				<?php
					$i = 0;
					$stationOptions = '<div class="col-sm-3">';

					foreach ($stations[0] as $stationProperty) {
						if (is_array($stationProperty)) {
							$stationOptions .= '<div class="checkbox">';
							$stationOptions .= '<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="'.$stationProperty['shortname'].'">';
						    $stationOptions .= '<label for="checkbox1">'.$stationProperty['brand'].'</label>';
						    $stationOptions .= '</div>';

							if(($i+1) % 12 == 0) {
								$stationOptions .= '</div><div class="col-sm-3">';
							}
						}
						$i++;
					}
					$stationOptions .= '</div>';
					echo $stationOptions;
				?>
			</div>
			<?php if( $view == 'regressionTest'){ ?>
				<div class="form-group">
					<label class="col-sm-2 control-label">Additional Properties
						<br>
					</label>
					<div class="col-sm-3">
						<div class="checkbox">
							<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="cozitv">
							<label for="checkbox1">CoziTV</label>
						</div>
						<div class="checkbox">
							<input id="checkbox1" class="class3" type="checkbox" name="test_site[]" value="telexitos">
							<label for="checkbox1">Telexitos</label>
						</div>
					</div>
				</div>
			<?php } ?>

			<div class="form-group">
				<div class="col-sm-8 col-sm-offset-2">
					<input type="hidden" name="script" value="<?php echo $view; ?>">
					<button class="btn btn-primary" type="submit">Run Script</button>
				</div>
			</div>
			<div class="hr-dashed"></div>
		</form>
	</div>