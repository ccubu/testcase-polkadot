module "vpc" {
  source = "./modules/vpc"

  vpc_cidr             = var.vpc_cidr
  public_subnet_1_cidr = var.public_subnet_1_cidr
  public_subnet_2_cidr = var.public_subnet_2_cidr
}

module "ec2" {
  source            = "./modules/ec2"
  ami_id            = var.ami_id
  instance_type     = var.instance_type
  docker_image      = var.docker_image
  vpc_id            = module.vpc.vpc_id
  public_subnet_id  = module.vpc.public_subnet_id_1
  key_name          = var.key_name
  target_group_arn  = module.alb.target_group_arn
}

module "alb" {
  source             = "./modules/alb"
  public_subnet_id_1 = module.vpc.public_subnet_id_1
  public_subnet_id_2 = module.vpc.public_subnet_id_2
  vpc_id             = module.vpc.vpc_id
  sg_id = module.ec2.ec2_sg_id
}
