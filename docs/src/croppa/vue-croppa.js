/*
 * vue-croppa v0.3.5
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2017 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {
  'use strict';

  function drawImage(img, orientation, x, y, width, height) {
    if (!/^[1-8]$/.test(orientation)) throw new Error('orientation should be [1-8]');

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (width == null) width = img.width;
    if (height == null) height = img.height;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    switch (+orientation) {
      // 1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
      case 1:
          break;

      // 2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
      case 2:
         ctx.translate(width, 0);
         ctx.scale(-1, 1);
         break;

      // 3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
      case 3:
          ctx.translate(width, height);
          ctx.rotate(180 / 180 * Math.PI);
          break;

      // 4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
      case 4:
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;

      // 5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
      case 5:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.scale(1, -1);
          break;

      // 6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
      case 6:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.translate(0, -height);
          break;

      // 7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
      case 7:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(270 / 180 * Math.PI);
          ctx.translate(-width, height);
          ctx.scale(1, -1);
          break;

      // 8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
      case 8:
          canvas.width = height;
          canvas.height = width;
          ctx.translate(0, width);
          ctx.rotate(270 / 180 * Math.PI);
          break;
    }

    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    return canvas;
  }

  return {
    drawImage: drawImage
  };
}));
});

var u = {
  onePointCoord: function onePointCoord(point, vm) {
    var canvas = vm.canvas,
        quality = vm.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = point.clientX;
    var clientY = point.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    };
  },
  getPointerCoords: function getPointerCoords(evt, vm) {
    var pointer = void 0;
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0];
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0];
    } else {
      pointer = evt;
    }
    return this.onePointCoord(pointer, vm);
  },
  getPinchDistance: function getPinchDistance(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
  },
  getPinchCenterCoord: function getPinchCenterCoord(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    };
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall;
          callback(arg);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  },
  toBlobPolyfill: function toBlobPolyfill() {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return;
    var binStr, len, arr;
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          len = binStr.length;
          arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        }
      });
    }
  },
  eventHasFile: function eventHasFile(evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer;
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true;
        }
      }
    }

    return false;
  },
  getFileOrientation: function getFileOrientation(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength;
    var offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
    }
    return -1;
  },
  base64ToArrayBuffer: function base64ToArrayBuffer(base64) {
    base64 = base64.replace(/^data:([^;]+);base64,/gmi, '');
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  getRotatedImage: function getRotatedImage(img, orientation) {
    var _canvas = index.drawImage(img, orientation);
    var _img = new Image();
    _img.src = _canvas.toDataURL();
    return _img;
  },
  flipX: function flipX(ori) {
    if (ori % 2 == 0) {
      return ori - 1;
    }

    return ori + 1;
  },
  flipY: function flipY(ori) {
    var map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    };

    return map[ori];
  },
  rotate90: function rotate90(ori) {
    var map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    };

    return map[ori];
  },
  numberValid: function numberValid(n) {
    return typeof n === 'number' && !isNaN(n);
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var initialImageType = String;
if (window && window.HTMLImageElement) {
  initialImageType = [String, HTMLImageElement];
}

var props = {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  placeholder: {
    type: String,
    default: 'Choose an image'
  },
  placeholderColor: {
    default: '#606060'
  },
  placeholderFontSize: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  canvasColor: {
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return Number.isInteger(val) && val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.tiff'
  },
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  disableRotation: Boolean,
  reverseScrollToZoom: Boolean,
  preventWhiteSpace: Boolean,
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  removeButtonColor: {
    type: String,
    default: 'red'
  },
  removeButtonSize: {
    type: Number
  },
  initialImage: initialImageType,
  initialSize: {
    type: String,
    default: 'cover',
    validator: function validator(val) {
      return val === 'cover' || val === 'contain' || val === 'natural';
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function validator(val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right', 'left top', 'right top', 'left bottom', 'right bottom'];
      return valids.indexOf(val) >= 0 || /^-?\d+% -?\d+%$/.test(val);
    }
  }
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE: 'new-image',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW: 'draw',
  INITIAL_IMAGE_LOADED_EVENT: 'initial-image-loaded'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 2; // The amount of times by which the pinching is more sensitive than the scolling
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDrop($event);
        } } }, [_c('input', { ref: "fileInput", staticStyle: { "height": "1px", "width": "1px", "overflow": "hidden", "margin-left": "-99999px", "position": "absolute" }, attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled }, on: { "change": _vm._handleInputChange } }), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._t("placeholder")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();_vm._handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();_vm._handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerMove($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        } } }), _vm.showRemoveButton && _vm.img ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e()]);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: '_init'
  },

  props: props,

  data: function data() {
    return {
      instance: null,
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
      dragging: false,
      lastMovingCoord: null,
      imgData: {},
      dataUrl: '',
      fileDraggedOver: false,
      tabStart: 0,
      pinching: false,
      pinchDistance: 0,
      supportTouch: false,
      pointerMoved: false,
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: null,
      orientation: 1,
      userMetadata: null,
      imageSet: false
    };
  },


  computed: {
    realWidth: function realWidth() {
      return this.width * this.quality;
    },
    realHeight: function realHeight() {
      return this.height * this.quality;
    },
    realPlaceholderFontSize: function realPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    }
  },

  mounted: function mounted() {
    this._init();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }
  },


  watch: {
    value: function value(val) {
      this.instance = val;
    },
    realWidth: function realWidth() {
      if (!this.img) {
        this._init();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this._setSize();
        this._placeImage();
      }
    },
    realHeight: function realHeight() {
      if (!this.img) {
        this._init();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this._setSize();
        this._placeImage();
      }
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this._init();
      } else {
        this._draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this._init();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this._init();
      }
    },
    realPlaceholderFontSize: function realPlaceholderFontSize() {
      if (!this.img) {
        this._init();
      }
    },
    preventWhiteSpace: function preventWhiteSpace() {
      if (this.preventWhiteSpace) {
        this.imageSet = false;
      }
      this._placeImage();
    }
  },

  methods: {
    getCanvas: function getCanvas() {
      return this.canvas;
    },
    getContext: function getContext() {
      return this.ctx;
    },
    getChosenFile: function getChosenFile() {
      return this.$refs.fileInput.files[0];
    },
    getActualImageSize: function getActualImageSize() {
      return {
        width: this.realWidth,
        height: this.realHeight
      };
    },
    move: function move(offset) {
      if (!offset) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.$emit(events.MOVE_EVENT);
      }
      this._draw();
    },
    moveUpwards: function moveUpwards(amount) {
      this.move({ x: 0, y: -amount });
    },
    moveDownwards: function moveDownwards(amount) {
      this.move({ x: 0, y: amount });
    },
    moveLeftwards: function moveLeftwards(amount) {
      this.move({ x: -amount, y: 0 });
    },
    moveRightwards: function moveRightwards(amount) {
      this.move({ x: amount, y: 0 });
    },
    zoom: function zoom(zoomIn, pos) {
      var innerAcceleration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      pos = pos || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      var realSpeed = this.zoomSpeed * innerAcceleration;
      var speed = this.realWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      var oldWidth = this.imgData.width;
      var oldHeight = this.imgData.height;

      this.imgData.width = this.imgData.width * x;
      this.imgData.height = this.imgData.height * x;

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace();
      }
      if (oldWidth.toFixed(2) !== this.imgData.width.toFixed(2) || oldHeight.toFixed(2) !== this.imgData.height.toFixed(2)) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;

        if (this.preventWhiteSpace) {
          this._preventMovingToWhiteSpace();
        }
        this.$emit(events.ZOOM_EVENT);
        this.scaleRatio = this.imgData.width / this.naturalWidth;
      }
      this._draw();
    },
    zoomIn: function zoomIn() {
      this.zoom(true);
    },
    zoomOut: function zoomOut() {
      this.zoom(false);
    },
    rotate: function rotate() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this.disableRotation || this.disabled) return;
      step = parseInt(step);
      if (isNaN(step) || step > 3 || step < -3) {
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
        step = 1;
      }
      this._rotateByStep(step);
    },
    flipX: function flipX() {
      if (this.disableRotation || this.disabled) return;
      this._set(2);
    },
    flipY: function flipY() {
      if (this.disableRotation || this.disabled) return;
      this._set(4);
    },
    refresh: function refresh() {
      this.$nextTick(this._init);
    },
    hasImage: function hasImage() {
      return !!this.img;
    },
    applyMetadata: function applyMetadata(metadata) {
      if (!metadata || !this.img) return;
      this.userMetadata = metadata;
      var ori = metadata.orientation || this.orientation || 1;
      this._set(ori, true);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.img) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.img) return null;
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this.generateBlob(function (blob) {
            resolve(blob);
          }, args);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      if (!this.img) return {};
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY;


      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      };
    },
    supportDetection: function supportDetection() {
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    chooseFile: function chooseFile() {
      this.$refs.fileInput.click();
    },
    remove: function remove() {
      var ctx = this.ctx;
      this._paintBackground();

      this._setImagePlaceholder();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.realWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.realPlaceholderFontSize || this.realPlaceholderFontSize == 0 ? defaultFontSize : this.realPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.realWidth / 2, this.realHeight / 2);

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {};
      this.orientation = 1;
      this.scaleRatio = null;
      this.userMetadata = null;
      this.imageSet = false;

      if (hadImage) {
        this.$emit(events.IMAGE_REMOVE_EVENT);
      }
    },
    _init: function _init() {
      this.canvas = this.$refs.canvas;
      this._setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.originalImage = null;
      this.img = null;
      this._setInitial();
      this.$emit(events.INIT_EVENT, this);
    },
    _setSize: function _setSize() {
      this.canvas.width = this.realWidth;
      this.canvas.height = this.realHeight;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
    },
    _rotateByStep: function _rotateByStep(step) {
      var orientation = 1;
      switch (step) {
        case 1:
          orientation = 6;
          break;
        case 2:
          orientation = 3;
          break;
        case 3:
          orientation = 8;
          break;
        case -1:
          orientation = 8;
          break;
        case -2:
          orientation = 3;
          break;
        case -3:
          orientation = 6;
          break;
      }
      this._set(orientation);
    },
    _setImagePlaceholder: function _setImagePlaceholder() {
      var _this2 = this;

      var img = void 0;
      if (this.$slots.placeholder && this.$slots.placeholder[0]) {
        var vNode = this.$slots.placeholder[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }

      if (!img) return;

      var onLoad = function onLoad() {
        _this2.ctx.drawImage(img, 0, 0, _this2.realWidth, _this2.realHeight);
      };

      if (u.imageLoaded(img)) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    },
    _setInitial: function _setInitial() {
      var _this3 = this;

      var src = void 0,
          img = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }
      if (this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage;
        img = new Image();
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous');
        }
        img.src = src;
      } else if (_typeof(this.initialImage) === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage;
      }
      if (!src && !img) {
        this.remove();
        return;
      }
      if (u.imageLoaded(img)) {
        this._onload(img, +img.dataset['exifOrientation']);
        this.$emit(events.INITIAL_IMAGE_LOADED_EVENT);
      } else {
        img.onload = function () {
          _this3._onload(img, +img.dataset['exifOrientation']);
          _this3.$emit(events.INITIAL_IMAGE_LOADED_EVENT);
        };

        img.onerror = function () {
          _this3.remove();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      this.originalImage = img;
      this.img = img;

      if (isNaN(orientation)) {
        orientation = 1;
      }

      this._set(orientation);
    },
    _handleClick: function _handleClick() {
      if (!this.img && !this.disableClickToChoose && !this.disabled && !this.supportTouch) {
        this.chooseFile();
      }
    },
    _handleInputChange: function _handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length) return;

      var file = input.files[0];
      this._onNewFileIn(file);
    },
    _onNewFileIn: function _onNewFileIn(file) {
      var _this4 = this;

      this.$emit(events.FILE_CHOOSE_EVENT, file);
      if (!this._fileSizeIsValid(file)) {
        this.$emit(events.FILE_SIZE_EXCEED_EVENT, file);
        throw new Error('File size exceeds limit which is ' + this.fileSizeLimit + ' bytes.');
      }
      if (!this._fileTypeIsValid(file)) {
        this.$emit(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        throw new Error('File type (' + type + ') does not match what you specified (' + this.accept + ').');
      }
      if (typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var orientation = u.getFileOrientation(u.base64ToArrayBuffer(fileData));
          if (orientation < 1) orientation = 1;
          var img = new Image();
          img.src = fileData;
          img.onload = function () {
            _this4._onload(img, orientation);
            _this4.$emit(events.NEW_IMAGE);
          };
        };
        fr.readAsDataURL(file);
      }
    },
    _fileSizeIsValid: function _fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    _fileTypeIsValid: function _fileTypeIsValid(file) {
      var accept = this.accept || 'image/*';
      var baseMimetype = accept.replace(/\/.*$/, '');
      var types = accept.split(',');
      for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var t = type.trim();
        if (t.charAt(0) == '.') {
          if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true;
        } else if (/\/\*$/.test(t)) {
          var fileBaseType = file.type.replace(/\/.*$/, '');
          if (fileBaseType === baseMimetype) {
            return true;
          }
        } else if (file.type === type) {
          return true;
        }
      }

      return false;
    },
    _placeImage: function _placeImage(applyMetadata) {
      var imgData = this.imgData;

      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0;
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0;

      if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this._aspectFit();
        } else if (this.initialSize == 'natural') {
          this._naturalSize();
        } else {
          this._aspectFill();
        }
      } else if (u.numberValid(this.scaleRatio)) {
        imgData.width = this.naturalWidth * this.scaleRatio;
        imgData.height = this.naturalHeight * this.scaleRatio;
      } else {
        this._aspectFill();
      }
      this.scaleRatio = imgData.width / this.naturalWidth;

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0;
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.realHeight - imgData.height;
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0;
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.realWidth - imgData.width;
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
          var x = +result[1] / 100;
          var y = +result[2] / 100;
          imgData.startX = x * (this.realWidth - imgData.width);
          imgData.startY = y * (this.realHeight - imgData.height);
        }
      }

      applyMetadata && this._setMetadata();

      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace();
      }

      if (!this.imageSet) {
        this.imageSet = true;
      }

      // this._draw(applyMetadata && this.preventWhiteSpace)
      if (applyMetadata && this.preventWhiteSpace) {
        this.zoom(false, null, 0);
      } else {
        this._draw();
      }
    },
    _aspectFill: function _aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var imgRatio = imgHeight / imgWidth;
      var canvasRatio = this.realHeight / this.realWidth;
      var scaleRatio = void 0;
      if (imgRatio < canvasRatio) {
        scaleRatio = imgHeight / this.realHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.realHeight;
        this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
        this.imgData.startY = 0;
      } else {
        scaleRatio = imgWidth / this.realWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.realWidth;
        this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
        this.imgData.startX = 0;
      }
    },
    _aspectFit: function _aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var imgRatio = imgHeight / imgWidth;
      var canvasRatio = this.realHeight / this.realWidth;
      var scaleRatio = void 0;
      if (imgRatio < canvasRatio) {
        scaleRatio = imgWidth / this.realWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.realWidth;
        this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
      } else {
        scaleRatio = imgHeight / this.realHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.realHeight;
        this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
      }
    },
    _naturalSize: function _naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
    },
    _handlePointerStart: function _handlePointerStart(evt) {
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.img && !this.disableClickToChoose) {
        this.tabStart = new Date().valueOf();
        return;
      }
      // ignore mouse right click and middle click
      if (evt.which && evt.which > 1) return;

      if (!evt.touches || evt.touches.length === 1) {
        this.dragging = true;
        this.pinching = false;
        var coord = u.getPointerCoords(evt, this);
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
      }

      var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
      for (var i = 0, len = cancelEvents.length; i < len; i++) {
        var e = cancelEvents[i];
        document.addEventListener(e, this._handlePointerEnd);
      }
    },
    _handlePointerEnd: function _handlePointerEnd(evt) {
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.img && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
      this.lastMovingCoord = null;
      this.pointerMoved = false;
      this.pointerStartCoord = null;
    },
    _handlePointerMove: function _handlePointerMove(evt) {
      this.pointerMoved = true;

      if (this.disabled || this.disableDragToMove || !this.img) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
        var coord = u.getPointerCoords(evt, this);
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          });
        }
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, null, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    _handleWheel: function _handleWheel(evt) {
      if (this.disabled || this.disableScrollToZoom || !this.img) return;
      evt.preventDefault();
      var coord = u.getPointerCoords(evt, this);
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom, coord);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom, coord);
      }
    },
    _handleDragEnter: function _handleDragEnter(evt) {
      if (this.disabled || this.disableDragAndDrop || this.img || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = true;
    },
    _handleDragLeave: function _handleDragLeave(evt) {
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    _handleDragOver: function _handleDragOver(evt) {},
    _handleDrop: function _handleDrop(evt) {
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;

      var file = void 0;
      var dt = evt.dataTransfer;
      if (!dt) return;
      if (dt.items) {
        for (var i = 0, len = dt.items.length; i < len; i++) {
          var item = dt.items[i];
          if (item.kind == 'file') {
            file = item.getAsFile();
            break;
          }
        }
      } else {
        file = dt.files[0];
      }

      if (file) {
        this._onNewFileIn(file);
      }
    },
    _preventMovingToWhiteSpace: function _preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.realWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.realWidth);
      }
      if (this.realHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.realHeight);
      }
    },
    _preventZoomingToWhiteSpace: function _preventZoomingToWhiteSpace() {
      if (this.imgData.width < this.realWidth) {
        var _x = this.realWidth / this.imgData.width;
        this.imgData.width = this.realWidth;
        this.imgData.height = this.imgData.height * _x;
      }

      if (this.imgData.height < this.realHeight) {
        var _x5 = this.realHeight / this.imgData.height;
        this.imgData.height = this.realHeight;
        this.imgData.width = this.imgData.width * _x5;
      }
    },
    _set: function _set() {
      var _this5 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var useOriginal = arguments[1];

      if (!this.img) return;
      if (orientation > 1 || useOriginal) {
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this5.img = _img;
          _this5._placeImage(useOriginal);
        };
      } else {
        this._placeImage();
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation);
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation));
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)));
      } else {
        this.orientation = orientation;
      }

      if (useOriginal) {
        this.orientation = orientation;
      }
    },
    _paintBackground: function _paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.realWidth, this.realHeight);
      this.ctx.fillRect(0, 0, this.realWidth, this.realHeight);
    },
    _draw: function _draw() {
      if (!this.img) return;
      // if (noWS) {
      //   this._preventZoomingToWhiteSpace()
      //   this._preventMovingToWhiteSpace()
      // }
      if (window.requestAnimationFrame) {
        requestAnimationFrame(this._drawFrame);
      } else {
        this._drawFrame();
      }
    },
    _drawFrame: function _drawFrame() {
      var ctx = this.ctx;
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY,
          width = _imgData2.width,
          height = _imgData2.height;


      this._paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);
      this.$emit(events.DRAW, ctx);
    },
    _setMetadata: function _setMetadata() {
      if (!this.userMetadata) return;
      var _userMetadata = this.userMetadata,
          startX = _userMetadata.startX,
          startY = _userMetadata.startY,
          scale = _userMetadata.scale;


      if (u.numberValid(startX)) {
        this.imgData.startX = startX;
      }

      if (u.numberValid(startY)) {
        this.imgData.startY = startY;
      }

      if (u.numberValid(scale)) {
        this.imgData.width = this.naturalWidth * scale;
        this.imgData.height = this.naturalHeight * scale;
        this.scaleRatio = scale;
      }
    }
  }
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index$1 = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var defaultOptions = {
  componentName: 'croppa'
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = index$1({}, defaultOptions, options);
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';

    // registration
    Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9IE51bWJlci5pc0ludGVnZXIgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZVxyXG59XHJcblxyXG52YXIgaW5pdGlhbEltYWdlVHlwZSA9IFN0cmluZ1xyXG5pZiAod2luZG93ICYmIHdpbmRvdy5IVE1MSW1hZ2VFbGVtZW50KSB7XHJcbiAgaW5pdGlhbEltYWdlVHlwZSA9IFtTdHJpbmcsIEhUTUxJbWFnZUVsZW1lbnRdXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB2YWx1ZTogT2JqZWN0LFxyXG4gIHdpZHRoOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGhlaWdodDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbGFjZWhvbGRlcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ0Nob29zZSBhbiBpbWFnZSdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJGb250U2l6ZToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGNhbnZhc0NvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAndHJhbnNwYXJlbnQnXHJcbiAgfSxcclxuICBxdWFsaXR5OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHZhbCkgJiYgdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgem9vbVNwZWVkOiB7XHJcbiAgICBkZWZhdWx0OiAzLFxyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBhY2NlcHQ6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICcuanBnLC5qcGVnLC5wbmcsLmdpZiwuYm1wLC53ZWJwLC5zdmcsLnRpZmYnXHJcbiAgfSxcclxuICBmaWxlU2l6ZUxpbWl0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgZGlzYWJsZURyYWdBbmREcm9wOiBCb29sZWFuLFxyXG4gIGRpc2FibGVDbGlja1RvQ2hvb3NlOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnVG9Nb3ZlOiBCb29sZWFuLFxyXG4gIGRpc2FibGVTY3JvbGxUb1pvb206IEJvb2xlYW4sXHJcbiAgZGlzYWJsZVBpbmNoVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVSb3RhdGlvbjogQm9vbGVhbixcclxuICByZXZlcnNlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIHByZXZlbnRXaGl0ZVNwYWNlOiBCb29sZWFuLFxyXG4gIHNob3dSZW1vdmVCdXR0b246IHtcclxuICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICBkZWZhdWx0OiB0cnVlXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25Db2xvcjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ3JlZCdcclxuICB9LFxyXG4gIHJlbW92ZUJ1dHRvblNpemU6IHtcclxuICAgIHR5cGU6IE51bWJlclxyXG4gIH0sXHJcbiAgaW5pdGlhbEltYWdlOiBpbml0aWFsSW1hZ2VUeXBlLFxyXG4gIGluaXRpYWxTaXplOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnY292ZXInLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPT09ICdjb3ZlcicgfHwgdmFsID09PSAnY29udGFpbicgfHwgdmFsID09PSAnbmF0dXJhbCdcclxuICAgIH1cclxuICB9LFxyXG4gIGluaXRpYWxQb3NpdGlvbjoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NlbnRlcicsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgdmFyIHZhbGlkcyA9IFtcclxuICAgICAgICAnY2VudGVyJyxcclxuICAgICAgICAndG9wJyxcclxuICAgICAgICAnYm90dG9tJyxcclxuICAgICAgICAnbGVmdCcsXHJcbiAgICAgICAgJ3JpZ2h0JyxcclxuICAgICAgICAndG9wIGxlZnQnLFxyXG4gICAgICAgICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICdib3R0b20gbGVmdCcsXHJcbiAgICAgICAgJ2JvdHRvbSByaWdodCcsXHJcbiAgICAgICAgJ2xlZnQgdG9wJyxcclxuICAgICAgICAncmlnaHQgdG9wJyxcclxuICAgICAgICAnbGVmdCBib3R0b20nLFxyXG4gICAgICAgICdyaWdodCBib3R0b20nXHJcbiAgICAgIF1cclxuICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHZhbCkgPj0gMCB8fCAvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodmFsKVxyXG4gICAgfVxyXG4gIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgSU5JVF9FVkVOVDogJ2luaXQnLFxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcbiAgRklMRV9TSVpFX0VYQ0VFRF9FVkVOVDogJ2ZpbGUtc2l6ZS1leGNlZWQnLFxuICBGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQ6ICdmaWxlLXR5cGUtbWlzbWF0Y2gnLFxuICBORVdfSU1BR0U6ICduZXctaW1hZ2UnLFxuICBJTUFHRV9SRU1PVkVfRVZFTlQ6ICdpbWFnZS1yZW1vdmUnLFxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXG4gIFpPT01fRVZFTlQ6ICd6b29tJyxcbiAgRFJBVzogJ2RyYXcnLFxuICBJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVDogJ2luaXRpYWwtaW1hZ2UtbG9hZGVkJ1xufVxuIiwiPHRlbXBsYXRlPlxyXG4gIDxkaXYgcmVmPVwid3JhcHBlclwiXHJcbiAgICAgICA6Y2xhc3M9XCJgY3JvcHBhLWNvbnRhaW5lciAke2ltZyA/ICdjcm9wcGEtLWhhcy10YXJnZXQnIDogJyd9ICR7ZGlzYWJsZWQgPyAnY3JvcHBhLS1kaXNhYmxlZCcgOiAnJ30gJHtkaXNhYmxlQ2xpY2tUb0Nob29zZSA/ICdjcm9wcGEtLWRpc2FibGVkLWNjJyA6ICcnfSAke2Rpc2FibGVEcmFnVG9Nb3ZlICYmIGRpc2FibGVTY3JvbGxUb1pvb20gPyAnY3JvcHBhLS1kaXNhYmxlZC1teicgOiAnJ30gJHtmaWxlRHJhZ2dlZE92ZXIgPyAnY3JvcHBhLS1kcm9wem9uZScgOiAnJ31gXCJcclxuICAgICAgIEBkcmFnZW50ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdFbnRlclwiXHJcbiAgICAgICBAZHJhZ2xlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcmFnT3ZlclwiXHJcbiAgICAgICBAZHJvcC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJvcFwiPlxyXG4gICAgPGlucHV0IHR5cGU9XCJmaWxlXCJcclxuICAgICAgICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgICAgICA6ZGlzYWJsZWQ9XCJkaXNhYmxlZFwiXHJcbiAgICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgICAgICBAY2hhbmdlPVwiX2hhbmRsZUlucHV0Q2hhbmdlXCJcclxuICAgICAgICAgICBzdHlsZT1cImhlaWdodDoxcHg7d2lkdGg6MXB4O292ZXJmbG93OmhpZGRlbjttYXJnaW4tbGVmdDotOTk5OTlweDtwb3NpdGlvbjphYnNvbHV0ZTtcIiAvPlxyXG4gICAgPGRpdiBjbGFzcz1cInNsb3RzXCJcclxuICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxyXG4gICAgICA8c2xvdCBuYW1lPVwicGxhY2Vob2xkZXJcIj48L3Nsb3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxjYW52YXMgcmVmPVwiY2FudmFzXCJcclxuICAgICAgICAgICAgQGNsaWNrLnN0b3AucHJldmVudD1cIl9oYW5kbGVDbGlja1wiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3A9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQG1vdXNlZG93bi5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHBvaW50ZXJzdGFydC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHRvdWNoZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNoY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQG1vdXNldXAuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmVuZC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyY2FuY2VsLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHRvdWNobW92ZS5zdG9wPVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcm1vdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQERPTU1vdXNlU2Nyb2xsLnN0b3A9XCJfaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAd2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXdoZWVsLnN0b3A9XCJfaGFuZGxlV2hlZWxcIj48L2NhbnZhcz5cclxuICAgIDxzdmcgY2xhc3M9XCJpY29uIGljb24tcmVtb3ZlXCJcclxuICAgICAgICAgdi1pZj1cInNob3dSZW1vdmVCdXR0b24gJiYgaW1nXCJcclxuICAgICAgICAgQGNsaWNrPVwicmVtb3ZlXCJcclxuICAgICAgICAgOnN0eWxlPVwiYHRvcDogLSR7aGVpZ2h0LzQwfXB4OyByaWdodDogLSR7d2lkdGgvNDB9cHhgXCJcclxuICAgICAgICAgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIlxyXG4gICAgICAgICB2ZXJzaW9uPVwiMS4xXCJcclxuICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXHJcbiAgICAgICAgIDp3aWR0aD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIlxyXG4gICAgICAgICA6aGVpZ2h0PVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTUxMS45MjEyMzEgMEMyMjkuMTc5MDc3IDAgMCAyMjkuMjU3ODQ2IDAgNTEyIDAgNzk0LjcwMjc2OSAyMjkuMTc5MDc3IDEwMjQgNTExLjkyMTIzMSAxMDI0IDc5NC43ODE1MzggMTAyNCAxMDI0IDc5NC43MDI3NjkgMTAyNCA1MTIgMTAyNCAyMjkuMjU3ODQ2IDc5NC43ODE1MzggMCA1MTEuOTIxMjMxIDBaTTczMi4wNDE4NDYgNjUwLjYzMzg0NiA2NTAuNTE1NjkyIDczMi4wODEyMzFDNjUwLjUxNTY5MiA3MzIuMDgxMjMxIDUyMS40OTE2OTIgNTkzLjY4MzY5MiA1MTEuODgxODQ2IDU5My42ODM2OTIgNTAyLjQyOTUzOCA1OTMuNjgzNjkyIDM3My4zNjYxNTQgNzMyLjA4MTIzMSAzNzMuMzY2MTU0IDczMi4wODEyMzFMMjkxLjc2MTIzMSA2NTAuNjMzODQ2QzI5MS43NjEyMzEgNjUwLjYzMzg0NiA0MzAuMzE2MzA4IDUyMy41MDAzMDggNDMwLjMxNjMwOCA1MTIuMTk2OTIzIDQzMC4zMTYzMDggNTAwLjY5NjYxNSAyOTEuNzYxMjMxIDM3My41MjM2OTIgMjkxLjc2MTIzMSAzNzMuNTIzNjkyTDM3My4zNjYxNTQgMjkxLjkxODc2OUMzNzMuMzY2MTU0IDI5MS45MTg3NjkgNTAzLjQ1MzUzOCA0MzAuMzk1MDc3IDUxMS44ODE4NDYgNDMwLjM5NTA3NyA1MjAuMzQ5NTM4IDQzMC4zOTUwNzcgNjUwLjUxNTY5MiAyOTEuOTE4NzY5IDY1MC41MTU2OTIgMjkxLjkxODc2OUw3MzIuMDQxODQ2IDM3My41MjM2OTJDNzMyLjA0MTg0NiAzNzMuNTIzNjkyIDU5My40NDczODUgNTAyLjU0NzY5MiA1OTMuNDQ3Mzg1IDUxMi4xOTY5MjMgNTkzLjQ0NzM4NSA1MjEuNDEyOTIzIDczMi4wNDE4NDYgNjUwLjYzMzg0NiA3MzIuMDQxODQ2IDY1MC42MzM4NDZaXCJcclxuICAgICAgICAgICAgOmZpbGw9XCJyZW1vdmVCdXR0b25Db2xvclwiPjwvcGF0aD5cclxuICAgIDwvc3ZnPlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcbiAgaW1wb3J0IGV2ZW50cyBmcm9tICcuL2V2ZW50cydcclxuXHJcbiAgY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXHJcbiAgY29uc3QgTUlOX01TX1BFUl9DTElDSyA9IDUwMCAvLyBJZiB0b3VjaCBkdXJhdGlvbiBpcyBzaG9ydGVyIHRoYW4gdGhlIHZhbHVlLCB0aGVuIGl0IGlzIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuICBjb25zdCBDTElDS19NT1ZFX1RIUkVTSE9MRCA9IDEwMCAvLyBJZiB0b3VjaCBtb3ZlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGVuIGl0IHdpbGwgYnkgbm8gbWVhbiBiZSBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXHJcbiAgY29uc3QgREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgPSAyIC8gMyAvLyBQbGFjZWhvbGRlciB0ZXh0IGJ5IGRlZmF1bHQgdGFrZXMgdXAgdGhpcyBhbW91bnQgb2YgdGltZXMgb2YgY2FudmFzIHdpZHRoLlxyXG4gIGNvbnN0IFBJTkNIX0FDQ0VMRVJBVElPTiA9IDIgLy8gVGhlIGFtb3VudCBvZiB0aW1lcyBieSB3aGljaCB0aGUgcGluY2hpbmcgaXMgbW9yZSBzZW5zaXRpdmUgdGhhbiB0aGUgc2NvbGxpbmdcclxuICAvLyBjb25zdCBERUJVRyA9IGZhbHNlXHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIG1vZGVsOiB7XHJcbiAgICAgIHByb3A6ICd2YWx1ZScsXHJcbiAgICAgIGV2ZW50OiAnX2luaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge30sXHJcbiAgICAgICAgZGF0YVVybDogJycsXHJcbiAgICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcclxuICAgICAgICB0YWJTdGFydDogMCxcclxuICAgICAgICBwaW5jaGluZzogZmFsc2UsXHJcbiAgICAgICAgcGluY2hEaXN0YW5jZTogMCxcclxuICAgICAgICBzdXBwb3J0VG91Y2g6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50ZXJNb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlclN0YXJ0Q29vcmQ6IG51bGwsXHJcbiAgICAgICAgbmF0dXJhbFdpZHRoOiAwLFxyXG4gICAgICAgIG5hdHVyYWxIZWlnaHQ6IDAsXHJcbiAgICAgICAgc2NhbGVSYXRpbzogbnVsbCxcclxuICAgICAgICBvcmllbnRhdGlvbjogMSxcclxuICAgICAgICB1c2VyTWV0YWRhdGE6IG51bGwsXHJcbiAgICAgICAgaW1hZ2VTZXQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgY29tcHV0ZWQ6IHtcclxuICAgICAgcmVhbFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVhbEhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJGb250U2l6ZSAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLl9pbml0KClcclxuICAgICAgdS5yQUZQb2x5ZmlsbCgpXHJcbiAgICAgIHUudG9CbG9iUG9seWZpbGwoKVxyXG5cclxuICAgICAgbGV0IHN1cHBvcnRzID0gdGhpcy5zdXBwb3J0RGV0ZWN0aW9uKClcclxuICAgICAgaWYgKCFzdXBwb3J0cy5iYXNpYykge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdnVlLWNyb3BwYSBmdW5jdGlvbmFsaXR5LicpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlID0gdmFsXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlYWxXaWR0aDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuX2luaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuX3NldFNpemUoKVxyXG4gICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZWFsSGVpZ2h0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5faW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5fc2V0U2l6ZSgpXHJcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbnZhc0NvbG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5faW5pdCgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9pbml0KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHBsYWNlaG9sZGVyQ29sb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9pbml0KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJlYWxQbGFjZWhvbGRlckZvbnRTaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5faW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGdldENhbnZhcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRDb250ZXh0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdHhcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldENob3NlbkZpbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRyZWZzLmZpbGVJbnB1dC5maWxlc1swXVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0QWN0dWFsSW1hZ2VTaXplICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgd2lkdGg6IHRoaXMucmVhbFdpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlIChvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkgcmV0dXJuXHJcbiAgICAgICAgbGV0IG9sZFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYXHJcbiAgICAgICAgbGV0IG9sZFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYICE9PSBvbGRYIHx8IHRoaXMuaW1nRGF0YS5zdGFydFkgIT09IG9sZFkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk1PVkVfRVZFTlQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZVVwd2FyZHMgKGFtb3VudCkge1xyXG4gICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmVEb3dud2FyZHMgKGFtb3VudCkge1xyXG4gICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IGFtb3VudCB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZUxlZnR3YXJkcyAoYW1vdW50KSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHsgeDogLWFtb3VudCwgeTogMCB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgbW92ZVJpZ2h0d2FyZHMgKGFtb3VudCkge1xyXG4gICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbSAoem9vbUluLCBwb3MsIGlubmVyQWNjZWxlcmF0aW9uID0gMSkge1xyXG4gICAgICAgIHBvcyA9IHBvcyB8fCB7XHJcbiAgICAgICAgICB4OiB0aGlzLmltZ0RhdGEuc3RhcnRYICsgdGhpcy5pbWdEYXRhLndpZHRoIC8gMixcclxuICAgICAgICAgIHk6IHRoaXMuaW1nRGF0YS5zdGFydFkgKyB0aGlzLmltZ0RhdGEuaGVpZ2h0IC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVhbFNwZWVkID0gdGhpcy56b29tU3BlZWQgKiBpbm5lckFjY2VsZXJhdGlvblxyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLnJlYWxXaWR0aCAqIFBDVF9QRVJfWk9PTSkgKiByZWFsU3BlZWRcclxuICAgICAgICBsZXQgeCA9IDFcclxuICAgICAgICBpZiAoem9vbUluKSB7XHJcbiAgICAgICAgICB4ID0gMSArIHNwZWVkXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmltZ0RhdGEud2lkdGggPiBNSU5fV0lEVEgpIHtcclxuICAgICAgICAgIHggPSAxIC0gc3BlZWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvbGRXaWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgIGxldCBvbGRIZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcblxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMuaW1nRGF0YS53aWR0aCAqIHhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5pbWdEYXRhLmhlaWdodCAqIHhcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMuX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9sZFdpZHRoLnRvRml4ZWQoMikgIT09IHRoaXMuaW1nRGF0YS53aWR0aC50b0ZpeGVkKDIpIHx8IG9sZEhlaWdodC50b0ZpeGVkKDIpICE9PSB0aGlzLmltZ0RhdGEuaGVpZ2h0LnRvRml4ZWQoMikpIHtcclxuICAgICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLlpPT01fRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLmltZ0RhdGEud2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb21JbiAoKSB7XHJcbiAgICAgICAgdGhpcy56b29tKHRydWUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tT3V0ICgpIHtcclxuICAgICAgICB0aGlzLnpvb20oZmFsc2UpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByb3RhdGUgKHN0ZXAgPSAxKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQpIHJldHVyblxyXG4gICAgICAgIHN0ZXAgPSBwYXJzZUludChzdGVwKVxyXG4gICAgICAgIGlmIChpc05hTihzdGVwKSB8fCBzdGVwID4gMyB8fCBzdGVwIDwgLTMpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybignSW52YWxpZCBhcmd1bWVudCBmb3Igcm90YXRlKCkgbWV0aG9kLiBJdCBzaG91bGQgb25lIG9mIHRoZSBpbnRlZ2VycyBmcm9tIC0zIHRvIDMuJylcclxuICAgICAgICAgIHN0ZXAgPSAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JvdGF0ZUJ5U3RlcChzdGVwKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmxpcFggKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICB0aGlzLl9zZXQoMilcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZsaXBZICgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5fc2V0KDQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWZyZXNoICgpIHtcclxuICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9pbml0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFzSW1hZ2UgKCkge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuaW1nXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhcHBseU1ldGFkYXRhIChtZXRhZGF0YSkge1xyXG4gICAgICAgIGlmICghbWV0YWRhdGEgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgICAgdmFyIG9yaSA9IG1ldGFkYXRhLm9yaWVudGF0aW9uIHx8IHRoaXMub3JpZW50YXRpb24gfHwgMVxyXG4gICAgICAgIHRoaXMuX3NldChvcmksIHRydWUpXHJcbiAgICAgIH0sXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBjb21wcmVzc2lvblJhdGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxyXG4gICAgICAgICAgICB9LCBhcmdzKVxyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldE1ldGFkYXRhICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm4ge31cclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSB9ID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBzdGFydFgsXHJcbiAgICAgICAgICBzdGFydFksXHJcbiAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgJ2Jhc2ljJzogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IsXHJcbiAgICAgICAgICAnZG5kJzogJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2hvb3NlRmlsZSAoKSB7XHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQuY2xpY2soKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVtb3ZlICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICB0aGlzLl9wYWludEJhY2tncm91bmQoKVxyXG5cclxuICAgICAgICB0aGlzLl9zZXRJbWFnZVBsYWNlaG9sZGVyKClcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gJ2NlbnRlcidcclxuICAgICAgICBsZXQgZGVmYXVsdEZvbnRTaXplID0gdGhpcy5yZWFsV2lkdGggKiBERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCAvIHRoaXMucGxhY2Vob2xkZXIubGVuZ3RoXHJcbiAgICAgICAgbGV0IGZvbnRTaXplID0gKCF0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplIHx8IHRoaXMucmVhbFBsYWNlaG9sZGVyRm9udFNpemUgPT0gMCkgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplXHJcbiAgICAgICAgY3R4LmZvbnQgPSBmb250U2l6ZSArICdweCBzYW5zLXNlcmlmJ1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAoIXRoaXMucGxhY2Vob2xkZXJDb2xvciB8fCB0aGlzLnBsYWNlaG9sZGVyQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICcjNjA2MDYwJyA6IHRoaXMucGxhY2Vob2xkZXJDb2xvclxyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLnBsYWNlaG9sZGVyLCB0aGlzLnJlYWxXaWR0aCAvIDIsIHRoaXMucmVhbEhlaWdodCAvIDIpXHJcblxyXG4gICAgICAgIGxldCBoYWRJbWFnZSA9IHRoaXMuaW1nICE9IG51bGxcclxuICAgICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWcgPSBudWxsXHJcbiAgICAgICAgdGhpcy4kcmVmcy5maWxlSW5wdXQudmFsdWUgPSAnJ1xyXG4gICAgICAgIHRoaXMuaW1nRGF0YSA9IHt9XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IDFcclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBudWxsXHJcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcblxyXG4gICAgICAgIGlmIChoYWRJbWFnZSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU1BR0VfUkVNT1ZFX0VWRU5UKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9pbml0ICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgICAgdGhpcy5fc2V0U2l6ZSgpXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLl9zZXRJbml0aWFsKClcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5JTklUX0VWRU5ULCB0aGlzKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3NldFNpemUgKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcm90YXRlQnlTdGVwIChzdGVwKSB7XHJcbiAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgIHN3aXRjaCAoc3RlcCkge1xyXG4gICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSAzXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0yOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTM6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zZXQob3JpZW50YXRpb24pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0SW1hZ2VQbGFjZWhvbGRlciAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1xyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5wbGFjZWhvbGRlciAmJiB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXSkge1xyXG4gICAgICAgICAgbGV0IHZOb2RlID0gdGhpcy4kc2xvdHMucGxhY2Vob2xkZXJbMF1cclxuICAgICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxyXG4gICAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgICAgaW1nID0gZWxtXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWltZykgcmV0dXJuXHJcblxyXG4gICAgICAgIHZhciBvbkxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgICAgb25Mb2FkKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW1nLm9ubG9hZCA9IG9uTG9hZFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRJbml0aWFsICgpIHtcclxuICAgICAgICBsZXQgc3JjLCBpbWdcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMuaW5pdGlhbCAmJiB0aGlzLiRzbG90cy5pbml0aWFsWzBdKSB7XHJcbiAgICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXHJcbiAgICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtKSB7XHJcbiAgICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbml0aWFsSW1hZ2UgJiYgdHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgc3JjID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgICAgIGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICBpZiAoIS9eZGF0YTovLnRlc3Qoc3JjKSAmJiAhL15ibG9iOi8udGVzdChzcmMpKSB7XHJcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpbWcuc3JjID0gc3JjXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdvYmplY3QnICYmIHRoaXMuaW5pdGlhbEltYWdlIGluc3RhbmNlb2YgSW1hZ2UpIHtcclxuICAgICAgICAgIGltZyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3JjICYmICFpbWcpIHtcclxuICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodS5pbWFnZUxvYWRlZChpbWcpKSB7XHJcbiAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCAraW1nLmRhdGFzZXRbJ2V4aWZPcmllbnRhdGlvbiddKVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10pXHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX29ubG9hZCAoaW1nLCBvcmllbnRhdGlvbiA9IDEpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBpbWdcclxuICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG5cclxuICAgICAgICBpZiAoaXNOYU4ob3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NldChvcmllbnRhdGlvbilcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVDbGljayAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5zdXBwb3J0VG91Y2gpIHtcclxuICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZUlucHV0Q2hhbmdlICgpIHtcclxuICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLiRyZWZzLmZpbGVJbnB1dFxyXG4gICAgICAgIGlmICghaW5wdXQuZmlsZXMubGVuZ3RoKSByZXR1cm5cclxuXHJcbiAgICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxyXG4gICAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX0NIT09TRV9FVkVOVCwgZmlsZSlcclxuICAgICAgICBpZiAoIXRoaXMuX2ZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBzaXplIGV4Y2VlZHMgbGltaXQgd2hpY2ggaXMgJyArIHRoaXMuZmlsZVNpemVMaW1pdCArICcgYnl0ZXMuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9maWxlVHlwZUlzVmFsaWQoZmlsZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCwgZmlsZSlcclxuICAgICAgICAgIGxldCB0eXBlID0gZmlsZS50eXBlIHx8IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcuJykucG9wKClcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmlsZSB0eXBlICgke3R5cGV9KSBkb2VzIG5vdCBtYXRjaCB3aGF0IHlvdSBzcGVjaWZpZWQgKCR7dGhpcy5hY2NlcHR9KS5gKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5GaWxlUmVhZGVyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgbGV0IGZyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgICAgZnIub25sb2FkID0gKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGZpbGVEYXRhID0gZS50YXJnZXQucmVzdWx0XHJcbiAgICAgICAgICAgIGxldCBvcmllbnRhdGlvbiA9IHUuZ2V0RmlsZU9yaWVudGF0aW9uKHUuYmFzZTY0VG9BcnJheUJ1ZmZlcihmaWxlRGF0YSkpXHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA8IDEpIG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgICAgICAgICAgaW1nLnNyYyA9IGZpbGVEYXRhXHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTkVXX0lNQUdFKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2ZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXHJcblxyXG4gICAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9maWxlVHlwZUlzVmFsaWQgKGZpbGUpIHtcclxuICAgICAgICBsZXQgYWNjZXB0ID0gdGhpcy5hY2NlcHQgfHwgJ2ltYWdlLyonXHJcbiAgICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICBsZXQgdHlwZXMgPSBhY2NlcHQuc3BsaXQoJywnKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxyXG4gICAgICAgICAgbGV0IHQgPSB0eXBlLnRyaW0oKVxyXG4gICAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh0KSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZUJhc2VUeXBlID0gZmlsZS50eXBlLnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5uYXR1cmFsSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG5cclxuICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFgpID8gaW1nRGF0YS5zdGFydFggOiAwXHJcbiAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRZKSA/IGltZ0RhdGEuc3RhcnRZIDogMFxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xyXG4gICAgICAgICAgICB0aGlzLl9hc3BlY3RGaXQoKVxyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluaXRpYWxTaXplID09ICduYXR1cmFsJykge1xyXG4gICAgICAgICAgICB0aGlzLl9uYXR1cmFsU2l6ZSgpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9hc3BlY3RGaWxsKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHUubnVtYmVyVmFsaWQodGhpcy5zY2FsZVJhdGlvKSkge1xyXG4gICAgICAgICAgaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogdGhpcy5zY2FsZVJhdGlvXHJcbiAgICAgICAgICBpbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9hc3BlY3RGaWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gaW1nRGF0YS53aWR0aCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgaWYgKC90b3AvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvYm90dG9tLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgICBpbWdEYXRhLnN0YXJ0WSA9IHRoaXMucmVhbEhlaWdodCAtIGltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKC9sZWZ0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICAgIH0gZWxzZSBpZiAoL3JpZ2h0Ly50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHRoaXMucmVhbFdpZHRoIC0gaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAvXigtP1xcZCspJSAoLT9cXGQrKSUkLy5leGVjKHRoaXMuaW5pdGlhbFBvc2l0aW9uKVxyXG4gICAgICAgICAgICB2YXIgeCA9ICtyZXN1bHRbMV0gLyAxMDBcclxuICAgICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLnJlYWxXaWR0aCAtIGltZ0RhdGEud2lkdGgpXHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0geSAqICh0aGlzLnJlYWxIZWlnaHQgLSBpbWdEYXRhLmhlaWdodClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFwcGx5TWV0YWRhdGEgJiYgdGhpcy5fc2V0TWV0YWRhdGEoKVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaW1hZ2VTZXQpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0aGlzLl9kcmF3KGFwcGx5TWV0YWRhdGEgJiYgdGhpcy5wcmV2ZW50V2hpdGVTcGFjZSlcclxuICAgICAgICBpZiAoYXBwbHlNZXRhZGF0YSAmJiB0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oZmFsc2UsIG51bGwsIDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9hc3BlY3RGaWxsICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgaW1nUmF0aW8gPSBpbWdIZWlnaHQgLyBpbWdXaWR0aFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgbGV0IHNjYWxlUmF0aW9cclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nV2lkdGggLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2FzcGVjdEZpdCAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGltZ1JhdGlvID0gaW1nSGVpZ2h0IC8gaW1nV2lkdGhcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIGxldCBzY2FsZVJhdGlvXHJcbiAgICAgICAgaWYgKGltZ1JhdGlvIDwgY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfbmF0dXJhbFNpemUgKCkge1xyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KSAvIDJcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVQb2ludGVyU3RhcnQgKGV2dCkge1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG5cclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuX2hhbmRsZVBvaW50ZXJFbmQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZVBvaW50ZXJFbmQgKGV2dCkge1xyXG4gICAgICAgIGxldCBwb2ludGVyTW92ZURpc3RhbmNlID0gMFxyXG4gICAgICAgIGlmICh0aGlzLnBvaW50ZXJTdGFydENvb3JkKSB7XHJcbiAgICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHBvaW50ZXJNb3ZlRGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnRlckNvb3JkLnggLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLngsIDIpICsgTWF0aC5wb3cocG9pbnRlckNvb3JkLnkgLSB0aGlzLnBvaW50ZXJTdGFydENvb3JkLnksIDIpKSB8fCAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlKSB7XHJcbiAgICAgICAgICBsZXQgdGFiRW5kID0gbmV3IERhdGUoKS52YWx1ZU9mKClcclxuICAgICAgICAgIGlmICgocG9pbnRlck1vdmVEaXN0YW5jZSA8IENMSUNLX01PVkVfVEhSRVNIT0xEKSAmJiB0YWJFbmQgLSB0aGlzLnRhYlN0YXJ0IDwgTUlOX01TX1BFUl9DTElDSyAmJiB0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgICB0aGlzLmNob29zZUZpbGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IDBcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaGluZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gMFxyXG4gICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gbnVsbFxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gbnVsbFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZVBvaW50ZXJNb3ZlIChldnQpIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlZCA9IHRydWVcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ1RvTW92ZSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG5cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIGlmICh0aGlzLmxhc3RNb3ZpbmdDb29yZCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoe1xyXG4gICAgICAgICAgICAgIHg6IGNvb3JkLnggLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC54LFxyXG4gICAgICAgICAgICAgIHk6IGNvb3JkLnkgLSB0aGlzLmxhc3RNb3ZpbmdDb29yZC55XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLnBpbmNoaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBkaXN0YW5jZSA9IHUuZ2V0UGluY2hEaXN0YW5jZShldnQsIHRoaXMpXHJcbiAgICAgICAgICBsZXQgZGVsdGEgPSBkaXN0YW5jZSAtIHRoaXMucGluY2hEaXN0YW5jZVxyXG4gICAgICAgICAgdGhpcy56b29tKGRlbHRhID4gMCwgbnVsbCwgUElOQ0hfQUNDRUxFUkFUSU9OKVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gZGlzdGFuY2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tLCBjb29yZClcclxuICAgICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20sIGNvb3JkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVEcmFnRW50ZXIgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdBbmREcm9wIHx8IHRoaXMuaW1nIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IHRydWVcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVEcmFnTGVhdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5maWxlRHJhZ2dlZE92ZXIgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlRHJvcCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlciB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG5cclxuICAgICAgICBsZXQgZmlsZVxyXG4gICAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcclxuICAgICAgICBpZiAoIWR0KSByZXR1cm5cclxuICAgICAgICBpZiAoZHQuaXRlbXMpIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IGR0Lml0ZW1zW2ldXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmtpbmQgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpbGUgPSBkdC5maWxlc1swXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWFsV2lkdGggLSB0aGlzLmltZ0RhdGEuc3RhcnRYID4gdGhpcy5pbWdEYXRhLndpZHRoKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxXaWR0aCAvIHRoaXMuaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuaGVpZ2h0IDwgdGhpcy5yZWFsSGVpZ2h0KSB7XHJcbiAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLmltZ0RhdGEud2lkdGggKiBfeFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXQgKG9yaWVudGF0aW9uID0gNiwgdXNlT3JpZ2luYWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPiAxIHx8IHVzZU9yaWdpbmFsKSB7XHJcbiAgICAgICAgICB2YXIgX2ltZyA9IHUuZ2V0Um90YXRlZEltYWdlKHVzZU9yaWdpbmFsID8gdGhpcy5vcmlnaW5hbEltYWdlIDogdGhpcy5pbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgICAgX2ltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gX2ltZ1xyXG4gICAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKHVzZU9yaWdpbmFsKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PSAyKSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHhcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA0KSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHlcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA2KSB7XHJcbiAgICAgICAgICAvLyA5MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSAzKSB7XHJcbiAgICAgICAgICAvLyAxODAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gOCkge1xyXG4gICAgICAgICAgLy8gMjcwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXNlT3JpZ2luYWwpIHtcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9wYWludEJhY2tncm91bmQgKCkge1xyXG4gICAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6IHRoaXMuY2FudmFzQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnJlYWxXaWR0aCwgdGhpcy5yZWFsSGVpZ2h0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2RyYXcgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIC8vIGlmIChub1dTKSB7XHJcbiAgICAgICAgLy8gICB0aGlzLl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgLy8gICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9kcmF3RnJhbWUpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX2RyYXdGcmFtZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2RyYXdGcmFtZSAoKSB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY3R4XHJcbiAgICAgICAgbGV0IHsgc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuaW1nRGF0YVxyXG5cclxuICAgICAgICB0aGlzLl9wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkRSQVcsIGN0eClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRNZXRhZGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnVzZXJNZXRhZGF0YSkgcmV0dXJuXHJcbiAgICAgICAgdmFyIHsgc3RhcnRYLCBzdGFydFksIHNjYWxlIH0gPSB0aGlzLnVzZXJNZXRhZGF0YVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFgpKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gc3RhcnRYXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzdGFydFkpKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gc3RhcnRZXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChzY2FsZSkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogc2NhbGVcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiBzY2FsZVxyXG4gICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuICAuY3JvcHBhLWNvbnRhaW5lclxyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrXHJcbiAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZVxyXG4gICAgZm9udC1zaXplOiAwXHJcbiAgICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTZlNmU2XHJcbiAgICBjYW52YXNcclxuICAgICAgdHJhbnNpdGlvbjogYWxsIC4zc1xyXG4gICAgJjpob3ZlclxyXG4gICAgICBvcGFjaXR5OiAuN1xyXG4gICAgJi5jcm9wcGEtLWRyb3B6b25lXHJcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAxMHB4IGxpZ2h0bmVzcyhibGFjaywgMjAlKVxyXG4gICAgICBjYW52YXNcclxuICAgICAgICBvcGFjaXR5OiAuNVxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkLWNjXHJcbiAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgJi5jcm9wcGEtLWhhcy10YXJnZXRcclxuICAgICAgY3Vyc29yOiBtb3ZlXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICYuY3JvcHBhLS1kaXNhYmxlZC1telxyXG4gICAgICAgIGN1cnNvcjogZGVmYXVsdFxyXG4gICAgJi5jcm9wcGEtLWRpc2FibGVkXHJcbiAgICAgIGN1cnNvcjogbm90LWFsbG93ZWRcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGVcclxuICAgICAgYmFja2dyb3VuZDogd2hpdGVcclxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlXHJcbiAgICAgIGZpbHRlcjogZHJvcC1zaGFkb3coLTJweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC43KSlcclxuICAgICAgei1pbmRleDogMTBcclxuICAgICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlXHJcblxyXG48L3N0eWxlPlxyXG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiaW1wb3J0IGNvbXBvbmVudCBmcm9tICcuL2Nyb3BwZXIudnVlJ1xyXG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nXHJcblxyXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICBjb21wb25lbnROYW1lOiAnY3JvcHBhJ1xyXG59XHJcblxyXG5jb25zdCBWdWVDcm9wcGEgPSB7XHJcbiAgaW5zdGFsbDogZnVuY3Rpb24gKFZ1ZSwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IGFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpXHJcbiAgICBsZXQgdmVyc2lvbiA9IE51bWJlcihWdWUudmVyc2lvbi5zcGxpdCgnLicpWzBdKVxyXG4gICAgaWYgKHZlcnNpb24gPCAyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdnVlLWNyb3BwYSBzdXBwb3J0cyB2dWUgdmVyc2lvbiAyLjAgYW5kIGFib3ZlLiBZb3UgYXJlIHVzaW5nIFZ1ZUAke3ZlcnNpb259LiBQbGVhc2UgdXBncmFkZSB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgVnVlLmApXHJcbiAgICB9XHJcbiAgICBsZXQgY29tcG9uZW50TmFtZSA9IG9wdGlvbnMuY29tcG9uZW50TmFtZSB8fCAnY3JvcHBhJ1xyXG5cclxuICAgIC8vIHJlZ2lzdHJhdGlvblxyXG4gICAgVnVlLmNvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpXHJcbiAgfSxcclxuXHJcbiAgY29tcG9uZW50XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVnVlQ3JvcHBhIl0sIm5hbWVzIjpbImRlZmluZSIsInRoaXMiLCJwb2ludCIsInZtIiwiY2FudmFzIiwicXVhbGl0eSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsImxlZnQiLCJ0b3AiLCJldnQiLCJwb2ludGVyIiwidG91Y2hlcyIsImNoYW5nZWRUb3VjaGVzIiwib25lUG9pbnRDb29yZCIsInBvaW50ZXIxIiwicG9pbnRlcjIiLCJjb29yZDEiLCJjb29yZDIiLCJNYXRoIiwic3FydCIsInBvdyIsIngiLCJ5IiwiaW1nIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJkb2N1bWVudCIsIndpbmRvdyIsImxhc3RUaW1lIiwidmVuZG9ycyIsImxlbmd0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJjdXJyVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwidGltZVRvQ2FsbCIsIm1heCIsImlkIiwic2V0VGltZW91dCIsImFyZyIsImlzQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJIVE1MQ2FudmFzRWxlbWVudCIsImJpblN0ciIsImxlbiIsImFyciIsInRvQmxvYiIsImRlZmluZVByb3BlcnR5IiwidHlwZSIsImF0b2IiLCJ0b0RhdGFVUkwiLCJzcGxpdCIsIlVpbnQ4QXJyYXkiLCJpIiwiY2hhckNvZGVBdCIsIkJsb2IiLCJkdCIsImRhdGFUcmFuc2ZlciIsIm9yaWdpbmFsRXZlbnQiLCJ0eXBlcyIsImFycmF5QnVmZmVyIiwidmlldyIsIkRhdGFWaWV3IiwiZ2V0VWludDE2IiwiYnl0ZUxlbmd0aCIsIm9mZnNldCIsIm1hcmtlciIsImdldFVpbnQzMiIsImxpdHRsZSIsInRhZ3MiLCJiYXNlNjQiLCJyZXBsYWNlIiwiYmluYXJ5U3RyaW5nIiwiYnl0ZXMiLCJidWZmZXIiLCJvcmllbnRhdGlvbiIsIl9jYW52YXMiLCJDYW52YXNFeGlmT3JpZW50YXRpb24iLCJkcmF3SW1hZ2UiLCJfaW1nIiwiSW1hZ2UiLCJzcmMiLCJvcmkiLCJtYXAiLCJuIiwiaXNOYU4iLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJ2YWx1ZSIsImlzRmluaXRlIiwiZmxvb3IiLCJpbml0aWFsSW1hZ2VUeXBlIiwiU3RyaW5nIiwiSFRNTEltYWdlRWxlbWVudCIsInZhbCIsIkJvb2xlYW4iLCJ2YWxpZHMiLCJpbmRleE9mIiwidGVzdCIsIlBDVF9QRVJfWk9PTSIsIk1JTl9NU19QRVJfQ0xJQ0siLCJDTElDS19NT1ZFX1RIUkVTSE9MRCIsIk1JTl9XSURUSCIsIkRFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQIiwiUElOQ0hfQUNDRUxFUkFUSU9OIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJfaW5pdCIsInJBRlBvbHlmaWxsIiwidG9CbG9iUG9seWZpbGwiLCJzdXBwb3J0cyIsInN1cHBvcnREZXRlY3Rpb24iLCJiYXNpYyIsIndhcm4iLCJpbnN0YW5jZSIsInByZXZlbnRXaGl0ZVNwYWNlIiwiaW1hZ2VTZXQiLCJfc2V0U2l6ZSIsIl9wbGFjZUltYWdlIiwiX2RyYXciLCJjdHgiLCIkcmVmcyIsImZpbGVJbnB1dCIsImZpbGVzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsIm9sZFgiLCJpbWdEYXRhIiwic3RhcnRYIiwib2xkWSIsInN0YXJ0WSIsIl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlIiwiJGVtaXQiLCJldmVudHMiLCJNT1ZFX0VWRU5UIiwiYW1vdW50IiwibW92ZSIsInpvb21JbiIsInBvcyIsImlubmVyQWNjZWxlcmF0aW9uIiwicmVhbFNwZWVkIiwiem9vbVNwZWVkIiwic3BlZWQiLCJvbGRXaWR0aCIsIm9sZEhlaWdodCIsIl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSIsInRvRml4ZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIlpPT01fRVZFTlQiLCJzY2FsZVJhdGlvIiwiem9vbSIsInN0ZXAiLCJkaXNhYmxlUm90YXRpb24iLCJkaXNhYmxlZCIsInBhcnNlSW50IiwiX3JvdGF0ZUJ5U3RlcCIsIl9zZXQiLCIkbmV4dFRpY2siLCJtZXRhZGF0YSIsInVzZXJNZXRhZGF0YSIsImNvbXByZXNzaW9uUmF0ZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2VuZXJhdGVCbG9iIiwiYmxvYiIsImVyciIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJGaWxlIiwiRmlsZVJlYWRlciIsIkZpbGVMaXN0IiwiY2xpY2siLCJfcGFpbnRCYWNrZ3JvdW5kIiwiX3NldEltYWdlUGxhY2Vob2xkZXIiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImZvbnRTaXplIiwicmVhbFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiaGFkSW1hZ2UiLCJvcmlnaW5hbEltYWdlIiwiSU1BR0VfUkVNT1ZFX0VWRU5UIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImdldENvbnRleHQiLCJfc2V0SW5pdGlhbCIsIklOSVRfRVZFTlQiLCIkc2xvdHMiLCJ2Tm9kZSIsInRhZyIsImVsbSIsIm9uTG9hZCIsInUiLCJpbWFnZUxvYWRlZCIsIm9ubG9hZCIsImluaXRpYWwiLCJpbml0aWFsSW1hZ2UiLCJzZXRBdHRyaWJ1dGUiLCJiYWJlbEhlbHBlcnMudHlwZW9mIiwicmVtb3ZlIiwiX29ubG9hZCIsImRhdGFzZXQiLCJJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVCIsIm9uZXJyb3IiLCJkaXNhYmxlQ2xpY2tUb0Nob29zZSIsInN1cHBvcnRUb3VjaCIsImNob29zZUZpbGUiLCJpbnB1dCIsImZpbGUiLCJfb25OZXdGaWxlSW4iLCJGSUxFX0NIT09TRV9FVkVOVCIsIl9maWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiRXJyb3IiLCJmaWxlU2l6ZUxpbWl0IiwiX2ZpbGVUeXBlSXNWYWxpZCIsIkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCIsIm5hbWUiLCJ0b0xvd2VyQ2FzZSIsInBvcCIsImFjY2VwdCIsImZyIiwiZSIsImZpbGVEYXRhIiwidGFyZ2V0IiwicmVzdWx0IiwiZ2V0RmlsZU9yaWVudGF0aW9uIiwiYmFzZTY0VG9BcnJheUJ1ZmZlciIsIk5FV19JTUFHRSIsInJlYWRBc0RhdGFVUkwiLCJzaXplIiwiYmFzZU1pbWV0eXBlIiwidCIsInRyaW0iLCJjaGFyQXQiLCJzbGljZSIsImZpbGVCYXNlVHlwZSIsImFwcGx5TWV0YWRhdGEiLCJuYXR1cmFsSGVpZ2h0IiwibnVtYmVyVmFsaWQiLCJpbml0aWFsU2l6ZSIsIl9hc3BlY3RGaXQiLCJfbmF0dXJhbFNpemUiLCJfYXNwZWN0RmlsbCIsImluaXRpYWxQb3NpdGlvbiIsImV4ZWMiLCJfc2V0TWV0YWRhdGEiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsImltZ1JhdGlvIiwiY2FudmFzUmF0aW8iLCJwb2ludGVyTW92ZWQiLCJwb2ludGVyQ29vcmQiLCJnZXRQb2ludGVyQ29vcmRzIiwicG9pbnRlclN0YXJ0Q29vcmQiLCJ0YWJTdGFydCIsInZhbHVlT2YiLCJ3aGljaCIsImRyYWdnaW5nIiwicGluY2hpbmciLCJjb29yZCIsImxhc3RNb3ZpbmdDb29yZCIsImRpc2FibGVQaW5jaFRvWm9vbSIsInBpbmNoRGlzdGFuY2UiLCJnZXRQaW5jaERpc3RhbmNlIiwiY2FuY2VsRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9oYW5kbGVQb2ludGVyRW5kIiwicG9pbnRlck1vdmVEaXN0YW5jZSIsInRhYkVuZCIsImRpc2FibGVEcmFnVG9Nb3ZlIiwicHJldmVudERlZmF1bHQiLCJkaXN0YW5jZSIsImRlbHRhIiwiZGlzYWJsZVNjcm9sbFRvWm9vbSIsIndoZWVsRGVsdGEiLCJkZWx0YVkiLCJkZXRhaWwiLCJyZXZlcnNlU2Nyb2xsVG9ab29tIiwiZGlzYWJsZURyYWdBbmREcm9wIiwiZXZlbnRIYXNGaWxlIiwiZmlsZURyYWdnZWRPdmVyIiwiaXRlbXMiLCJpdGVtIiwia2luZCIsImdldEFzRmlsZSIsIl94IiwidXNlT3JpZ2luYWwiLCJnZXRSb3RhdGVkSW1hZ2UiLCJmbGlwWCIsImZsaXBZIiwicm90YXRlOTAiLCJjbGVhclJlY3QiLCJmaWxsUmVjdCIsIl9kcmF3RnJhbWUiLCJEUkFXIiwic2NhbGUiLCJkZWZhdWx0T3B0aW9ucyIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJhc3NpZ24iLCJ2ZXJzaW9uIiwiY29tcG9uZW50TmFtZSIs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
