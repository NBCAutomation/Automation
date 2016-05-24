<?php include_once './views/base/header.php'; ?>
	<div class="panel-body">
		<?php if ($user) { ?>
			<h2 class="page-title">Dashboard</h2>
			<h4><?php echo $user['name']; ?></h4>
		<?php } ?>
	</div>
<?php include_once './views/base/footer.php' ?>