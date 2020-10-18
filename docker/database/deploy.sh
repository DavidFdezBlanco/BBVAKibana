#deploy on swarm
sudo docker stack rm database

sleep 15

sudo docker stack deploy --compose-file docker-compose.yml database