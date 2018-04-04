<?php include_once 'base/header.php'; ?>
	<div class="panel-body">
	<?php
		$tableHeaders = '<th><i class="fa fa-cog"></i></th><th>ID</th><th>Call Letters</th><th>Brand</th><th>Shortname</th><th>URL</th><th>Group</th><th>API Ver.</th>';

		if ($stationsView){
	?>
		<a href="/admin/stations/update/globalAPIVer?ref=<?php echo $stationsRefCacheLocation; ?>" class="btn btn-primary">Update API version globally</a>
		<hr />
		<table id="stations-table" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
			<thead>
				<tr>
					<?php echo $tableHeaders; ?>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<?php echo $tableHeaders; ?>
				</tr>
			</tfoot>
			<tbody>
			<?php
				foreach ($stations[0] as $stationProperty) {
					if (is_array($stationProperty)) {
						echo '<tr class="report_row">';
				    	echo '<td><a href="/admin/stations/update/'.$stationProperty['id'].'?brand='.$stationProperty['shortname'].'"><i class="fa fa-cog" style="font-size:20px;"></i></a></td>';
					    echo '<td>'.$stationProperty['id'].'</td>';
					    echo '<td>'.$stationProperty['call_letters'].'</td>';
					    echo '<td>'.$stationProperty['brand'].'</td>';
					    echo '<td>'.$stationProperty['shortname'].'</td>';
					    echo '<td>'.$stationProperty['url'].'</td>';
					    echo '<td>'.$stationProperty['group'].'</td>';
					    echo '<td>'.$stationProperty['api_version'].'</td>';
	                	echo "</tr>";	
					}
				}
			?>
			</tbody>
		</table>
	
	<?php
		} elseif ($pageView == 'globalAPIVer') {
	?>
		<h4>Global API version update</h4>
		<p class="alert alert-danger">* this will overwrite the API Version for all stations!</p>
		<table id="stations-settings-table" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
			<?php
				$cacheFile = './tmp/' . implode('/', array_slice(str_split($globalAPIVer['refCacheKey'], 2), 0, 3));
				$stationsCacheFile = './tmp/' . implode('/', array_slice(str_split($allStationsRefCacheLocation, 2), 0, 3));
			?>
			<tr>
				<td>
					<?php if($messages){
						?>
						<?php if( $message_e == true ){ ?>
							<div class="alert alert-dismissible alert-danger">
								<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
								<h4>Warning!</h4>
								<p><?php echo $messages; ?>.</p>
							</div>
						<?php } else { ?>
							<div class="alert alert-dismissible alert-success">
								<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
								<h4>Success!</h4>
								<p><?php echo $messages; ?></p>
							</div>
						<?php } ?>
					<?php } ?>
					<form action="/admin/stations/update/globalAPIVer" method="post" id="user_main_entry_form" class="mt">
						<div class="form_field">
							<label class="text form-label">API Version:</label>
							<select name="globalAPIVer" class="form_select">
								<?php
									for ($i = 1; $i <= 25; $i++) {
										if ($i == $globalAPIVer['value']) { $selected = 'selected'; } else { $selected = ''; }

							            echo '<option value="'.$i.'" '.$selected.'>'.$i.'</option>';
						        	}
						        ?>
							</select>
							<div class="clear"></div>
						</div>
						<hr />
						<div class="form_field">
							<label class="control-label" style="float: left;">Notes/Ticket</label>
							<div class="col-sm-10">
								<textarea class="form-control" rows="3" name="update_notes"></textarea>
								<span class="help-block m-b-none">Enter a brief description or any notes related to this change. Please be sure to reference a ticket if avail.</span>
							</div>
							<div class="clear"></div>
						</div>
						<div class="clear"></div>
						<div id="input_buttons">
							<input type="hidden" value="<?php echo $cacheFile; ?>" name="refCacheLocation" />
							<input type="hidden" value="<?php echo $stationsCacheFile; ?>" name="refAllStationsCacheLocation" />
							<input type="hidden" value="updateGlobalAPI" name="task" />
							<input type="hidden" value="true" name="submitted" />
							<!--<input type="submit" value="Submit" name="submit" class="submit_button" />-->
							<hr />
							<button id="submit-data"  disabled="" class="btn btn-primary btn-block" type="submit" value="Submit" name="submit">Update</button>
						</div>
					</form>
				</td>
			</tr>
		</table>
	<?php
		} elseif ($pageView == 'stationEditView') {
			$currentStation = $editingStation[0];
			$refCacheKey = $editingStation['refCacheKey'];

			// echo "<pre>";
			// var_dump($currentStation);
			// var_dump($refCacheKey->scalar);
			$cacheFile = './tmp/' . implode('/', array_slice(str_split($refCacheKey->scalar, 2), 0, 3));
			// var_dump($cacheFile);
			// echo "</pre>";
	?>

		<div id="station_update_panel" class="panel-body">
			<h4>Editing: <?php echo $currentStation['brand']; ?></h4>
			<div class="panel panel-default">
				<div class="panel-body">
					<div class="table-responsive">
						<?php if($messages){
							?>
							<?php if( $message_e == true ){ ?>
								<div class="alert alert-dismissible alert-danger">
									<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
									<h4>Warning!</h4>
									<p><?php echo $messages; ?>.</p>
								</div>
							<?php } else { ?>
								<div class="alert alert-dismissible alert-success">
									<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
									<h4>Success!</h4>
									<p><?php echo $messages; ?></p>
								</div>
							<?php } ?>
						<?php } ?>
						<div>
							<h3><?php echo $currentStation['brand']; ?></h3>
							<a href="/utils/tasks?task=getDictionaryData&property=<?php echo $currentStation['shortname']; ?>" target="_blank">View Dictionary Data</a>
						</div>
						<hr />
						<form action="/admin/stations/update/<?php echo $currentStation['id']; ?>" method="post" id="user_main_entry_form" class="mt">
							<table class="table table-bordered table">
								<tbody>
									<tr>
										<!--<td>
											<div class="form_field">
												<label class="text">Status:</label>
												<select name="u_status" class="form_select">
													<option value="1" <?php echo ($currentStation['status'] === 1 ? 'selected="selected"' : ''); ?>>Active</option>
													<option value="0" <?php echo ($currentStation['status'] === 0 ? 'selected="selected"' : ''); ?>>Disabled</option>
												</select>
												<div class="clear"></div>
											</div>
										</td>-->
									</tr>
									<tr>
										<td>
											<div class="form_field">
												<label class="text form-label">API Version:</label>
												<select name="stationApiVersion" class="form_select">
													<?php
														for ($i = 1; $i <= 25; $i++) {
															if ($i == $currentStation['api_version']) { $selected = 'selected'; } else { $selected = ''; }

												            echo '<option value="'.$i.'" '.$selected.'>'.$i.'</option>';
											        	}
											        ?>
												</select>
												<div class="clear"></div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<label class="text form-label"><b>URL</b>:</label>
											<input type="text" name="stationURL" size="30" id="stationURL" class="form-control mb stationURL" value="<?php echo $currentStation['url'] ?>" />
										</td>
									</tr>
									<tr>
										<td>
											<label class="text form-label"><b>Shortname</b>:</label>
											<input type="text" name="stationShortname" size="30" id="stationShortname" class="form-control mb stationShortname" value="<?php echo $currentStation['shortname'] ?>" />
										</td>
									</tr>
									<tr>
										<td>
											<label class="text form-label"><b>Call letters</b>:</label>
											<input type="text" name="stationCallLetters" size="18" id="stationCallLetters" class="form-control mb stationCallLetters" value="<?php echo $currentStation['call_letters']; ?>" />
										</td>
									</tr>
									<tr>
										<td>
											<div class="form_field">
												<label class="text form-label">Group:</label>
												<select name="stationGroup" class="form_select">
													<option value="OTS" <?php if ($currentStation['group'] == 'OTS') { $selected = 'selected'; } else { $selected = ''; } echo $selected; ?>>OTS</option>
													<option value="TSG" <?php if ($currentStation['group'] == 'TSG') { $selected = 'selected'; } else { $selected = ''; } echo $selected; ?>>TSG</option>
												</select>
												<div class="clear"></div>
											</div>
											<div class="clear"></div>
										</td>
									</tr>
								</tbody>
							</table>
							<table>
								<tbody>
									<tr>
										<div class="clear"></div>
										<div id="input_buttons">
											<input type="hidden" value="<?php echo $currentStation['id']; ?>" name="stationID" />
											<input type="hidden" value="<?php echo $currentStation['brand']; ?>" name="stationBrand" />
											<input type="hidden" value="<?php echo $cacheFile; ?>" name="refCacheLocation" />
											<input type="hidden" value="updateStation" name="task" />
											<input type="hidden" value="set" name="method" />
											<input type="hidden" value="true" name="submitted" />
											<!--<input type="submit" value="Submit" name="submit" class="submit_button" />-->
											<button id="submit-data"  disabled="" class="btn btn-primary btn-block" type="submit" value="Submit" name="submit">Update</button>
										</div>
									</tr>
								</tbody>
							</table>
						</form>
					</div>
				</div>
			</div>
		</div>
	<?php } ?>
	</div>
<?php include_once 'base/footer.php' ?>