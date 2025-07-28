FROM alpine:latest

RUN apk add --no-cache bash wget openssl pcre zlib linux-headers gcc g++ make

# Build nginx with rtmp module
ENV NGINX_VERSION=1.23.3
ENV NGINX_RTMP_VERSION=1.2.2

WORKDIR /tmp

RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
    && tar zxvf nginx-${NGINX_VERSION}.tar.gz \
    && wget https://github.com/arut/nginx-rtmp-module/archive/v${NGINX_RTMP_VERSION}.tar.gz \
    && tar zxvf v${NGINX_RTMP_VERSION}.tar.gz \
    && cd nginx-${NGINX_VERSION} \
    && ./configure --with-http_ssl_module --add-module=../nginx-rtmp-module-${NGINX_RTMP_VERSION} \
    && make \
    && make install

# Clean up to reduce image size
RUN rm -rf /tmp/*

# Forward logs to docker
RUN ln -sf /dev/stdout /usr/local/nginx/logs/access.log \
 && ln -sf /dev/stderr /usr/local/nginx/logs/error.log

# Copy our nginx config
COPY nginx.conf /usr/local/nginx/conf/nginx.conf

EXPOSE 1935 8080

CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
