// task utilits js
casper.test.begin('OTS SPIRE | Utils Task Runner', function suite() {
	var envConfig 	= casper.cli.get('env'),
		type 		= casper.cli.get('output'),
		task 		= casper.cli.get('task'),
		taskType 	= casper.cli.get('taskType'),
		taskRef 	= casper.cli.get('taskRef'),
		logNote 	= casper.cli.get('logNote');

	

	var spireTasker = function() {
		var suite = this;

			if (envConfig === 'local') {
			    var configURL = 'http://spire.local';
			} else if (envConfig === 'dev') {
			    var configURL = 'http://45.55.209.68';
			} else {
			    var configURL = 'http://54.243.53.242';
			}

		    if (type === 'debug') {
		        var debugOutput = true;
		    } else if (type === 'console') {
		        var showOutput = true;
		    }

		// casper.start(task).then(function(response) {
		casper.start( task, function(response) {
			if (task == 'sendAlert') {
				var utilsURL = configURL + '/utils/tasks';
				if (debugOutput) {
					console.log(utilsURL);
				}

				if (taskType == 'api-notification' || taskType == 'apiTestNotification') {
					var taskURL = utilsURL + '?task=' + task + '&notificationType=' + taskType + '&taskRef=' + taskRef;
					
					if (debugOutput) {
						console.log('taskURL: ' + taskURL);
					}
					
				    casper.thenOpen(taskURL, {method: 'get'}).then(function (resp) {
				        var status = this.status().currentHTTPStatus;

				        if ( status == 200) {
				        	console.log(resp.status);
				            console.log('alert sent');
				            console.log('taskURL: ' + taskURL);
				        } else {
				            console.log('not sent');
				            console.log(resp.status);
				            console.log('taskURL: ' + taskURL);
				        }
				    })
				} else {
					casper.thenOpen(utilsURL, {
					    method: 'post',
					    data:   {
					        'taskType': taskType,
					        'taskRef': taskRef,
					        'logNote': logNote
					    }
					});
				}
			}
		}).run(function () {
		    this.exit();
		});
	};
    new spireTasker(casper.cli.get('task'));
});

// casperjs test tasker.js --task=send_alert --type=regression-notification --taskRef=start --log