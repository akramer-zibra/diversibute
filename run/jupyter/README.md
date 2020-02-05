`Dockerfile` defines a docker image with nodejs kernel for jupyter notebook.
This image's base is 'base-notebook' from jupyter/docker-stacks.

## Docker container run
This command creates a new jupyter container with port forwarding and project directory mount
`docker run -p 8888:8888 -v C:/....:/home/jovyan/mount jupyter-nodejs-kernel:0.0.6`

## Docker container terminal connection
`docker exec -ti <container-id> bash`