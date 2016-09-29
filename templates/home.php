<?php include_once 'base/header.php'; ?>
	<div class="panel-body">
		<?php if ($user) { ?>
			<h4>Welcome, <?php echo $user['first_name']; ?></h4>
			<hr />
		<?php } ?>
		<div class="row">
			<a href="https://nbclocalmedia.quickbase.com/db/bd3dkzuga?a=dr&rid=1417" target="_blank">Automation QB Tickets</a>
		</div>
	</div>
<?php include_once 'base/footer.php' ?>