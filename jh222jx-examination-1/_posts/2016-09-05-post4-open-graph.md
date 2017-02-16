---
layout: post
title:  "Open Graph"
date:   2016-09-05 15:02:05 +0000
author: John Herrlin
excerpt_separator: <!--more-->
---

Open Graph is a protocol that helps social media to publish links to your site
in a good looking way.
You specify things like Title, Type, Url, Image.
This is done in the `<head>` section of the page.

### Implementation

{% highlight html %}
<meta property="og:title" content="➜ Welcome to my page!" />
<meta property="og:type" content="blog" />
<meta property="og:url" content="https://1dv525.github.io/jh222jx-examination-1/index.html" />
<meta property="og:image" content="https://1dv525.github.io/jh222jx-examination-1/images/me.jpg" />
{% endhighlight %}


<!--more-->