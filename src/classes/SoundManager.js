class Buffer {
  constructor(context, urls) {
    this.context = context;
    this.urls = urls;
    this.buffer = [];
    this.sounds = [];
    this.loaded = false;
  }

  loadSound(url, name, index, fx, fxGainNode) {
    let request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    let thisBuffer = this;
    request.onload = function () {
      thisBuffer.context.decodeAudioData(request.response, function (buffer) {
        thisBuffer.buffer[index] = buffer;
        thisBuffer.loadedSound(index, name, fx, fxGainNode);
        if (index == thisBuffer.urls.length - 1) {
          thisBuffer.loaded = true;
        }
      });
    };
    request.send();
  }

  loadAll(urls) {
    urls.forEach((url, index) => {
      this.loadSound(url.url, url.name, index, url.fx, url.fxGainNode);
    });
  }

  loadedSound(index, name, fx, fxGainNode) {
    this.sounds.push(new Sound(this.context, this.buffer[index], name, fx, fxGainNode));
  }

  getSoundByIndex(index) {
    return this.buffer[index];
  }

  getSoundByName(name) {
    return this.sounds.filter((sound) => sound.name === name)[0];
  }
}

class Sound {
  constructor(context, buffer, name, fx, fxGainNode) {
    this.context = context;
    this.buffer = buffer;
    this.name = name;
    this.fx = fx;
    this.fxGainNode = fxGainNode;
  }

  init() {
    if (this.fx === true) {
      this.gainNode = this.context.createGain();
      this.source = this.context.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.fxGainNode);
    } else {
      this.gainNode = this.context.createGain();
      this.source = this.context.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
    }
  }

  play(loop) {
    this.init();
    if (loop === true) {
      this.source.loop = true;
    }
    this.source.start(this.context.currentTime);
  }

  stop() {
    if (typeof this.gainNode !== 'undefined') {
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
      this.source.stop(this.context.currentTime + 0.5);
    }
  }
}

class SoundManager {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.fxGainNode = this.context.createGain();
    this.fxGainNode.connect(this.context.destination);
    this.sounds = [];
    this.sounds.push({
      name: 'bgmusic',
      url: '/sounds/music/gamebgmusic.mp3',
      fx: false,
      fxGainNode: null,
    });

    this.sounds.push({
      name: 'fx_bulldozer',
      url: '/sounds/fx/bulldozer.mp3',
      fx: true,
      fxGainNode: this.fxGainNode,
    });
    this.sounds.push({
      name: 'fx_levelup',
      url: '/sounds/fx/levelup.mp3',
      fx: true,
      fxGainNode: this.fxGainNode,
    });
    this.sounds.push({
      name: 'fx_placement',
      url: '/sounds/fx/placement.mp3',
      fx: true,
      fxGainNode: this.fxGainNode,
    });
    this.sounds.push({
      name: 'fx_uiclick',
      url: '/sounds/fx/uiclick.mp3',
      fx: true,
      fxGainNode: this.fxGainNode,
    });
    this.sounds.push({
      name: 'fx_cashregister',
      url: '/sounds/fx/cashregister.mp3',
      fx: true,
      fxGainNode: this.fxGainNode,
    });
    this.sounds.push({
      name: 'fx_error',
      url: '/sounds/fx/error.mp3',
      fx: true,
      fxGainNode: this.fxGainNode,
    });
    this.buffer = new Buffer(this.context, this.sounds);
    this.buffer.loadAll(this.sounds);
  }

  playSound(name, loop) {
    // get the buffer instance
    let sound = this.buffer.getSoundByName(name);
    sound.stop();
    sound.play(loop);
  }

  stopSound(name) {
    let sound = this.buffer.getSoundByName(name);
    sound.stop();
  }

  toggleMuteSound(name, mute) {
    let sound = this.buffer.getSoundByName(name);
    if (mute === true) {
      sound.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
    } else {
      sound.gainNode.gain.exponentialRampToValueAtTime(1, this.context.currentTime + 0.5);
    }
  }

  changeGainSound(name, level) {
    let sound = this.buffer.getSoundByName(name);
    let audioLevel = 0.001;
    if (level > 0.0) {
      audioLevel = level;
    }

    sound.gainNode.gain.exponentialRampToValueAtTime(audioLevel, this.context.currentTime + 0.5);
  }

  toggleMuteFx(mute) {
    if (mute === true) {
      this.fxGainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
    } else {
      this.fxGainNode.gain.exponentialRampToValueAtTime(1, this.context.currentTime + 0.5);
    }
  }

  changeGainFx(level) {
    let audioLevel = 0.001;
    if (level > 0.0) {
      audioLevel = level;
    }

    this.fxGainNode.gain.exponentialRampToValueAtTime(audioLevel, this.context.currentTime + 0.5);
  }
}

export default SoundManager;
