output "api_url" {
  value = "https://${aws_api_gateway_rest_api.franchise_api.id}.execute-api.${var.aws_region}.amazonaws.com/prod/franchises"
}
