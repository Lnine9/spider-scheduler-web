## 部署前配置
.env.production 文件中配置后端接口地址

## 部署
```shell
yarn install
yarn build:prod
```
打包好文件,复制到nginx的html目录下 启动nginx即可

**nginx.conf**
```text
http {
   server {
        listen       80;

        server_name  localhost;

        root html;

        location / {
            try_files $uri $uri/ /index.html;	    
        }

    }
}
events {
  worker_connections  1024;  ## Default: 1024
}

```