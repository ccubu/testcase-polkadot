output "load_balancer_dns" {
  description = "DNS Load Balancer"
  value       = module.alb.load_balancer_dns
}

output "alb_security_group_id" {
  description = "Load Balancer Security Group ID"
  value       = module.alb.alb_security_group_id
}

output "target_group_arn" {
  description = "Load Balancer Target Group Arn"
  value       = module.alb.target_group_arn
}

output "ec2_asg_name" {
  description = "Auto Scaling Group name"
  value       = module.ec2.asg_name
}

output "ec2_security_group_id" {
  description = "EC2 Security group ID"
  value       = module.ec2.ec2_sg_id
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_1" {
  description = "Public subnet 1 ID"
  value       = module.vpc.public_subnet_id_1
}

output "public_subnet_2" {
  description = "Public subnet 2 ID"
  value       = module.vpc.public_subnet_id_2
}
