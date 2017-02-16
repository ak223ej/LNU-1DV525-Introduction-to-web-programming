---
layout: post
title:  "Robots.txt"
date:   2016-09-05 15:01:01 +0000
author: John Herrlin
excerpt_separator: <!--more-->
---

The internet is a big and hard place for an http server to live in.
Search engines,crawlers and users are hitting you all the time.
Some of the pages should not be visible for search engines,
if you as a little http server dont want some of your endpoints to
be indexed then you can specify a file called `robots.txt` and put
it in your web root.
Endpoints like login pages for example or other endpoints that you
dont want the big bad Google to index.

### Small example

We allow any type of User-Agent, but not on the `/login` endpoint.

{% highlight text %}
User-Agent: *
Disallow: /login
{% endhighlight %}

<!--more-->