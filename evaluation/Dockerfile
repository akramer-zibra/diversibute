FROM jupyter/base-notebook:latest

USER root

# Install build essentials
RUN apt-get update && apt-get install -yq --no-install-recommends build-essential \
&& apt-get clean && rm -rf /var/lib/apt/lists/*

# Set node_modules path 
# @see https://github.com/n-riesco/ijavascript/issues/118#issuecomment-366075445
ENV NODE_PATH=/opt/conda/lib/node_modules

# Install Yarn
RUN npm install -g yarn

# Install ijavascript notebook
RUN yarn global add ijavascript --prefix /usr/local

# Install plotly in system scope
RUN pip install plotly numpy

# Change to base image user
USER $NB_UID

# Create a mount folder in home dir
RUN mkdir /home/$NB_USER/mount
VOLUME "/home/$NB_USER/mount"

# Install nodejs Kernel for jupyter
RUN ijsinstall