output "load_balancer_dns" {
  value = aws_lb.polkadot_alb.dns_name
}

output "alb_security_group_id" {
  value = aws_security_group.alb_sg.id
}

output "target_group_arn" {
  value = aws_lb_target_group.polkadot_tg.arn
}