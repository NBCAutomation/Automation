<?php include_once 'base/header.php'; ?>
	<div class="panel-body">
		<?php if ($user) { ?>
			<div class="panel panel-default">
				<div class="panel-body">
					<div class="table-responsive">
						<table class="table table-bordered table">
							<tbody>
								<tr>
									<td>
										<h3><?php echo $user['first_name'] .' '. $user['last_name']; ?></h3>
									</td>
								</tr>
								<tr>
									<td><b>Role</b>: <?php echo ($user['role'] == 0 ? 'Admin' : 'User'); ?></td>
								</tr>
								<tr>
									<td><b>Email</b>: <?php echo $user['email']; ?></td>
								</tr>
								<tr>
									<td><b>Key</b>: <?php echo $user['api_key']; ?></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="panel-body">
					<div class="table-responsive">
						<table class="table table-bordered table">
							<tbody>
								<tr>
									<td>
										<h3>Update Password</h3>
									</td>
								</tr>
								<tr>
									<td>
										<form action="/dashboard/update" method="post" id="main_entry_form" class="mt">
											<div class="form_field">
												<label class="text-uppercase text-sm">Current Password:</label>
												<input type="password" name="password" size="35" id="password" class="form-control mb" />
												<div class="clear"></div>
											</div>
											<div class="form_field">
												<label class="text-uppercase text-sm">New Password:</label>
												<input type="password" name="new_password" size="35" id="new_password" class="form-control mb" />
												<div class="clear"></div>
											</div>
											<div class="clear"></div>
											<div id="input_buttons">
												<input type="hidden" value="<?php echo $user['id']; ?>" name="uid" />
												<input type="hidden" value="<?php echo $user['name']; ?>" name="name" />
												<input type="hidden" value="<?php echo $user['email']; ?>" name="email" />
												<input type="hidden" value="updateUser" name="task" />
												<input type="hidden" value="set" name="method" />
												<input type="hidden" value="true" name="submitted" />
												<!--<input type="submit" value="Submit" name="submit" class="submit_button" />-->
												<button class="btn btn-primary btn-block" type="submit" value="Submit" name="submit">Update</button>
											</div>
										</form>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

			</div>
		<?php } ?>
	</div>
<?php include_once 'base/footer.php' ?>