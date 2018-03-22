<?php include_once 'base/header.php'; ?>
	<div class="panel-body">
	<?php
		$tableHeaders = '<th><i class="fa fa-cog"></i></th><th>ID</th><th>Call Letters</th><th>Brand</th><th>Shortname</th><th>URL</th><th>Group</th><th>API Ver.</th>';

		if ($stationsView){
	?>
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
	
	<?php } elseif ($stationEditView) { ?>
	<?php 
		// echo "<pre>";
		// var_dump($editingStation->refCacheKey);
		// $cacheFile = './tmp/' . implode('/', array_slice(str_split($editingStation->refCacheKey, 2), 0, 3));
		// var_dump($cacheFile);
		// echo "</pre>";
	?>

		<div id="station_update_panel" class="panel-body">
			<h4>Editing: <?php echo $editingStation->brand; ?></h4>
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
							<h3><?php echo $editingStation->brand; ?></h3>
							<a href="/utils/tasks?task=getDictionaryData&property=<?php echo $editingStation->shortname; ?>" target="_blank">View Dictionary Data</a>
						</div>
						<hr />
						<form action="/admin/stations/update/<?php echo $editingStation->id; ?>" method="post" id="user_main_entry_form" class="mt">
							<table class="table table-bordered table">
								<tbody>
									<tr>
										<!--<td>
											<div class="form_field">
												<label class="text">Status:</label>
												<select name="u_status" class="form_select">
													<option value="1" <?php echo ($editingStation->status === 1 ? 'selected="selected"' : ''); ?>>Active</option>
													<option value="0" <?php echo ($editingStation->status === 0 ? 'selected="selected"' : ''); ?>>Disabled</option>
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
															if ($i == $editingStation->api_version) { $selected = 'selected'; } else { $selected = ''; }

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
											<input type="text" name="stationURL" size="30" id="stationURL" class="form-control mb stationURL" value="<?php echo $editingStation->url ?>" />
										</td>
									</tr>
									<tr>
										<td>
											<label class="text form-label"><b>Shortname</b>:</label>
											<input type="text" name="stationShortname" size="30" id="stationShortname" class="form-control mb stationShortname" value="<?php echo $editingStation->shortname ?>" />
										</td>
									</tr>
									<tr>
										<td>
											<label class="text form-label"><b>Call letters</b>:</label>
											<input type="text" name="stationCallLetters" size="18" id="stationCallLetters" class="form-control mb stationCallLetters" value="<?php echo $editingStation->call_letters; ?>" />
										</td>
									</tr>
									<tr>
										<td>
											<div class="form_field">
												<label class="text form-label">Group:</label>
												<select name="stationGroup" class="form_select">
													<option value="OTS" <?php if ($editingStation->group == 'OTS') { $selected = 'selected'; } else { $selected = ''; } echo $selected; ?>>OTS</option>
													<option value="TSG" <?php if ($editingStation->group == 'TSG') { $selected = 'selected'; } else { $selected = ''; } echo $selected; ?>>TSG</option>
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
											<input type="hidden" value="<?php echo $editingStation->id; ?>" name="stationID" />
											<input type="hidden" value="<?php echo $editingStation->brand; ?>" name="stationBrand" />
											<input type="hidden" value="<?php echo $cacheFile; ?>" name="stationRefCache" />
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