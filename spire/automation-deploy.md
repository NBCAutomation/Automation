# What?
This document describes the steps we took to deploy Deltrie's automation script, codename `Spire`.

You can access this instance from here: [http://54.243.53.242/](http://54.243.53.242/)

# Important Paths

For this document, `~ (tilde)` means `/home/ec2-user/`

Directory|What is it?
---------|----------
`~/automation-deploy`|Main directory containing all of `Spire`
`~/automation-deploy/src`|The source code for `Spire`
`~/automation-deploy/automation.git`|The git repository configuration files
`~/automation-deploy/logs`|Contains httpd `error.log` and `requests.log`
`~/automation-deploy/bin`|Contains `lockrun` for cronjob control
`/etc/httpd/sites-available/spire.conf`|httpd VirtualHost configuration

# Steps to deploy git repo
1. From `Super Feed Loader` create git instance in `~/automation-deploy/automation.git`

    ```bash
    cd ~/automation-deploy; git init --bare
    ```

2. Setup `~/automation-deploy/automation.git/hooks/post-receieve` to handle necessary post-processing when receiving `git push` from user.

    ```bash
    #!/bin/sh
    # FILE: ~/automation-deploy/automation.git/hooks/post-receieve
    
    git --work-tree=/home/ec2-user/automation-deploy/src --git-dir=/home/ec2-user/automation-deploy/automation.git checkout -f
    cd /home/ec2-user/automation-deploy/src;
    composer install
    cd /home/ec2-user/automation-deploy/src/html;
    npm install;
    ```

3. After above steps are complete, from `local` user runs this command while in the cloned repo folder:

    ```bash
    git remote add live ssh://ec2-user@54.243.53.242/home/ec2-user/automation-deploy/automation.git
    ```
    
4. User can now `git push` and the code will appear in `~/automation-deploy/src` folder. After the push event, the `post-receive` file will also execute `composer install` and `npm install` respectively.

# Steps to install LAMP
1. Install the following packages on `Super Feed Loader`

    ```bash
    sudo yum install php55 php55-mysqlnd # install httpd, php5.5, and php55-mysql module
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash # install NVM (Node Version Manager, to manage npm [node package manager])
    ```
    
2. Place appropriate configurations for httpd (see above for VirtualHost config path)

3. Create cronjob (run every 3 hours) with `crontab -e`

    ```bash
    * */3 * * * /home/ec2-user/automation-deploy/bin/lockrun --lockfile=/var/run/spire.lockrun -- bash /home/ec2-user/automation-deploy/src/html/spire-run.sh
    ```
    
# Important commands

1. Start httpd server with `service httpd start`
2. Restart httpd server `service httpd restart`
3. Stop httpd server with `service httpd stop`
4. Kill all npm instances with `pkill npm`
5. Kill all node instances with `pkill node`
6. Check for node / npm instances `ps aux | egrep "(node|npm)"`