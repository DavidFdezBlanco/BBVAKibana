#!/usr/bin/env bash
#yum update to be able to install new packages
sudo yum update -y

#Git installation
sudo yum install git -y

#Docker install
sudo yum install docker -y
sudo service docker start

#Docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-`uname -s`-`uname -m` | sudo tee /usr/local/bin/docker-compose > /dev/null
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

#Install psql
sudo yum install postgresql92 -y

#Clone github repository
cd home/ec2-user/
git clone https://github.com/DavidMainAccount/BBVAKibana.git

cd BBVAKibana/docker/database
FILENAME="token.txt"
sudo docker swarm init --advertise-addr 127.0.0.1 > $FILENAME
sudo chmod a+x deploy.sh
./deploy.sh

#Allow password login
#Set new password
echo "ec2-user:password" | chpasswd

#Allow password authentication
sed -i 's/^PasswordAuthentication no$/PasswordAuthentication yes/g' /etc/ssh/sshd_config

# Bounce the service to apply the config change
service ssh restart
service sshd restart
