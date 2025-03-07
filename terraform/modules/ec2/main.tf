resource "aws_launch_template" "polkadot_template" {
  name_prefix   = "polkadot-api-template"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.ec2_sg.id]
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -ex

    sudo yum update -y
    sudo amazon-linux-extras enable docker
    sudo yum install -y docker

    sudo systemctl start docker
    sudo systemctl enable docker

    sudo usermod -aG docker ec2-user

    sudo docker run -d --restart always -p 3000:3000 ${var.docker_image}

    echo "Docker installation finished" > /var/log/user-data.log
  EOF
  )
}

resource "aws_autoscaling_group" "polkadot_asg" {
  desired_capacity     = 2
  min_size            = 2
  max_size            = 5
  vpc_zone_identifier = [var.public_subnet_id]

  launch_template {
    id      = aws_launch_template.polkadot_template.id
    version = "$Latest"
  }

  health_check_type         = "EC2"
  health_check_grace_period = 300

  target_group_arns = [var.target_group_arn]
}

resource "aws_security_group" "ec2_sg" {
  name_prefix = "polkadot-ec2-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "polkadot-ec2-sg"
  }
}
