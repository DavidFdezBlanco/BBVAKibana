  
# ---------------------------------------------------------------------------------------------------------------------
# ENVIRONMENT VARIABLES
# Define these secrets as environment variables
# ---------------------------------------------------------------------------------------------------------------------

variable "AWS_ACCESS_KEY_ID" {
  description = "AWS access ID"
  type        = string
  default = "AKIAUYY4GUNV5XKL7IXI"
}

variable "AWS_SECRET_ACCESS_KEY" {
  description = "AWS access key password"
  type        = string
  default = "SY0YkhgIiYkAOMhpf8TpR9y/hqmSt/12HTa137pg"
}

# ---------------------------------------------------------------------------------------------------------------------
# REQUIRED PARAMETERS
# You must provide a value for each of these parameters.
# ---------------------------------------------------------------------------------------------------------------------

variable "vm_ami"{
  description = "Amazon Machine Image type, includes docker and postgre already"
  default = "ami-027cab9a7bf0155df"
}

# ---------------------------------------------------------------------------------------------------------------------
# OPTIONAL PARAMETERS
# These parameters have reasonable defaults.
# ---------------------------------------------------------------------------------------------------------------------

variable "aws_region" {
  description = "The AWS region to deploy into"
  type        = string
  default     = "us-east-2"
}

variable "aws_availability_zone" {
  description = "The AWS availability_zone to deploy into"
  type        = string
  default     = "us-east-2b"
}

variable "instance_name" {
  description = "The Name tag to set for the EC2 Instance."
  type        = string
  default     = "api-machine"
}

variable "instance_type" {
  description = "Kind of machine and size"
  type = string
  default = "t2.micro"
}

variable "ssh_port" {
  description = "The port the EC2 Instance should listen on for SSH requests."
  default     = 22
}

variable "api_port" {
  description = "The port the EC2 Instance should listen on for SSH requests."
  default     = 3000
}

variable "backend_security_group_name" {
  description = "The port the EC2 Instance should listen on for jenkins requests."
  type        = string
  default     = "api_security_group"
}

variable "env" {
  description = "Environment."
  type        = string
  default     = "hackathon-dev-env"
}
