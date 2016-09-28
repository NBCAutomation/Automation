<?php include_once 'base/header.php'; ?>
	<div class="panel-body">
		<?php
			// === User admin main ===
			if ($uAuth) {
				// echo '<h4>Welcome, '.$user['first_name'].'</h4>';
			} else {
				echo
				'<div class="alert alert-dismissible alert-danger">
					<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
					<h4>Warning!</h4>
					<p>Best check yo self; '.$uAthMessage.'.</p>
				</div>';				
			}

			if ($uAuth && $userView) {
				// var_dump($spireUsers);
			?>
		<div class="panel panel-default">
			<div class="panel-heading">All Users</div>
			<div class="panel-body">
				<table id="zctb" class="display table table-striped table-bordered table-hover" cellspacing="0" width="100%">
					<thead>
						<tr>
							<th><i class="fa fa-cog"></i></th>
							<th>ID</th>
							<th>First</th>
							<th>Last</th>
							<th>Email</th>
							<th>API Key</th>
							<th>Role</th>
							<th>Status</th>
						</tr>
					</thead>
					<tfoot>
						<tr>
							<th><i class="fa fa-cog"></i></th>
							<th>ID</th>
							<th>First</th>
							<th>Last</th>
							<th>Email</th>
							<th>API Key</th>
							<th>Role</th>
							<th>Status</th>
						</tr>
					</tfoot>
					<tbody>
			<?php
				foreach ($spireUsers as $spireUser) {
				    echo "<tr>";
				    echo "<td><a href=\"/admin/users/update/".$spireUser['id']."\"><i class=\"fa fa-cog\" style=\"font-size:20px;\"></i></a></td>";
				    echo "<td><a href=\"/admin/users/update/".$spireUser['id']."\">".$spireUser['id']."</a></td>";
	                echo "<td>".$spireUser['first_name']."</td>";
	                echo "<td>".$spireUser['last_name']."</td>";
	                echo "<td>".$spireUser['email']."</td>";
	                echo "<td>".$spireUser['api_key']."</td>";
	                echo "<td>".$spireUser['role']."</td>";
	                echo "<td>".($spireUser['status'] == 0 ? 'Disabled' : 'Enabled')."</td></tr>";
				}
			?>
					</tbody>
				</table>
			</div>
		</div>
			<?php
				// === Edit User ===
			} elseif ($uAuth && $userEditView) {
			?>
		<div id="user_update_panel" class="panel-body">
			<h4>Editing: <?php echo $editingUser['first_name'].'&nbsp;'.$editingUser['last_name']; ?></h4>
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
						<form action="/admin/users/update/<?php echo $editingUser['id']; ?>" method="post" id="user_main_entry_form" class="mt">
							<table class="table table-bordered table">
								<tbody>
									<tr>
										<td>
											<h3><?php echo $editingUser['first_name'] .' '. $editingUser['last_name']; ?></h3>
											<?php
												$time = strtotime($editingUser['created_at']);
												$createdTime = date("m/d/y g:i A", $time);
											?>
											<span>Created: <?php echo $createdTime; ?></span>
										</td>
									</tr>
									<tr>
										<td>
											<!-- <b>Status</b>: <?php echo ($editingUser['status'] === 1 ? '<span class="active">Active</span>' : '<span class="disabled">Disabled</span>'); ?> -->
											<div class="form_field">
												<label class="text">Status:</label>
												<select name="u_status" class="form_select">
													<option value="1" <?php echo ($editingUser['status'] === 1 ? 'selected="selected"' : ''); ?>>Active</option>
													<option value="0" <?php echo ($editingUser['status'] === 0 ? 'selected="selected"' : ''); ?>>Disabled</option>
												</select>
												<div class="clear"></div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<!-- <b>Role</b>: <?php echo $editingUser['role']; ?> -->
											<div class="form_field">
												<label class="text">Role:</label>
												<select name="u_role" class="form_select">
													<option value="0" <?php echo ($editingUser['roleID'] === 0 ? 'selected="selected"' : ''); ?>> admin</option>
													<option value="1" <?php echo ($editingUser['roleID'] === 1 ? 'selected="selected"' : ''); ?>> manager</option>
													<option value="2" <?php echo ($editingUser['roleID'] === 2 ? 'selected="selected"' : ''); ?>> developer</option>
													<option value="3" <?php echo ($editingUser['roleID'] === 3 ? 'selected="selected"' : ''); ?>> operations</option>
													<option value="4" <?php echo ($editingUser['roleID'] === 4 ? 'selected="selected"' : ''); ?>> user</option>
												</select>
												<div class="clear"></div>
											</div>
										</td>
									</tr>
									<tr>
										<td><b>Email</b>: <?php echo $editingUser['email']; ?></td>
									</tr>
									<tr>
										<td>
											<b>Key</b>: <?php echo $editingUser['api_key']; ?>
											<div class="clear"></div>
										</td>
									</tr>
								</tbody>
							</table>
							<table>
								<tbody>
									<tr>
										<div class="form_field">
											<label class="text-uppercase text-sm">New Password:</label>
											<input type="password" name="u_password" size="35" id="u_password" class="form-control mb u_password" />
											<div class="clear"></div>
										</div>
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