variable "aws_region" {
  description = "Región AWS donde se despliega"
  type        = string
  default     = "us-east-1"
}

variable "lambda_function_name" {
  description = "Nombre de la Lambda"
  type        = string
  default     = "create-franchise"
}


variable "bucket_name" {
  type        = string
  default     = "franchise-lambdas-bucket"
  description = "bucket name of the lambda"
}



variable "db_username" {
  description = "MySQL master username"
  default     = "admin"
}

variable "db_password" {
  description = "MySQL master password"
  sensitive   = true
}

variable "db_name" {
  description = "Initial MySQL DB name"
  default     = "franchisedb"
}

variable "vpc_id" {
  description = "VPC ID where RDS will be deployed"
}

variable "db_host" {
  description = "host db"

}