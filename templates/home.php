<?php include_once 'base/header.php'; ?>
	<div class="panel-body">
		<?php if ($user) { ?>
			<h4>Welcome, <?php echo $user['first_name']; ?></h4>
		<?php } ?>
	</div>
<?php include_once 'base/footer.php' ?>