provider "aws" {
  region = var.aws_region
}

# ZIP automático
data "archive_file" "lambda_zip_file" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda_build"
  output_path = "${path.module}/../function.zip"
}

# IAM Role
resource "aws_iam_role" "lambda_exec_role" {
  name = "create_franchise_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

# Logs Policy
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda Function create franchise
resource "aws_lambda_function" "create_franchise" {
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "handlers/createFranchise/index.handler"
  runtime       = "nodejs20.x"
  timeout       = 10

  filename         = data.archive_file.lambda_zip_file.output_path
  source_code_hash = data.archive_file.lambda_zip_file.output_base64sha256

  environment {
    variables = {
      DB_HOST     = var.db_host
      DB_USERNAME = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}


# Lambda function added  branch
resource "aws_lambda_function" "add_branch" {
  function_name = "add_branch_lambda"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "handlers/addBranch/index.handler"  # Asegúrate que esta sea la ruta correcta
  runtime       = "nodejs20.x"
  timeout       = 10

  filename         = data.archive_file.lambda_zip_file.output_path
  source_code_hash = data.archive_file.lambda_zip_file.output_base64sha256

   environment {
    variables = {
      DB_HOST     = var.db_host
      DB_USERNAME = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}

# Lambda function all franchises resource

resource "aws_lambda_function" "all_franchises" {
  function_name = "all_franchises_lambda"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "handlers/allFranchises/index.handler" 
  runtime       = "nodejs20.x"
  timeout       = 10

  filename         = data.archive_file.lambda_zip_file.output_path
  source_code_hash = data.archive_file.lambda_zip_file.output_base64sha256

  environment {
    variables = {
      DB_HOST     = var.db_host
      DB_USERNAME = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}



# Lambda function added  branch
resource "aws_lambda_function" "add_product_to_branch" {
  function_name = "add-product-to-branch"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "handlers/addProduct/index.handler"  # Asegúrate que esta sea la ruta correcta
  runtime       = "nodejs20.x"
  timeout       = 10

  filename         = data.archive_file.lambda_zip_file.output_path
  source_code_hash = data.archive_file.lambda_zip_file.output_base64sha256

   environment {
    variables = {
      DB_HOST     = var.db_host
      DB_USERNAME = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}

# Lambda function get  branch products
resource "aws_lambda_function" "list_product_to_branch" {
  function_name = "list-product-to-branch"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "handlers/allProductToBranch/index.handler"  # Asegúrate que esta sea la ruta correcta
  runtime       = "nodejs20.x"
  timeout       = 10

  filename         = data.archive_file.lambda_zip_file.output_path
  source_code_hash = data.archive_file.lambda_zip_file.output_base64sha256

   environment {
    variables = {
      DB_HOST     = var.db_host
      DB_USERNAME = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}
# Lambda function delete  branch
resource "aws_lambda_function" "delete_product_to_branch" {
  function_name = "delete-product-to-branch"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "handlers/deleteProduct/index.handler"  # Asegúrate que esta sea la ruta correcta
  runtime       = "nodejs20.x"
  timeout       = 10

  filename         = data.archive_file.lambda_zip_file.output_path
  source_code_hash = data.archive_file.lambda_zip_file.output_base64sha256

   environment {
    variables = {
      DB_HOST     = var.db_host
      DB_USERNAME = var.db_username
      DB_PASSWORD = var.db_password
      DB_NAME     = var.db_name
    }
  }
}


##
# REST API Gateway
resource "aws_api_gateway_rest_api" "franchise_api" {
  name        = "franchise-api"
  description = "API REST for franchise management"
}

# Resource: /franchises
resource "aws_api_gateway_resource" "franchises" {
  rest_api_id = aws_api_gateway_rest_api.franchise_api.id
  parent_id   = aws_api_gateway_rest_api.franchise_api.root_resource_id
  path_part   = "franchises"
}

# Method: POST /franchises
resource "aws_api_gateway_method" "post_franchises" {
  rest_api_id   = aws_api_gateway_rest_api.franchise_api.id
  resource_id   = aws_api_gateway_resource.franchises.id
  http_method   = "POST"
  authorization = "NONE"
}


# Integration Lambda proxy
resource "aws_api_gateway_integration" "lambda_post_franchises" {
  rest_api_id             = aws_api_gateway_rest_api.franchise_api.id
  resource_id             = aws_api_gateway_resource.franchises.id
  http_method             = aws_api_gateway_method.post_franchises.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.create_franchise.invoke_arn
}


# Resource: /franchises/{franchiseId}
resource "aws_api_gateway_resource" "franchise_id" {
  rest_api_id = aws_api_gateway_rest_api.franchise_api.id
  parent_id   = aws_api_gateway_resource.franchises.id
  path_part   = "{franchiseId}"
}


# Resource: /franchises/{franchiseId}/branches
resource "aws_api_gateway_resource" "branches" {
  rest_api_id = aws_api_gateway_rest_api.franchise_api.id
  parent_id   = aws_api_gateway_resource.franchise_id.id
  path_part   = "branches"
}

# POST /franchises/{franchiseId}/branches method
resource "aws_api_gateway_method" "post_branches" {
  rest_api_id   = aws_api_gateway_rest_api.franchise_api.id
  resource_id   = aws_api_gateway_resource.branches.id
  http_method   = "POST"
  authorization = "NONE"
}

# Crear recurso raíz /branch
resource "aws_api_gateway_resource" "branch_root" {
  rest_api_id = aws_api_gateway_rest_api.franchise_api.id
  parent_id   = aws_api_gateway_rest_api.franchise_api.root_resource_id
  path_part   = "branches"
}

resource "aws_api_gateway_resource" "branch_id" {
  rest_api_id = aws_api_gateway_rest_api.franchise_api.id
  parent_id   = aws_api_gateway_resource.branch_root.id
  path_part   = "{branchId}"  # Aquí defines el parámetro path
}

# Crear recurso /branch/product
resource "aws_api_gateway_resource" "branch_product" {
  rest_api_id = aws_api_gateway_rest_api.franchise_api.id
  parent_id   = aws_api_gateway_resource.branch_id.id
  path_part   = "products"
}

# Método GET para /branch/product
resource "aws_api_gateway_method" "get_branch_product" {
  rest_api_id   = aws_api_gateway_rest_api.franchise_api.id
  resource_id   = aws_api_gateway_resource.branch_product.id
  http_method   = "GET"
  authorization = "NONE"
  request_parameters = {
    "method.request.path.branchId" = true
  }
}

# Integración Lambda para POST /branch/product
resource "aws_api_gateway_integration" "lambda_get_branch_product" {
  rest_api_id             = aws_api_gateway_rest_api.franchise_api.id
  resource_id             = aws_api_gateway_resource.branch_product.id
  http_method             = aws_api_gateway_method.get_branch_product.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.list_product_to_branch.invoke_arn
}


# Permiso Lambda para API Gateway
resource "aws_lambda_permission" "allow_apigw_get_product_to_branch" {
  statement_id  = "AllowAPIGatewayInvokeAddProductToBranch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_product_to_branch.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.franchise_api.execution_arn}/*/*"
}



# Método POST para /branch/product
resource "aws_api_gateway_method" "post_branch_product" {
  rest_api_id   = aws_api_gateway_rest_api.franchise_api.id
  resource_id   = aws_api_gateway_resource.branch_product.id
  http_method   = "POST"
  authorization = "NONE"
}

# Integración Lambda para POST /branch/product
resource "aws_api_gateway_integration" "lambda_post_branch_product" {
  rest_api_id             = aws_api_gateway_rest_api.franchise_api.id
  resource_id             = aws_api_gateway_resource.branch_product.id
  http_method             = aws_api_gateway_method.post_branch_product.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.add_product_to_branch.invoke_arn
}

# Permiso Lambda para API Gateway
resource "aws_lambda_permission" "allow_apigw_add_product_to_branch" {
  statement_id  = "AllowAPIGatewayInvokeAddProductToBranch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_product_to_branch.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.franchise_api.execution_arn}/*/*"
}


# Integration for POST /franchises/{franchiseId}/branches -> add_branch lambda
resource "aws_api_gateway_integration" "lambda_post_branches" {
  rest_api_id             = aws_api_gateway_rest_api.franchise_api.id
  resource_id             = aws_api_gateway_resource.branches.id
  http_method             = aws_api_gateway_method.post_branches.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.add_branch.invoke_arn
}

# Lambda permissions for create_franchise
resource "aws_lambda_permission" "allow_apigw_create_franchise" {
  statement_id  = "AllowAPIGatewayInvokeCreateFranchise"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_franchise.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.franchise_api.execution_arn}/*/*"
}

# Lambda permissions for add_branch
resource "aws_lambda_permission" "allow_apigw_add_branch" {
  statement_id  = "AllowAPIGatewayInvokeAddBranch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_branch.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.franchise_api.execution_arn}/*/*"
}

## lambda allFranchises

resource "aws_api_gateway_method" "get_franchises" {
  rest_api_id   = aws_api_gateway_rest_api.franchise_api.id
  resource_id   = aws_api_gateway_resource.franchises.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_get_franchises" {
  rest_api_id             = aws_api_gateway_rest_api.franchise_api.id
  resource_id             = aws_api_gateway_resource.franchises.id
  http_method             = aws_api_gateway_method.get_franchises.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.all_franchises.invoke_arn
}

resource "aws_lambda_permission" "allow_apigw_get_franchises" {
  statement_id  = "AllowAPIGatewayInvokeGetFranchises"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.all_franchises.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.franchise_api.execution_arn}/*/*"
}

resource "aws_api_gateway_resource" "delete_route_product_id" {
  rest_api_id = aws_api_gateway_rest_api.franchise_api.id
  parent_id   = aws_api_gateway_resource.branch_product.id
  path_part   = "{productId}"  # Aquí defines el parámetro path
}


# Método DELETE para /branch/{branchId}/product/{productId}
resource "aws_api_gateway_method" "delete_branch_product" {
  rest_api_id   = aws_api_gateway_rest_api.franchise_api.id
  resource_id   = aws_api_gateway_resource.delete_route_product_id.id
  http_method   = "DELETE"
  authorization = "NONE"
}

# Integración Lambda para DELETE  /branch/{branchId}/product/{productId}
resource "aws_api_gateway_integration" "lambda_delete_branch_product" {
  rest_api_id             = aws_api_gateway_rest_api.franchise_api.id
  resource_id             = aws_api_gateway_resource.delete_route_product_id.id
  http_method             = aws_api_gateway_method.delete_branch_product.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.delete_product_to_branch.invoke_arn
}

# Permiso Lambda para API Gateway
resource "aws_lambda_permission" "allow_apigw_delete_product_to_branch" {
 statement_id  = "AllowAPIGatewayInvokeDeleteProductToBranch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_product_to_branch.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.franchise_api.execution_arn}/*/*"
  }




# Deployment and stage
resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [

  aws_api_gateway_method.post_franchises,
  aws_api_gateway_integration.lambda_post_franchises,

  aws_api_gateway_method.post_branches,
  aws_api_gateway_integration.lambda_post_branches,

  aws_api_gateway_method.get_franchises,
  aws_api_gateway_integration.lambda_get_franchises,

  aws_api_gateway_method.post_branch_product,
  aws_api_gateway_integration.lambda_post_branch_product,

  aws_api_gateway_method.delete_branch_product,
  aws_api_gateway_integration.lambda_delete_branch_product,

  aws_api_gateway_method.get_branch_product,
  aws_api_gateway_integration.lambda_get_branch_product

  ]

  rest_api_id = aws_api_gateway_rest_api.franchise_api.id

  triggers = {
    redeployment = sha1(jsonencode({
      methods = [
        aws_api_gateway_method.post_franchises.http_method,
        aws_api_gateway_method.post_branches.http_method,
        aws_api_gateway_method.get_franchises.http_method,
        aws_api_gateway_method.post_branch_product.http_method,
        aws_api_gateway_method.delete_branch_product.http_method,
        aws_api_gateway_method.get_branch_product.http_method,

      ],
      # integrations = [
      #   aws_api_gateway_integration.lambda_post_franchises.id,
      #   aws_api_gateway_integration.lambda_post_branches.id,
      #   aws_api_gateway_integration.lambda_get_franchises.id,
      #   aws_api_gateway_integration.lambda_post_branch_product.id,
      #   aws_api_gateway_integration.lambda_delete_branch_product.id,
      # ]
    }))
  }
  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_api_gateway_stage" "prod" {
  rest_api_id = aws_api_gateway_rest_api.franchise_api.id
  deployment_id = aws_api_gateway_deployment.deployment.id
  stage_name = "prod"
}



## config database

resource "aws_db_instance" "mysql_db" {
  identifier           = "franchise-mysql-db"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp2"
  username             = var.db_username
  password             = var.db_password
  db_name              = var.db_name
  publicly_accessible  = true
  skip_final_snapshot  = true
  deletion_protection  = false
  backup_retention_period = 0

  # Para ambientes de prueba
  vpc_security_group_ids = [aws_security_group.mysql_sg.id]
}

# Security Group para permitir acceso externo (ej. desde Lambda o localmente)
resource "aws_security_group" "mysql_sg" {
  name        = "mysql-access-sg"
  description = "Allow MySQL access"
  vpc_id      = var.vpc_id  # Este lo debes definir o crear una VPC

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # ⚠️ Solo para desarrollo. Usa IPs seguras en producción.
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
