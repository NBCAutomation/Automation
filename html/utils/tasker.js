// task utilits js
casper.test.begin('OTS SPIRE | Utils Task Runner', function suite() {
	var envConfig 	= casper.cli.get('env');
	var type 		= casper.cli.get('output');
	var task 		= casper.cli.get('task');
	var taskType 	= casper.cli.get('taskType');
	var taskRef 	= casper.cli.get('taskRef');
	var logNote 	= casper.cli.get('logNote');

	if (envConfig === 'local') {
	    var configURL = 'http://spire.app';
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


	var spireTasker = function(task) {
		var suite = this;

		casper.start( task ).then(function(response) {
			suite.taskRun(task, taskType, taskRef, logNote);
		}).then(function () {

		}).run(function() {

		    this.exit();
		});
	};

	spireTasker.prototype.taskRun = function(task, taskType, taskRef, logNote) {
		if (task == 'send_alert') {
			var utilsURL = configURL + '/utils/send_alert';
			if (debugOutput) {
				console.log(utilsURL);
			}

			casper.open(utilsURL, {
			    method: 'post',
			    data:   {
			        'taskType': taskType,
			        'taskRef': taskRef,
			        'logNote': logNote
			    }
			});
		}
	};
    new spireTasker(casper.cli.get('task'));
});

// casperjs test tasker.js --task=send_alert --type=regression-notification --taskRef=start --log