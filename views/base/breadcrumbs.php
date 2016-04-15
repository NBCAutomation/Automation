<?php
	$urlPath = explode( '/', $viewPath );
	$__endItem = end($urlPath);

	$breadcrumbPath;
	if (sizeof($urlPath) > 1) {
		$baseView = $urlPath[0];
	}

	foreach ($urlPath as $key => $value) {
			// echo $key." >> ".$value;
		if ($key > 0) {
			if ($value == $__endItem) {
				$breadcrumbPath .= '<li>'. $value .'</li>';
			} else {
				$urlPath = $page_name.'/'.$urlPath[0].'/'.$value.'/main';
				$breadcrumbPath .= '<li><a href=/'.$urlPath.'>'. $value .'</a></li>';
			}
		} else {
			$breadcrumbPath .= '<li><a href=/'.$page_name.'/'.$value.'>'. $value .'</a></li>';
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
