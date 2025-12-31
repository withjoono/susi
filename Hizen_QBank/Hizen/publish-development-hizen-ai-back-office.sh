cd apps/hizen-ai-back-office

npm run build

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export AWS_REGION=ap-northeast-2

aws s3 rm s3://hizen-ai-fe-backoffice --recursive
aws s3 cp dist s3://hizen-ai-fe-backoffice --recursive

aws cloudfront create-invalidation --distribution-id E15QNXZRH5GND2 --paths "/*"
