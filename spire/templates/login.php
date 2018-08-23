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
					<li><a href="#">My Account</a></li>
					<li><a href="#">Edit Account</a></li>
					<li><a href="/logout">Logout</a></li>
				</ul>
			</li>
			<?php } else { ?>
				<li><a href="/login/main">Login</a></li>
			<?php } ?>
		</ul>
	</div>
	
	<div class="ts-main-content">
		<div class="content-wrapper">
			<div class="container-fluid">

				<div class="row">
					<div class="col-md-12">
						<?php if ($mainView) { ?>
							<div class="row">
								<div class="col-md-6 col-md-offset-3">
									<div class="well row pt-2x pb-3x bk-light">
										<div class="col-md-8 col-md-offset-2">
											<div>
												<h2 class="page-title"><?php echo $title; ?></h2>
											</div>
											<?php if($messages){ ?>
												<div class="alert alert-dismissible alert-danger">
													<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
													<h4>Warning!</h4>
													<p>Best check yo self; <?php echo $messages; ?>.</p>
												</div>
											<?php } ?>
											<form action="/login/main" method="post" id="main_entry_form" class="mt">
												<div class="form_field">
													<label class="text-uppercase text-sm">Email:</label>
													<input type="input" name="email" size="35" id="email" class="form-control mb" />
													<div class="clear"></div>
												</div>
												<div class="form_field">
													<label class="text-uppercase text-sm">Password:</label>
													<input type="password" name="password" size="35" id="password" class="form-control mb" />
													<div class="clear"></div>
												</div>
												<div class="clear"></div>
												<div id="input_buttons">
													<input type="hidden" value="login" name="method" />
													<input type="hidden" value="true" name="submitted" />
													<!--<input type="submit" value="Submit" name="submit" class="submit_button" />-->
													<button class="btn btn-primary btn-block" type="submit" value="Submit" name="submit">Login</button>
												</div>
											</form>
										</div>
									</div>
									<div class="text-center">
										<a href="#">Forgot password?</a>
									</div>
								</div>
							</div>
						<?php } ?>
						<!-- Forgot password view -->
						<?php if ($passResetView) { ?>
							<div class="row">
								<div class="col-md-6 col-md-offset-3">
									<div class="well row pt-2x pb-3x bk-light">
										<div class="col-md-8 col-md-offset-2">
											<div>
												<h2 class="page-title"><?php echo $title; ?></h2>
											</div>
											<?php if($messages){ ?>
												<div class="alert alert-dismissible alert-danger">
													<button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>
													<h4>Warning!</h4>
													<p>Best check yo self; <?php echo $messages; ?>.</p>
												</div>
											<?php } ?>
											<form action="/login/main" method="post" id="main_entry_form" class="mt">
												<div class="form_field">
													<label class="text-uppercase text-sm">Email:</label>
													<input type="input" name="email" size="35" id="email" class="form-control mb" />
													<div class="clear"></div>
												</div>
												<div class="clear"></div>
												<div id="input_buttons">
													<input type="hidden" value="forgot" name="method" />
													<input type="hidden" value="true" name="submitted" />
													<!--<input type="submit" value="Submit" name="submit" class="submit_button" />-->
													<button class="btn btn-primary btn-block" type="submit" value="Submit" name="submit">Submit</button>
												</div>
											</form>
										</div>
									</div>
									<div class="text-center">
										<a href="#">Forgot password?</a>
									</div>
								</div>
							</div>
						<?php } ?>
						<!-- // Forgot password view -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Loading Scripts -->
	<script src="/assets/js/bootstrap-select.min.js"></script>
	<script src="/assets/js/bootstrap.min.js"></script>
	<script src="/assets/js/jquery.dataTables.min.js"></script>
	<script src="/assets/js/dataTables.bootstrap.min.js"></script>
	<script src="/assets/js/Chart.min.js"></script>
	<script src="/assets/js/fileinput.js"></script>
	<script src="/assets/js/chartData.js"></script>
	<script src="/assets/js/main.js"></script>
</body>
</html>