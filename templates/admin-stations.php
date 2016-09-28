<?php include_once 'base/header.php'; ?>
	<div class="panel-body">
	<?php if ($stationsView){ ?>
		<table id="stations-table" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
			<thead>
				<tr>
					<th><i class="fa fa-cog"></i></th>
					<th>ID</th>
					<th>Call Letters</th>
					<th>Brand</th>
					<th>Shortname</th>
					<th>URL</th>
					<th>Group</th>
					<th>API Ver.</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th><i class="fa fa-cog"></i></th>
					<th>ID</th>
					<th>Call Letters</th>
					<th>Brand</th>
					<th>Shortname</th>
					<th>URL</th>
					<th>Group</th>
					<th>API Ver.</th>
				</tr>
			</tfoot>
			<tbody>
			<?php
				foreach ($stations as $stationProperty) {
					
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
			?>
			</tbody>
		</table>
	
	<?php } elseif ($stationEditView) { ?>
		<div id="station_update_panel" class="panel-body">
			<h4>Editing: <?php echo $editingStation['brand']; ?></h4>
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
						<form action="/admin/stations/update/<?php echo $editingStation['id']; ?>" method="post" id="user_main_entry_form" class="mt">
							<table class="table table-bordered table">
								<tbody>
									<tr>
										<td>
											<h3><?php echo $editingStation['brand']; ?></h3>
										</td>
									</tr>
									<tr>
										<!--<td>
											<div class="form_field">
												<label class="text">Status:</label>
												<select name="u_status" class="form_select">
													<option value="1" <?php echo ($editingStation['status'] === 1 ? 'selected="selected"' : ''); ?>>Active</option>
													<option value="0" <?php echo ($editingStation['status'] === 0 ? 'selected="selected"' : ''); ?>>Disabled</option>
												</select>
												<div class="clear"></div>
											</div>
										</td>-->
									</tr>
									<tr>
										<td>
											<div class="form_field">
												<label class="text">API Version:</label>
												<select name="u_role" class="form_select">
													<!--<option value="1">1</option>
													<option value="2">2</option>
													<option value="3">3</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>
													<option value="4">4</option>-->
													<?php
													    for ($i=1; $i<=25; $i++)
													    {
													        ?>
													            <option value="<?php echo $i;?>"><?php echo $i;?></option>
													        <?php
													    }
													?>
												</select>
												<div class="clear"></div>
											</div>
										</td>
									</tr>
									<tr>
										<td><b>URL</b>: <?php echo $editingStation['url']; ?></td>
									</tr>
									<tr>
										<td><b>Shortname</b>: <?php echo $editingStation['shortname']; ?></td>
									</tr>
									<tr>
										<td>
											<div class="form_field">
												<label class="text">Group:</label>
												<select name="u_status" class="form_select">
													<option value="OTS">OTS</option>
													<option value="TSG">TSG</option>
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
											<input type="hidden" value="<?php echo $editingUser['id']; ?>" name="u_id" />
											<input type="hidden" value="<?php echo $editingUser['first_name'] .' '. $editingUser['last_name']; ?>" name="u_name" />
											<input type="hidden" value="<?php echo $editingUser['email']; ?>" name="u_email" />
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