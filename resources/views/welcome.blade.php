<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>QuizRoom</title>
        <link href="{{asset('css/normalize.css')}}" rel="stylesheet" type="text/css">
        <link href="{{asset('css/app.css')}}" rel="stylesheet" type="text/css">
        <link rel="icon" href="{{asset('img/icon.png')}}" type="image/png">
    </head>
    <body>
        <div id="root"></div>
        <script>window.asset_url="{{asset('img/')}}"</script>
        <script src="{{asset('js/app.js')}}" ></script>        
    </body>
</html>