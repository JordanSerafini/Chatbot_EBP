FROM postgres:15-bookworm

COPY ./sli.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432

CMD ["postgres"]