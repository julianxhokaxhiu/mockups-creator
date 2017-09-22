<!DOCTYPE html>
<html lang="en">
<head>
	<title>{{app.name}}</title>
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <meta charset="utf-8">
    <meta property="og:url" content="">
    <meta property="og:type" content="website">
    <meta property="og:title" content="">
    <meta property="og:image" content="">
    <meta property="og:description" content="">
    {% for href in app.cssFiles.screen %}
    <link href="{{ href }}" rel="stylesheet" media="screen">
    {% endfor %}
    <!-- Print Styles -->
    {% for href in app.cssFiles.print %}
    <link href="{{ href }}" rel="stylesheet" media="print">
    {% endfor %}
    {% block styles %}
    {% endblock %}
</head>
<body>
    {% block content %}
    {% endblock %}
    <!-- Scripts -->
    {% block scripts %}
    {% endblock %}
    <script src="//cdn.jsdelivr.net/npm/jquery@3"></script>
    <script src="//cdn.jsdelivr.net/npm/popper.js@1"></script>
    {% for href in app.jsFiles %}
    <script src="{{ href }}"></script>
    {% endfor %}
    {% if app.liveReloadHost %}
    <!-- Only for Development Server -->
    <script src="//{{ app.liveReloadHost }}/livereload.js"></script>
    {% endif %}
</body>
</html>