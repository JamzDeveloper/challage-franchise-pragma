## deploy
## files


```
mkdir lambda_build
cp -r dist/* lambda_build/
cp -r node_modules lambda_build/
cp package.json lambda_build/

```


```
terraform plan
terraform apply
```

```
find . -name '._*' -delete

```