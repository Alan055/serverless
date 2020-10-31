<!doctype html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
    <link rel="shortcut icon" href="/image/icon.png" type="image/x-icon">
</head>
<body>
{% include './header.swig' %}

{% for key,val in list %}
<p>{{val.label}}</p>
{% endfor%}

<!--<img src="/image/icon.png" alt="">-->

{% include './footer.swig' %}


