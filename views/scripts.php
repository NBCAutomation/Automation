<?php include_once './views/base/header.php' ?>
	<div class="panel-body scripts-library">
	<?php if ($mainView) { ?>
		<h3>Script Library</h3>
		<ul>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/spire-run">spire-run.sh</a>
						<!-- <span class="script_version">V1.0</span> -->
					</div>
					<div class="panel-body">
						<span class="note">Bash script to run all automated test scripts.</span>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/apiCheck-manifest">apiCheck-manifest.js</a>
						<!-- <span class="script_version">V2.0</span> -->
					</div>
					<div class="panel-body">
						<span class="note">Case: Test API main manifest file to verify main key/values against the manifest dictionary files, to verify that the necessary values are present to allow the app to function correctly.</span>
					</div>
				</div>
			</li>
			<li>
				<div class="panel panel-default">
					<div class="panel-heading">
						<i class="fa fa-file" aria-hidden="true"></i> 
						<a href="/scripts/apiCheck-nav">apiCheck-nav.js</a>
						<!-- <span class="script_version">V2.0</span> -->
					</div>
					<div class="panel-body">
						<span class="note">Case: Grab the main app navigation urls from the manifest endpoint. Test each link for correct 200 response, if response is not an error, validate JSON. Some navigation endpoints return set as Text/HTML in the header, when this happens, the test may fail and provide a False/Postive, these items will need to be tested manually.</span>
					</div>
				</div>
			</li>
		</ul>
	<?php } ?>
	<?php if ($scriptView) { ?>
		<h3><?php echo $view ?></h3>

		<div class="panel panel-default">
			<div class="panel-heading">Configure Script</div>
			<div class="panel-body">
				<form method="post" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label">Run Suite
							<br>
						</label>
						<div class="col-sm-10">
							<div class="checkbox">
								<input id="checkbox1" type="checkbox">
								<label for="checkbox1">Default (ALL)</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label">Specific Sites
							<br>
						</label>
						<div class="col-sm-10">
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcnewyork">
								<label for="checkbox1">NBC New York</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbclosangeles">
								<label for="checkbox1">NBC Los Angeles</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcchicago">
								<label for="checkbox1">NBC Chicago</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcbayarea">
								<label for="checkbox1">NBC Bay Area</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcdfw">
								<label for="checkbox1">NBC DFW</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcmiami">
								<label for="checkbox1">NBC Miami</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcphiladelphia">
								<label for="checkbox1">NBC Philadelphia</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcconnecticut">
								<label for="checkbox1">NBC Connecticut</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcwashington">
								<label for="checkbox1">NBC Washington</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="nbcsandiego">
								<label for="checkbox1">NBC San Diego</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="necn">
								<label for="checkbox1">NECN</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundo40">
								<label for="checkbox1">Telemundo 40</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundo47">
								<label for="checkbox1">Telemundo 47</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundo51">
								<label for="checkbox1">Telemundo 51</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundo52">
								<label for="checkbox1">Telemundo 52</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundo62">
								<label for="checkbox1">Telemundo 62</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundoareadelabahia">
								<label for="checkbox1">Telemundo Area de la Bahia</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundoarizona">
								<label for="checkbox1">Telemundo Arizona</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundoboston">
								<label for="checkbox1">Telemundo Boston</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundochicago">
								<label for="checkbox1">Telemundo Chicago</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundodallas">
								<label for="checkbox1">Telemundo Dallas</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundodenver">
								<label for="checkbox1">Telemundo Denver</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundohouston">
								<label for="checkbox1">Telemundo Houston</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundolasvegas">
								<label for="checkbox1">Telemundo Las Vegas</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundosanantonio">
								<label for="checkbox1">Telemundo San Antonio</label>
							</div>
							<div class="checkbox">
								<input id="checkbox1" type="checkbox" name="test_site[]" value="telemundopr">
								<label for="checkbox1">Telemundo PR</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-8 col-sm-offset-2">
							<button class="btn btn-primary" type="submit">Run Script</button>
						</div>
					</div>
					<div class="hr-dashed"></div>
				</form>
			</div>
		</div>

		<!-- <div class="well">
			<p> </p>
		</div> -->

	<?php } ?>
	</div>
<?php include_once './views/base/footer.php' ?>