<?php
	$urlPath = explode( '/', $viewPath );
	$breadcrumbPath;
	foreach ($urlPath as $key => $value) {
		if ($key > 0) {
			if ($value == end($urlPath)) {
				$breadcrumbPath .= '<li>'. $value .'</li>';
			} else {
				$breadcrumbPath .= '<li><a href=/reports/'. $urlPath[0] .'/'. $value .'/main>'. $value .'</a></li>';
			}
		} else {
			$breadcrumbPath .= '<li><a href=/reports/'. $urlPath[$key] .'>'. $value .'</a></li>';
		}
	}
?>
<div id="breadcrumbs">
	<ul>
		<li><a href="/"><i class="fa fa-home" aria-hidden="true"></i></a></li>
		<li><a href="/<?php echo $page_name; ?>/main"><?php echo $page_name; ?></a></li>
		<?php echo $breadcrumbPath; ?>
	</ul>
</div>