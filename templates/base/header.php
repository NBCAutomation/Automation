<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
	<title><?php echo $title ?></title>
	<link rel="stylesheet" type="text/css" href="/assets/css/master.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
	<!--[if lt IE 9]>
	<script src="oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->

</head>
<body id="<?php echo $page_name; ?>">
	<div class="brand clearfix">
		<h1><a href="/">OTS Spire Web App <span class="simpLogo"><i class="fa fa-code-fork"></i></span></a></h1>
		<!-- <p class="tagline">A Testing &amp; Reporting Utility</p> -->
		<span class="menu-btn"><i class="fa fa-bars"></i></span>
		<ul class="ts-profile-nav">
			<?php if ($user) { ?>
			<li class="ts-account">
				<?php 
					$gravatar = Spire::getGravatar($user['email']);
				?>
				<a href="#"><img src="<?php echo $gravatar; ?>" class="ts-avatar hidden-side" alt=""> Account <i class="fa fa-angle-down hidden-side"></i></a>
				<ul>
					<li><a href="/dashboard/account">Edit Account</a></li>
					<li><a href="/logout">Logout</a></li>
				</ul>
			</li>
			<?php } else { ?>
				<li><a href="/login/main">Login</a></li>
			<?php } ?>
		</ul>
	</div>
	
	<div class="ts-main-content">
		<?php if ($user) { ?>
		<nav class="ts-sidebar">
			<!-- class="open" -->
			<ul class="ts-sidebar-menu ts-profile-nav">
				<li class="ts-label">User Menu</li>
				<li <?php if ($accountClass) { echo 'class="open"'; } ?>><a href="/dashboard/account"><i class="fa fa-user"></i> Edit Account</a></li>
				<li><a href="/logout"><i class="fa fa-power-off"></i> Logout</a></li>
			</ul>
			<ul class="ts-sidebar-menu">
				<li class="ts-label">Main Menu</li>
				<li <?php if ($dashClass) { echo 'class="open"'; } ?>><a href="/"><i class="fa fa-desktop"></i> Dashboard</a></li>
				<li <?php if ($reportClass) { echo 'class="open"'; } ?>>
					<a href="/reports/main"><i class="fa fa-table"></i> Reports</a>
					<ul>
						<li><a href="/reports/api_manifest_audits">Manifest Audits</a></li>
						<li><a href="/reports/api_navigation_audits">Navigation Audits</a></li>
						<li><a href="/reports/api_article_audits">Article/Content Audits</a></li>
						<li><a href="/reports/ott_tests">OTT Audits</a></li>
						<li><a href="/reports/regression_tests">Regression Results</a></li>
						<li <?php if ($reportLoadtimeSubNav) { echo 'class="open"'; } ?>><a href="#">API Loadtimes</a>
							<ul>
								<li><a href="/reports/loadtimes">Overview</a></li>
								<li><a href="/reports/loadtimes/loadtime-search">Search</a></li>
							</ul>
						</li>
						<li <?php if ($reportStaleContentSubNav) { echo 'class="open"'; } ?>><a href="#">Stale Content Checks</a>
							<ul>
								<li><a href="/reports/stale_content_check">Overview</a></li>
								<li><a href="/reports/stale_content_check/stalecontent-search">Search</a></li>
							</ul>
						</li>
					</ul>
				</li>
				<li <?php if ($scriptClass) { echo 'class="open"'; } ?>><a href="/scripts/main"><i class="fa fa-bolt"></i> Scripts</a></li>
				<li <?php if ($helpClass) { echo 'class="open"'; } ?>><a href="/help"><i class="fa fa-book"></i> Help</a></li>
			</ul>
			<?php if ($uAuth && $uRole < 3) { ?>
			<ul class="ts-sidebar-menu">
				<li class="ts-label">Admin Menu</li>
				<li <?php if ($admin_dashClass) { echo 'class="open"'; } ?>><a href="/admin/main"><i class="fa fa-desktop"></i> Dashboard</a></li>
				<li <?php if ($admin_stationsClass) { echo 'class="open"'; } ?>><a href="/admin/stations/main"><i class="fa fa-building"></i> Stations</a></li>
				<li <?php if ($admin_usersClass) { echo 'class="open"'; } ?>><a href="/admin/users/main"><i class="fa fa-users"></i> Users</a></li>
			</ul>
			<?php } ?>
		</nav>
		<?php } ?>
		<div class="content-wrapper">
			<div class="container-fluid">

				<div class="row">
					<div class="col-md-12">
						<h2 class="page-title"><?php echo $title; ?></h2>
						<?php include_once 'breadcrumbs.php' ?>