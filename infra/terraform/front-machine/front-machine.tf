# ---------------------------------------------------------------------------------------------------------------------
# PIN TERRAFORM VERSION TO >= 0.12
# The examples have been upgraded to 0.12 syntax
# ---------------------------------------------------------------------------------------------------------------------

terraform {
  required_version = ">= 0.12"
}

# ---------------------------------------------------------------------------------------------------------------------
# DEPLOY AN EC2 INSTANCE THAT ALLOWS CONNECTIONS VIA SSH
# ---------------------------------------------------------------------------------------------------------------------

provider "aws"{
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
  region = var.aws_region
}


# ---------------------------------------------------------------------------------------------------------------------
# Find the elastic ip to associate
# ---------------------------------------------------------------------------------------------------------------------
# CREAR EIP STATIC

data "aws_eip" "static_front_ip_pre_prod" {
  filter {
    name   = "tag:machine_type"
    values = ["front_machine"]
  }
  filter {
    name   = "tag:env"
    values = [var.env]
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# DEPLOY THE EC2 INSTANCE WITH A PUBLIC IP
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_instance" "front_machine" {
  ami           = var.vm_ami
  instance_type = var.instance_type
  availability_zone = var.aws_availability_zone

  key_name = "davidWND"

  user_data = "${file("basic_config.sh")}"

  monitoring= false
  vpc_security_group_ids = [aws_security_group.production_security_group.id]

  tags = {
    Name = var.instance_name
    Env = var.env
  }
}

resource "aws_eip_association" "eip_assoc_swarm_leader" {
  instance_id   = "${aws_instance.front_machine.id}"
  allocation_id = "${data.aws_eip.static_front_ip_pre_prod.id}"
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A SECURITY GROUP TO CONTROL WHAT REQUESTS CAN GO IN AND OUT OF THE EC2 INSTANCE
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_security_group" "production_security_group" {
  name = var.frontend_security_group_name

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = var.ssh_port
    to_port   = var.ssh_port
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = var.nginx_port
    to_port   = var.nginx_port
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
