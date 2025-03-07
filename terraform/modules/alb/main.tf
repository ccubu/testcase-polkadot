resource "aws_lb" "polkadot_alb" {
  name               = "polkadot-api-lb"
  internal           = false
  load_balancer_type = "application"
  subnets           = [var.public_subnet_id_1, var.public_subnet_id_2]
  security_groups   = [aws_security_group.alb_sg.id]
}

resource "aws_lb_listener" "polkadot_listener" {
  load_balancer_arn = aws_lb.polkadot_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.polkadot_tg.arn
  }
}

resource "aws_lb_target_group" "polkadot_tg" {
  name     = "polkadot-api-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  target_type = "instance"
  
  health_check {
    path                = "/metrics"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_security_group" "alb_sg" {
  name_prefix = "polkadot-alb-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    security_groups = [var.sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


