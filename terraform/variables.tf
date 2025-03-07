variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  description = "CIDR block for the public subnet 1"
  type        = string
  default     = "10.0.5.0/24"
}

variable "public_subnet_2_cidr" {
  description = "CIDR block for the public subnet 2"
  type        = string
  default     = "10.0.4.0/24"
}

variable "ami_id" {
  description = "Amazon Machine Image (AMI) ID for EC2 instances"
  type        = string
  default     = "ami-00caa7df15d2e771f"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "docker_image" {
  description = "Docker image for the Polkadot API"
  type        = string
  default     = "christiancb/testcase-polkadot-api:test2"
}

variable "key_name" {
  description = "The name of the key pair for SSH access"
  type        = string
  default = "christian-mac"
}