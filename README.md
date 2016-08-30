# How to use this repo to reproduce https://github.com/prerender/prerender-node/issues/115

## git clone this repo
```
git clone https://github.com/sunshineo/prerender-node-repro
```

## Build the docker image needed
```
docker build -t prerender-node-repro .
```

## Start the dockers as below
```
docker run -it --rm -P \
--name www \
-e VIRTUAL_HOST=http://www.mydomain.com \
--add-host prerender.mydomain.com:192.168.99.100 \
prerender-node-repro
```

##Open another terminal and run
```
docker run -it --rm -p 80:80 \
--link www:www \
dockercloud/haproxy:1.4.2
```
Note: I'm using Mac and docker-machine, so 192.168.99.100 is my docker vm ip address. You can find out yours using `docker-machine env default`. If you are using Linux or native docker on Mac or Windows, that address should simply be 127.0.0.1 or localhost

## Edit your /etc/hosts file and add
```
192.168.99.100 www.mydomain.com
192.168.99.100 prerender.mydomain.com
```
Again, replace 192.168.99.100 with approperate ip address

## Hit the normal page
Open http://www.mydomain.com/ in browser or 
```
curl http://www.mydomain.com/
```
You should see
```
<h1>This is for try to repro duce the prerender-node bug.</h1>
```

## Hi the prerender
Open http://www.mydomain.com/?_escaped_fragment_= in browser or 
```
curl http://www.mydomain.com/?_escaped_fragment_=
```
You should see
```
<html><body><h1>400 Bad request</h1>
Your browser sent an invalid request.
</body></html>
```

# What is happening??
If you look at the log for the docker run, you will see that we are requesting
```
http://www.mydomain.com/http://www.mydomain.com/?_escaped_fragment_=
http://www.mydomain.com/http://www.mydomain.com/http://www.mydomain.com/?_escaped_fragment_=
http://www.mydomain.com/http://www.mydomain.com/http://www.mydomain.com/http://www.mydomain.com/?_escaped_fragment_=
... ...
```
Recursively until it dies.

The root cause is that the very first request is actually to http://prerender.mydomain.com/http://www.mydomain.com/?_escaped_fragment_= but with a header named 'host' with the value 'www.mydomain.com'
This results in haproxy routed it to the www server again, which see the _escaped_fragment and try to send a prerender request again ... ...
If this is working properly, we will see a 503 no service available because we did not have anything handle request for prerender.mydomain.com and haproxy should return that.



