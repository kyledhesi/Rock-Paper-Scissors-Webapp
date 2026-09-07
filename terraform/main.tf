terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# Create the S3 bucket with name 'my-rock-paper-scissors-webapp'
resource "aws_s3_bucket" "rock-paper-scissors-bucket" {
  bucket = var.bucket_name

  tags = {
    Name = "Rock Paper Scissors"
  }
}

# Configure S3 static website hosting with index file
resource "aws_s3_bucket_website_configuration" "website-config" {
  bucket = aws_s3_bucket.rock-paper-scissors-bucket.id

  index_document {
    suffix = "index.html"
  }
}

# Upload website files to S3 bucket
resource "aws_s3_object" "website_files" {
  for_each = local.website_files

  bucket = aws_s3_bucket.rock-paper-scissors-bucket.id
  key    = each.value
  source = "../${each.value}"

  etag = filemd5("../${each.value}")

  content_type = each.value == "index.html" ? "text/html" : (
    each.value == "styles.css" ? "text/css" : "application/javascript"
  )
}

# Creating origin access control for CloudFront to access the S3 bucket
resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "s3-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Create a CloudFront distribution to deliver website content through a CDN
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name              = aws_s3_bucket.rock-paper-scissors-bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = "s3_origin"
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3_origin"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Allow CloudFront to read objects from the S3 bucket
resource "aws_s3_bucket_policy" "website_policy" {
  bucket = aws_s3_bucket.rock-paper-scissors-bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.rock-paper-scissors-bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}