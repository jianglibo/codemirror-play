# there are multiple roles involved in the live-reloading.

each role do their own things, make it clear will help you understand the whole process.

It's simple.


## What do Nodemon do?

It restart the developing webserver when detecting changes in the filesystem.

## What do rollup do?

It will pack the scripts to one file. it can also watch the change and repack on realtime.

## What od node-livereload do?

It tells the browser to reload the webpage. How?
There's a script in the develop html page which connect to the livereload server, usually with a different port other than the page server.

```
<script>
  document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
  ':35729/livereload.js?snipver=1"></' + 'script>')
</script>
```

## How to solve peerDependencies

Follow the main library's dependencies.