function isMobile(userAgent: string) {
  const terms = [
    'mobi',
    'ipad',
    'iphone',
    'ipod',
    'silk',
    'gt-p1000',
    'nexus 7',
    'kindle fire',
    'opera mini',
  ];

  const lower = userAgent.toLowerCase();

  for (let i = 0, length = terms.length; i < length; i++) {
    if (lower.indexOf(terms[i]) !== -1) {
      return true;
    }
  }

  return false;
}

function hasKeyboard(browser: any) {
  if (browser.touch) {
    return true;
  }

  if (browser.xboxOne) {
    return true;
  }

  if (browser.ps4) {
    return true;
  }

  if (browser.edgeUwp) {
    // This is OK for now, but this won't always be true
    // Should we use this?
    // https://gist.github.com/wagonli/40d8a31bd0d6f0dd7a5d
    return true;
  }

  return !!browser.tv;
}

function iOSversion() {
  // MacIntel: Apple iPad Pro 11 iOS 13.1
  if (/iP(hone|od|ad)|MacIntel/.test(navigator.platform)) {
    const tests = [
      // Original test for getting full iOS version number in iOS 2.0+
      /OS (\d+)_(\d+)_?(\d+)?/,
      // Test for iPads running iOS 13+ that can only get the major OS version
      /Version\/(\d+)/,
    ];
    for (const test of tests) {
      const matches: any = navigator.appVersion.match(test);
      if (matches) {
        return [
          parseInt(matches[1], 10),
          parseInt(matches[2] || 0, 10),
          parseInt(matches[3] || 0, 10),
        ];
      }
    }
  }
  return [];
}

let _supportsCssAnimation: boolean;
let _supportsCssAnimationWithPrefix: boolean;
function supportsCssAnimation(allowPrefix: boolean) {
  // TODO: Assess if this is still needed, as all of our targets should natively support CSS animations.
  if (
    allowPrefix &&
    (_supportsCssAnimationWithPrefix === true ||
      _supportsCssAnimationWithPrefix === false)
  ) {
    return _supportsCssAnimationWithPrefix;
  }
  if (_supportsCssAnimation === true || _supportsCssAnimation === false) {
    return _supportsCssAnimation;
  }

  let animation = false;
  const domPrefixes = ['Webkit', 'O', 'Moz'];
  const elm = document.createElement('div');

  if (elm.style.animationName !== undefined) {
    animation = true;
  }

  if (animation === false && allowPrefix) {
    for (const domPrefix of domPrefixes) {
      if ((elm.style as any)[domPrefix + 'AnimationName'] !== undefined) {
        animation = true;
        break;
      }
    }
  }

  if (allowPrefix) {
    _supportsCssAnimationWithPrefix = animation;
    return _supportsCssAnimationWithPrefix;
  } else {
    _supportsCssAnimation = animation;
    return _supportsCssAnimation;
  }
}

const uaMatch = function (ua: string) {
  ua = ua.toLowerCase();

  ua = ua.replace(/(motorola edge)/, '').trim();

  const match =
    /(edg)[ /]([\w.]+)/.exec(ua) ||
    /(edga)[ /]([\w.]+)/.exec(ua) ||
    /(edgios)[ /]([\w.]+)/.exec(ua) ||
    /(edge)[ /]([\w.]+)/.exec(ua) ||
    /(opera)[ /]([\w.]+)/.exec(ua) ||
    /(opr)[ /]([\w.]+)/.exec(ua) ||
    /(chrome)[ /]([\w.]+)/.exec(ua) ||
    /(safari)[ /]([\w.]+)/.exec(ua) ||
    /(firefox)[ /]([\w.]+)/.exec(ua) ||
    (ua.indexOf('compatible') < 0 &&
      /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
    [];

  const versionMatch = /(version)[ /]([\w.]+)/.exec(ua);

  let browser = match[1] || '';

  let version;
  if (versionMatch && versionMatch.length > 2) {
    version = versionMatch[2];
  }

  version = version || match[2] || '0';

  let versionMajor = parseInt(version.split('.')[0], 10);

  if (isNaN(versionMajor)) {
    versionMajor = 0;
  }

  return {
    browser: browser,
    version: version,
    platform: '',
    versionMajor: versionMajor,
  };
};

const userAgent = 'chrome';
const matched = uaMatch(userAgent);
const browser: any = {};

if (matched.browser) {
  browser[matched.browser] = true;
  browser.version = matched.version;
  browser.versionMajor = matched.versionMajor;
}

if (matched.platform) {
  browser[matched.platform] = true;
}

browser.edgeChromium = browser.edg || browser.edga || browser.edgios;

if (
  !browser.chrome &&
  !browser.edgeChromium &&
  !browser.edge &&
  !browser.opera &&
  userAgent.toLowerCase().indexOf('webkit') !== -1
) {
  browser.safari = true;
}

browser.osx = userAgent.toLowerCase().indexOf('mac os x') !== -1;

// This is a workaround to detect iPads on iOS 13+ that report as desktop Safari
// This may break in the future if Apple releases a touchscreen Mac
// https://forums.developer.apple.com/thread/119186
if (
  browser.osx &&
  !browser.iphone &&
  !browser.ipod &&
  !browser.ipad &&
  navigator.maxTouchPoints > 1
) {
  browser.ipad = true;
}

if (userAgent.toLowerCase().indexOf('playstation 4') !== -1) {
  browser.ps4 = true;
  browser.tv = true;
}

if (isMobile(userAgent)) {
  browser.mobile = true;
}

if (userAgent.toLowerCase().indexOf('xbox') !== -1) {
  browser.xboxOne = true;
  browser.tv = true;
}
browser.animate =
  typeof document !== 'undefined' && document.documentElement.animate != null;
browser.hisense = userAgent.toLowerCase().includes('hisense');
browser.vidaa = userAgent.toLowerCase().includes('vidaa');
browser.edgeUwp =
  browser.edge &&
  (userAgent.toLowerCase().indexOf('msapphost') !== -1 ||
    userAgent.toLowerCase().indexOf('webview') !== -1);

browser.orsay = userAgent.toLowerCase().indexOf('smarthub') !== -1;

if (browser.edgeUwp) {
  browser.edge = true;
}

browser.tv = true;
browser.operaTv = browser.tv && userAgent.toLowerCase().indexOf('opr/') !== -1;

if (browser.mobile || browser.tv) {
  browser.slow = true;
}

browser.touch = false;

browser.keyboard = hasKeyboard(browser);
browser.supportsCssAnimation = supportsCssAnimation;

browser.iOS = browser.ipad || browser.iphone || browser.ipod;

if (browser.iOS) {
  browser.iOSVersion = iOSversion();

  if (browser.iOSVersion && browser.iOSVersion.length >= 2) {
    browser.iOSVersion = browser.iOSVersion[0] + browser.iOSVersion[1] / 10;
  }
}

export default browser;
