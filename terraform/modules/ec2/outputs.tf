output "asg_name" {
  value = aws_autoscaling_group.polkadot_asg.name
}

output "ec2_sg_id" {
  value = aws_security_group.ec2_sg.id
}
