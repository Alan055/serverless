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

<div>
    <label>手机号</label>
    <input type="text" id="inputPhone">
    <button class="submit">提交</button>
</div>
<div>
    <label>E-mail</label>
    <input type="text" id="inputEmail">
    <button class="submitEmail">提交</button>
</div>


<!--<img src="/image/icon.png" alt="">-->

{% include './footer.swig' %}


