'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _randomGlobal = require('random-global');

var _randomGlobal2 = _interopRequireDefault(_randomGlobal);

var _randomString = require('random-string');

var _randomString2 = _interopRequireDefault(_randomString);

var _libCreatePlayer = require('../lib/createPlayer');

var _libCreatePlayer2 = _interopRequireDefault(_libCreatePlayer);

var _YouTube = require('../YouTube');

var _YouTube2 = _interopRequireDefault(_YouTube);

jest.dontMock('../YouTube');

var TestUtils = _reactAddons2['default'].addons.TestUtils;

var url = 'https://www.youtube.com/watch?v=tITYj52gXxU';
var url2 = 'https://www.youtube.com/watch?v=vW7qFzT7cbA';

window.YT = {
  PlayerState: {
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3
  }
};

var playerMock = {
  destroy: jest.genMockFunction(),
  addEventListener: jest.genMockFunction(),
  removeEventListener: jest.genMockFunction(),
  getIframe: jest.genMockFunction().mockImplementation(function () {
    return true;
  })
};

_libCreatePlayer2['default'].mockImplementation(function (id, props, cb) {
  return cb(playerMock);
});
_randomString2['default'].mockImplementation(function () {
  return 'random-id';
});

describe('YouTube Component', function () {
  afterEach(function () {
    _randomGlobal2['default'].mockClear();
    _libCreatePlayer2['default'].mockClear();
    playerMock.destroy.mockClear();
    playerMock.addEventListener.mockClear();
    playerMock.removeEventListener.mockClear();
    playerMock.getIframe.mockClear();
  });

  describe('rendering', function () {
    it('should render a YouTube API ready div', function () {
      var youtube = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_YouTube2['default'], { url: url }));
      var div = TestUtils.findRenderedDOMComponentWithTag(youtube, 'div').getDOMNode();
      expect(div.getAttribute('id')).toBe('random-id');
    });

    it('should render a YouTube API ready div with a custom id', function () {
      var youtube = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_YouTube2['default'], { url: url, id: 'custom-id' }));
      var div = TestUtils.findRenderedDOMComponentWithTag(youtube, 'div').getDOMNode();
      expect(div.getAttribute('id')).toBe('custom-id');
    });
  });

  describe('functionality', function () {
    var container = undefined;
    var youtube = undefined;
    var playSecondUrlBtn = undefined;

    var Container = (function (_React$Component) {
      _inherits(Container, _React$Component);

      function Container(props) {
        _classCallCheck(this, Container);

        _get(Object.getPrototypeOf(Container.prototype), 'constructor', this).call(this, props);
        this.state = { url: url };
        this.onPlaySecondUrl = this.onPlaySecondUrl.bind(this);
      }

      _createClass(Container, [{
        key: 'onPlaySecondUrl',
        value: function onPlaySecondUrl() {
          this.setState({ url: url2 });
        }
      }, {
        key: 'render',
        value: function render() {
          var opts = {
            height: '390',
            width: '640'
          };

          return _reactAddons2['default'].createElement(
            'div',
            null,
            _reactAddons2['default'].createElement(_YouTube2['default'], { url: this.state.url, opts: opts }),
            _reactAddons2['default'].createElement('button', { onClick: this.onPlaySecondUrl })
          );
        }
      }]);

      return Container;
    })(_reactAddons2['default'].Component);

    beforeEach(function () {
      container = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(Container, null));
      youtube = TestUtils.findRenderedComponentWithType(container, _YouTube2['default']);
      playSecondUrlBtn = TestUtils.findRenderedDOMComponentWithTag(container, 'button');

      youtube.onPlayerReady();
    });

    it('should load a url', function () {
      expect(_libCreatePlayer2['default'].mock.calls[0][1].url).toBe(url);
    });

    it('should load player options', function () {
      expect(_libCreatePlayer2['default'].mock.calls[0][1].opts).toEqual({
        height: '390',
        width: '640'
      });
    });

    it('should load a new url', function () {
      TestUtils.Simulate.click(playSecondUrlBtn);
      expect(_libCreatePlayer2['default'].mock.calls[1][1].url).toBe(url2);
    });

    it('should *only* load a new url', function () {
      // switch to url2
      TestUtils.Simulate.click(playSecondUrlBtn);
      expect(_libCreatePlayer2['default'].mock.calls.length).toBe(2);

      // calling it again wont do anything, already on url2
      TestUtils.Simulate.click(playSecondUrlBtn);
      expect(_libCreatePlayer2['default'].mock.calls.length).toBe(2);
    });
  });

  describe('events', function () {
    it('should attach player event handlers', function () {
      TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_YouTube2['default'], { url: url }));

      expect(_randomGlobal2['default'].mock.calls.length).toBe(3);
      expect(playerMock.addEventListener.mock.calls.length).toBe(3);
    });

    it('should respond to player events', function () {
      var onReady = jest.genMockFunction();
      var onError = jest.genMockFunction();
      var onPlay = jest.genMockFunction();
      var onPause = jest.genMockFunction();
      var onEnd = jest.genMockFunction();

      var readyEvent = { data: null, target: playerMock };
      var errorEvent = { data: 101, target: playerMock };
      var playedEvent = { data: window.YT.PlayerState.PLAYING, target: playerMock };
      var pausedEvent = { data: window.YT.PlayerState.PAUSED, target: playerMock };
      var endedEvent = { data: window.YT.PlayerState.ENDED, target: playerMock };

      var youtube = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_YouTube2['default'], {
        url: url,
        onReady: onReady,
        onError: onError,
        onPlay: onPlay,
        onPause: onPause,
        onEnd: onEnd
      }));

      // video ready
      youtube.onPlayerReady(readyEvent);
      expect(onReady).toBeCalledWith(readyEvent);

      // video error
      youtube.onPlayerError(errorEvent);
      expect(onError).toBeCalledWith(errorEvent);

      // video playing
      youtube.onPlayerStateChange(playedEvent);
      expect(onPlay).toBeCalledWith(playedEvent);

      // video paused
      youtube.onPlayerStateChange(pausedEvent);
      expect(onPause).toBeCalledWith(pausedEvent);

      // video ended
      youtube.onPlayerStateChange(endedEvent);
      expect(onEnd).toBeCalledWith(endedEvent);
    });
  });

  describe('unmounting', function () {
    var youtube = undefined;

    beforeEach(function () {
      // create a fake global event handler to be used within the component
      window.fakeHandler = 'this is a fake event handler.';
      _randomGlobal2['default'].mockReturnValue('fakeHandler');

      youtube = TestUtils.renderIntoDocument(_reactAddons2['default'].createElement(_YouTube2['default'], { url: url }));
      _reactAddons2['default'].unmountComponentAtNode(_reactAddons2['default'].findDOMNode(youtube).parentNode);
    });

    it('should destroy event handlers', function () {
      expect(playerMock.removeEventListener.mock.calls.length).toBe(3);
      expect(youtube._playerReadyHandle).not.toBeDefined();
      expect(youtube._playerErrorHandle).not.toBeDefined();
      expect(youtube._stateChangeHandle).not.toBeDefined();
    });

    it('should destroy the player', function () {
      expect(playerMock.destroy.mock.calls.length).toBe(1);
    });
  });
});