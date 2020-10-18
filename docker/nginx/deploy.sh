#deploy on swarm
sudo docker stack rm api_nginx

sleep 15

sudo docker stack deploy --compose-file docker-compose.yml api_nginx
