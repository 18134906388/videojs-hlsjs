# videojs-hlsjs

Video.js tech to use [streamedian.js] for RTSP playback using MSE instead of Flash.

Check out the streamedian.js docs for details on its capabilities, browser support etc.


## Installation

```sh
npm install
```

## Usage

You need to include [streamedian.js] itself.

```html
<!-- Video.js -->
<link href="//path/to/video-js.css" rel="stylesheet">
<script src="//path/to/video.min.js"></script>
<!-- streamedian.js -->
<script src="//path/to/streamedian.min.js"></script>
<!-- videojs-hlsjs -->
<script src="//path/to/videojs-hlsjs.min.js"></script>
<video id="videojs-hlsjs-player" class="video-js vjs-default-skin" controls>
  <source src="movie.streamedian" type='video/x-rtsp'>
</video>
<script>
  // For v5 the tech must be added to the tech order.
  // For v6 this is not needed.
  videojs('videojs-hlsjs-player', {
    techOrder: ['html5', 'streamedianjs'],
    streamedianjs: {
      mediaDataSource: {
        isLive: true,
        cors: true,
        withCredentials: false,
      },
      // config: {},
    },
  });
</script>
```

## License

Apache-2.0. Copyright (c) mister-ben

[videojs]: http://videojs.com/
