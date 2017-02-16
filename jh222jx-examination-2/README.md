# jh222jx-examination-2
Examination 2 for John Herrlin, NS2015

## Setup

* V8 (Chromium or Google Chrome)


## Development

This seems to only work in linux systems!

```bash
docker build -t web .
docker run -it --rm --net host -v $PWD:/app web bash

when inside the container:
npm set progress=false && npm install
gulp
```