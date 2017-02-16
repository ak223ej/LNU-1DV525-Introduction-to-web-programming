---
layout: post
title:  "Humans.txt"
date:   2016-09-05 15:02:01 +0000
author: John Herrlin
excerpt_separator: <!--more-->
---

Humans are the users of internet, and internet is created for humans!

A `humans.txt` file is a file that lives in the web server root.
This file contains information about the people, techniques and other
things that is related to the project.

{% highlight text %}
"It's an initiative for knowing the people behind a website. 
It's a TXT file that contains information about the 
different people who have contributed to building the website."
/ http://humanstxt.org/
{% endhighlight %}

### Implementation

I have a file named `humans.txt` in the root folder of the server.
In the `<head>` tag i have added a row with the following info: `<link rel="author" href="humans.txt" />`.
I dont have any button for the link, the reason for this is that developers that have interest in the file
will look for it! I dont think normal users would like to know about it!

### Example

Example of a `humans.txt`

{% highlight text %}
/* TEAM */

Your title: Your name.
Site: email, link to a contact form, etc.
Twitter: your Twitter username.
Location: City, Country.
          
[...]

/* THANKS */
Name: name or url
[...]

/* SITE */
Last update: YYYY/MM/DD
Standards: HTML5, CSS3,..
Components: Modernizr, jQuery, etc.

Software: Software used for the development
{% endhighlight %}


<!--more-->