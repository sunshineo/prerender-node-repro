docker build -t prerender-node-repro .

docker run -it --rm -P \
--name www \
-e VIRTUAL_HOST=http://www.mydomain.com \
--add-host prerender.mydomain.com:192.168.99.100 \
prerender-node-repro



docker run -it --rm -p 80:80 \
--link www:www \
dockercloud/haproxy:1.4.2

