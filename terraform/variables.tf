variable "bucket_name" {
  type    = string
  default = "my-rock-paper-scissors-webapp"
}

locals {
  website_files = toset([
    "index.html",
    "styles.css",
    "index.js"
  ])
}