<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
	<title><?php echo $title ?></title>
	<link rel="stylesheet" type="text/css" href="/assets/css/master.css">
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
			<li><a href="#">Help</a></li>
			<li class="ts-account">
				<a href="#">Account <i class="fa fa-angle-down hidden-side"></i></a>
				<ul>
					<li><a href="#">My Account</a></li>
					<li><a href="#">Edit Account</a></li>
					<li><a href="#">Logout</a></li>
				</ul>
			</li>
		</ul>
	</div>
	
	<div class="ts-main-content">
		<nav class="ts-sidebar">
			<ul class="ts-sidebar-menu">
				<li class="ts-label">Main Menu</li>
				<li><a href="/"><i class="fa fa-desktop"></i> Dashboard</a></li>
				<li>
					<a href="/reports/main"><i class="fa fa-table"></i> Reports</a>
					<ul>
						<li><a href="/reports/api_manifest_audits">Manifest Audits</a></li>
						<li><a href="/reports/api_navigation_audits">Navigation Audits</a></li>
					</ul>
				</li>
				<li><a href="/scripts/main"><i class="fa fa-bolt"></i> Scripts</a></li>
				<li><a href="/scripts"><i class="fa fa-bell"></i> Alerts</a></li>
				<!-- class="open" -->

				<!-- Account from above -->
				<ul class="ts-profile-nav">
					<li><a href="#">Help</a></li>
					<li><a href="#">Settings</a></li>
					<li class="ts-account">
						<a href="#">Account <i class="fa fa-angle-down hidden-side"></i></a>
						<ul>
							<li><a href="#">My Account</a></li>
							<li><a href="#">Edit Account</a></li>
							<li><a href="#">Logout</a></li>
						</ul>
					</li>
				</ul>

			</ul>
		</nav>
		<div class="content-wrapper">
			<div class="container-fluid">

				<div class="row">
					<div class="col-md-12">
						<h2 class="page-title"><?php echo $title; ?></h2>
						<?php include_once './views/base/breadcrumbs.php' ?>