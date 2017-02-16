# jh222jx-examination-3
Examination 3 for John Herrlin, NS2015

## Install and start dev env

```bash
docker build -t web .
docker run -it --rm --net host -v $PWD:/app web bash

when inside the container:
npm set progress=false && npm install
gulp
```

## Run tests

```bash
npm t
```