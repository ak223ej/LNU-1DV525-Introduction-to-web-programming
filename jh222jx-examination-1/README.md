# jh222jx-examination-1
Examination 1 for John Herrlin, NS2015

https://1dv525.github.io/jh222jx-examination-1/

## Development env instructions

* Install Docker

```bash
docker pull jekyll/jekyll
docker run -it --rm -v $PWD:/app -p 4000:4000 jekyll/jekyll bash
cd /app
jekyll serve --baseurl ""
```