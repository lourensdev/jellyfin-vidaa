import browser from './browser';
import appSettings from '../settings/appSettings';
import * as userSettings from '../settings/userSettings';
import * as htmlMediaHelper from './htmlMediaHelper';

interface DirectPlayProfile {
  Container: string;
  Type: string;
  VideoCodec?: string;
  AudioCodec?: string;
}

interface TranscodingProfile {
  Container: string;
  Type: string;
  AudioCodec: string;
  Context: string;
  Protocol: string;
  MaxAudioChannels: string;
  MinSegments?: string;
  BreakOnNonKeyFrames?: any;
}

interface Conditions {
  Condition: string;
  Property: string;
  Value: string;
  IsRequired?: boolean;
}

interface CodecProfile {
  Type: string;
  Container?: string;
  Codec?: string;
  Conditions: Conditions[];
}

interface SubtitleProfiles {
  Format: string;
  Method: string;
}

interface ResponseProfiles {
  Type: string;
  Container: string;
  MimeType: string;
}

export interface Profile {
  MaxStreamingBitrate: number;
  MaxStaticBitrate: number;
  MusicStreamingTranscodingBitrate: number;
  DirectPlayProfiles: DirectPlayProfile[];
  TranscodingProfiles?: TranscodingProfile[] | any;
  ContainerProfiles?: any[];
  CodecProfiles?: CodecProfile[];
  SubtitleProfiles?: SubtitleProfiles[];
  ResponseProfiles?: ResponseProfiles[];
}

function canPlayH264(videoTestElement: HTMLVideoElement) {
  return !!videoTestElement
    .canPlayType?.('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
    .replace(/no/, '');
}

function canPlayHevc(videoTestElement: HTMLVideoElement, options: any) {
  if (
    browser.tizen ||
    browser.xboxOne ||
    browser.web0s ||
    options.supportsHevc
  ) {
    return true;
  }

  if (browser.ps4) {
    return false;
  }

  // hevc main level 4.0
  return (
    !!videoTestElement.canPlayType &&
    (videoTestElement
      .canPlayType('video/mp4; codecs="hvc1.1.L120"')
      .replace(/no/, '') ||
      videoTestElement
        .canPlayType('video/mp4; codecs="hev1.1.L120"')
        .replace(/no/, '') ||
      videoTestElement
        .canPlayType('video/mp4; codecs="hvc1.1.0.L120"')
        .replace(/no/, '') ||
      videoTestElement
        .canPlayType('video/mp4; codecs="hev1.1.0.L120"')
        .replace(/no/, ''))
  );
}

function canPlayAv1(videoTestElement: HTMLVideoElement) {
  if (browser.tizenVersion >= 5.5 || browser.web0sVersion >= 5) {
    return true;
  }

  // av1 main level 5.3
  return (
    !!videoTestElement.canPlayType &&
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.15M.08"')
      .replace(/no/, '') &&
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.15M.10"')
      .replace(/no/, '')
  );
}

let _supportsTextTracks: boolean;
function supportsTextTracks() {
  if (browser.tizen) {
    return true;
  }

  if (_supportsTextTracks == null) {
    _supportsTextTracks = document.createElement('video').textTracks != null;
  }

  // For now, until ready
  return _supportsTextTracks;
}

let _canPlayHls: boolean;
function canPlayHls() {
  if (_canPlayHls == null) {
    _canPlayHls = canPlayNativeHls() || canPlayHlsWithMSE();
  }

  return _canPlayHls;
}

function canPlayNativeHls() {
  if (browser.tizen) {
    return true;
  }

  const media = document.createElement('video');
  return !!(
    media.canPlayType('application/x-mpegURL').replace(/no/, '') ||
    media.canPlayType('application/vnd.apple.mpegURL').replace(/no/, '')
  );
}

function canPlayNativeHlsInFmp4() {
  if (browser.tizenVersion >= 5 || browser.web0sVersion >= 3.5) {
    return true;
  }

  return (browser.iOS && browser.iOSVersion >= 11) || browser.osx;
}

function canPlayHlsWithMSE() {
  // text tracks don’t work with this in firefox
  return window.MediaSource != null;
}

function supportsAc3(videoTestElement: HTMLVideoElement) {
  if (browser.edgeUwp || browser.tizen || browser.web0s) {
    return true;
  }

  // iPhones 5c and older and old model iPads do not support AC-3/E-AC-3
  // These models can only run iOS 10.x or lower
  if (browser.iOS && browser.iOSVersion < 11) {
    return false;
  }

  return videoTestElement
    .canPlayType('audio/mp4; codecs="ac-3"')
    .replace(/no/, '');
}

/**
 * Checks if the device supports DTS (DCA).
 * @param {HTMLVideoElement} videoTestElement The video test element
 * @returns {boolean|null} _true_ if the device supports DTS (DCA). _false_ if the device doesn't support DTS (DCA). _null_ if support status is unknown.
 */
function canPlayDts(videoTestElement: HTMLVideoElement) {
  // DTS audio is not supported by Samsung TV 2018+ (Tizen 4.0+) and LG TV 2020-2022 (webOS 5.0, 6.0 and 22) models
  if (
    browser.tizenVersion >= 4 ||
    (browser.web0sVersion >= 5 && browser.web0sVersion < 23)
  ) {
    return false;
  }

  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="dts-"')
      .replace(/no/, '') ||
    videoTestElement.canPlayType('video/mp4; codecs="dts+"').replace(/no/, '')
  ) {
    return true;
  }

  return null;
}

function supportsEac3(videoTestElement: HTMLVideoElement) {
  if (browser.tizen || browser.web0s) {
    return true;
  }

  // iPhones 5c and older and old model iPads do not support AC-3/E-AC-3
  // These models can only run iOS 10.x or lower
  if (browser.iOS && browser.iOSVersion < 11) {
    return false;
  }

  return videoTestElement
    .canPlayType('audio/mp4; codecs="ec-3"')
    .replace(/no/, '');
}

function supportsAc3InHls(videoTestElement: HTMLVideoElement) {
  if (browser.tizen || browser.web0s) {
    return true;
  }

  if (videoTestElement.canPlayType) {
    return (
      videoTestElement
        .canPlayType('application/x-mpegurl; codecs="avc1.42E01E, ac-3"')
        .replace(/no/, '') ||
      videoTestElement
        .canPlayType(
          'application/vnd.apple.mpegURL; codecs="avc1.42E01E, ac-3"',
        )
        .replace(/no/, '')
    );
  }

  return false;
}

function supportsMp3InHls(videoTestElement: HTMLVideoElement) {
  if (videoTestElement.canPlayType) {
    return (
      videoTestElement
        .canPlayType('application/x-mpegurl; codecs="avc1.64001E, mp4a.40.34"')
        .replace(/no/, '') ||
      videoTestElement
        .canPlayType(
          'application/vnd.apple.mpegURL; codecs="avc1.64001E, mp4a.40.34"',
        )
        .replace(/no/, '')
    );
  }

  return false;
}

function canPlayAudioFormat(format: string) {
  let typeString;

  if (format === 'flac' || format === 'asf') {
    if (browser.tizen || browser.web0s || browser.edgeUwp) {
      return true;
    }
  } else if (format === 'wma') {
    if (browser.tizen || browser.edgeUwp) {
      return true;
    }
  } else if (format === 'opus') {
    if (browser.web0s) {
      // canPlayType lies about OPUS support
      return browser.web0sVersion >= 3.5;
    }

    typeString = 'audio/ogg; codecs="opus"';
  } else if (format === 'alac') {
    if (browser.iOS || (browser.osx && browser.safari)) {
      return true;
    }
  } else if (format === 'mp2') {
    // For now
    return false;
  }

  if (format === 'webma') {
    typeString = 'audio/webm';
  } else if (format === 'mp2') {
    typeString = 'audio/mpeg';
  } else if (!typeString) {
    typeString = 'audio/' + format;
  }

  return !!document
    .createElement('audio')
    .canPlayType(typeString)
    .replace(/no/, '');
}

function testCanPlayMkv(videoTestElement: HTMLVideoElement) {
  if (browser.vidaa) {
    return false;
  }

  if (browser.tizen || browser.web0s) {
    return true;
  }

  if (
    videoTestElement.canPlayType('video/x-matroska').replace(/no/, '') ||
    videoTestElement.canPlayType('video/mkv').replace(/no/, '')
  ) {
    return true;
  }

  if (browser.edgeChromium && browser.windows) {
    return true;
  }

  return !!browser.edgeUwp;
}

function testCanPlayTs() {
  return browser.tizen || browser.web0s || browser.edgeUwp;
}

function supportsMpeg2Video() {
  return browser.tizen || browser.web0s || browser.edgeUwp;
}

function supportsVc1(videoTestElement: HTMLVideoElement) {
  return (
    browser.tizen ||
    browser.web0s ||
    browser.edgeUwp ||
    videoTestElement.canPlayType('video/mp4; codecs="vc-1"').replace(/no/, '')
  );
}

function supportsDolbyVision(options: any) {
  return (
    options.supportsDolbyVision ??
    (false ||
      (browser.safari &&
        ((browser.iOS && browser.iOSVersion >= 13) || browser.osx)))
  );
}

function supportedDolbyVisionProfilesHevc(videoTestElement: HTMLVideoElement) {
  const supportedProfiles = [];
  // Profiles 5/8 4k@60fps
  if (videoTestElement.canPlayType) {
    if (
      videoTestElement
        .canPlayType('video/mp4; codecs="dvh1.05.09"')
        .replace(/no/, '')
    ) {
      supportedProfiles.push(5);
    }
    if (
      videoTestElement
        .canPlayType('video/mp4; codecs="dvh1.08.09"')
        .replace(/no/, '')
    ) {
      supportedProfiles.push(8);
    }
  }
  return supportedProfiles;
}

function getDirectPlayProfileForVideoContainer(
  container: string,
  videoAudioCodecs: string[],
  videoTestElement: HTMLVideoElement,
  options: any,
) {
  let supported = false;
  let profileContainer = container;
  const videoCodecs = [];

  switch (container) {
    case 'asf':
    case 'wmv':
      supported = browser.tizen || browser.web0s || browser.edgeUwp;
      videoAudioCodecs = [];
      break;
    case 'avi':
      supported = browser.tizen || browser.web0s || browser.edgeUwp;
      // New Samsung TV don't support XviD/DivX
      // Explicitly add supported codecs to make other codecs be transcoded
      if (browser.tizenVersion >= 4) {
        videoCodecs.push('h264');
        if (canPlayHevc(videoTestElement, options)) {
          videoCodecs.push('hevc');
        }
      }
      break;
    case 'mpg':
    case 'mpeg':
      supported = browser.tizen || browser.web0s || browser.edgeUwp;
      break;
    case 'flv':
      supported = browser.tizen;
      break;
    case '3gp':
    case 'mts':
    case 'trp':
    case 'vob':
    case 'vro':
      supported = browser.tizen;
      break;
    case 'mov':
      supported =
        browser.safari ||
        browser.tizen ||
        browser.web0s ||
        browser.chrome ||
        browser.edgeChromium ||
        browser.edgeUwp;
      videoCodecs.push('h264');
      break;
    case 'm2ts':
      supported = browser.tizen || browser.web0s || browser.edgeUwp;
      videoCodecs.push('h264');
      if (supportsVc1(videoTestElement)) {
        videoCodecs.push('vc1');
      }
      if (supportsMpeg2Video()) {
        videoCodecs.push('mpeg2video');
      }
      break;
    case 'ts':
      supported = testCanPlayTs();
      videoCodecs.push('h264');
      // safari doesn't support hevc in TS-HLS
      if (
        (browser.tizen || browser.web0s) &&
        canPlayHevc(videoTestElement, options)
      ) {
        videoCodecs.push('hevc');
      }
      if (supportsVc1(videoTestElement)) {
        videoCodecs.push('vc1');
      }
      if (supportsMpeg2Video()) {
        videoCodecs.push('mpeg2video');
      }
      profileContainer = 'ts,mpegts';
      break;
    default:
      break;
  }

  return supported
    ? {
        Container: profileContainer,
        Type: 'Video',
        VideoCodec: videoCodecs.join(','),
        AudioCodec: videoAudioCodecs.join(','),
      }
    : null;
}

function getMaxBitrate() {
  return 120000000;
}

let maxChannelCount: any = null;

function getSpeakerCount() {
  if (maxChannelCount != null) {
    return maxChannelCount;
  }

  maxChannelCount = -1;

  const AudioContext =
    window.AudioContext ||
    (window as any).webkitAudioContext ||
    false;

  if (AudioContext) {
    const audioCtx = new AudioContext();

    maxChannelCount = audioCtx.destination.maxChannelCount;
  }

  return maxChannelCount;
}

function getPhysicalAudioChannels(
  options: any,
  videoTestElement: HTMLVideoElement,
) {
  const allowedAudioChannels = parseInt(
    userSettings.allowedAudioChannels(),
    10,
  );

  if (allowedAudioChannels > 0) {
    return allowedAudioChannels;
  }

  if (options.audioChannels) {
    return options.audioChannels;
  }

  const isSurroundSoundSupportedBrowser =
    browser.safari ||
    browser.chrome ||
    browser.edgeChromium ||
    browser.firefox ||
    browser.tv ||
    browser.ps4 ||
    browser.xboxOne;
  const isAc3Eac3Supported =
    supportsAc3(videoTestElement) || supportsEac3(videoTestElement);
  const speakerCount = getSpeakerCount();

  // AC3/EAC3 hinted that device is able to play dolby surround sound.
  if (isAc3Eac3Supported && isSurroundSoundSupportedBrowser) {
    return speakerCount > 6 ? speakerCount : 6;
  }

  if (speakerCount > 2) {
    if (isSurroundSoundSupportedBrowser) {
      return speakerCount;
    }

    return 2;
  }

  if (speakerCount > 0) {
    return speakerCount;
  }

  if (isSurroundSoundSupportedBrowser) {
    return 6;
  }

  return 2;
}

/**
 * Checks if the web engine supports secondary audio.
 * @param {HTMLVideoElement} videoTestElement The video test element
 * @returns {boolean} _true_ if the web engine supports secondary audio.
 */
export function canPlaySecondaryAudio(videoTestElement: any) {
  // We rely on HTMLMediaElement.audioTracks
  // It works in Chrome 79+ with "Experimental Web Platform features" enabled
  return (
    !!videoTestElement.audioTracks &&
    // It doesn't work in Firefox 108 even with "media.track.enabled" enabled (it only sees the first audio track)
    !browser.firefox &&
    // It seems to work on Tizen 5.5+ (2020, Chrome 69+). See https://developer.tizen.org/forums/web-application-development/video-tag-not-work-audiotracks
    (browser.tizenVersion >= 5.5 || !browser.tizen) &&
    (browser.web0sVersion >= 4.0 || !browser.web0sVersion)
  );
}

function profileBuilder(videoTestElement: HTMLVideoElement, options: any) {
  options = options || {};

  const bitrateSetting = getMaxBitrate();

  const physicalAudioChannels = getPhysicalAudioChannels(
    options,
    videoTestElement,
  );

  const canPlayVp8 = videoTestElement
    .canPlayType('video/webm; codecs="vp8"')
    .replace(/no/, '');
  const canPlayVp9 = videoTestElement
    .canPlayType('video/webm; codecs="vp9"')
    .replace(/no/, '');
  const webmAudioCodecs = ['vorbis'];

  const canPlayMkv = testCanPlayMkv(videoTestElement);

  const profile: Profile = {
    MaxStreamingBitrate: bitrateSetting,
    MaxStaticBitrate: 100000000,
    MusicStreamingTranscodingBitrate: Math.min(bitrateSetting, 384000),
    DirectPlayProfiles: [],
  };

  let videoAudioCodecs = [];
  let hlsInTsVideoAudioCodecs = [];
  let hlsInFmp4VideoAudioCodecs = [];

  const supportsMp3VideoAudio =
    videoTestElement
      .canPlayType('video/mp4; codecs="avc1.640029, mp4a.69"')
      .replace(/no/, '') ||
    videoTestElement
      .canPlayType('video/mp4; codecs="avc1.640029, mp4a.6B"')
      .replace(/no/, '') ||
    videoTestElement
      .canPlayType('video/mp4; codecs="avc1.640029, mp3"')
      .replace(/no/, '');

  let supportsMp2VideoAudio = options.supportsMp2VideoAudio;
  if (supportsMp2VideoAudio == null) {
    supportsMp2VideoAudio = browser.edgeUwp || browser.tizen || browser.web0s;

    // If the browser supports MP3, it presumably supports MP2 as well
    if (
      supportsMp3VideoAudio &&
      (browser.chrome ||
        browser.edgeChromium ||
        (browser.firefox && browser.versionMajor >= 83))
    ) {
      supportsMp2VideoAudio = true;
    }
    if (browser.android) {
      supportsMp2VideoAudio = false;
    }
  }

  let maxVideoWidth = browser.xboxOne ? window.screen?.width : null;

  if (options.maxVideoWidth) {
    maxVideoWidth = options.maxVideoWidth;
  }

  const canPlayAacVideoAudio = videoTestElement
    .canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"')
    .replace(/no/, '');
  const canPlayMp3VideoAudioInHls = supportsMp3InHls(videoTestElement);
  const canPlayAc3VideoAudio = supportsAc3(videoTestElement);
  const canPlayEac3VideoAudio = supportsEac3(videoTestElement);
  const canPlayAc3VideoAudioInHls = supportsAc3InHls(videoTestElement);

  // Transcoding codec is the first in hlsVideoAudioCodecs.
  // Prefer AAC, MP3 to other codecs when audio transcoding.
  if (canPlayAacVideoAudio) {
    videoAudioCodecs.push('aac');
    hlsInTsVideoAudioCodecs.push('aac');
    hlsInFmp4VideoAudioCodecs.push('aac');
  }

  if (supportsMp3VideoAudio) {
    videoAudioCodecs.push('mp3');
  }

  // Safari supports mp3 with HLS, but only in mpegts container, and the supportsMp3VideoAudio will return false.
  if (browser.safari || (supportsMp3VideoAudio && !browser.ps4)) {
    hlsInTsVideoAudioCodecs.push('mp3');
  }

  // Most browsers won't support mp3 with HLS, so this is usually false, but just in case.
  if (canPlayMp3VideoAudioInHls) {
    hlsInFmp4VideoAudioCodecs.push('mp3');
  }

  // For AC3/EAC3 remuxing.
  // Do not use AC3 for audio transcoding unless AAC and MP3 are not supported.
  if (canPlayAc3VideoAudio) {
    videoAudioCodecs.push('ac3');
    if (browser.edgeChromium) {
      hlsInFmp4VideoAudioCodecs.push('ac3');
    }

    if (canPlayEac3VideoAudio) {
      videoAudioCodecs.push('eac3');
      if (browser.edgeChromium) {
        hlsInFmp4VideoAudioCodecs.push('eac3');
      }
    }

    if (canPlayAc3VideoAudioInHls) {
      hlsInTsVideoAudioCodecs.push('ac3');
      hlsInFmp4VideoAudioCodecs.push('ac3');

      if (canPlayEac3VideoAudio) {
        hlsInTsVideoAudioCodecs.push('eac3');
        hlsInFmp4VideoAudioCodecs.push('eac3');
      }
    }
  }

  videoAudioCodecs.push('mp2');
  hlsInTsVideoAudioCodecs.push('mp2');
  hlsInFmp4VideoAudioCodecs.push('mp2');

  let supportsDts = appSettings.enableDts() || options.supportsDts;
  if (supportsDts == null) {
    supportsDts = canPlayDts(videoTestElement);
  }

  if (supportsDts) {
    videoAudioCodecs.push('dca');
    videoAudioCodecs.push('dts');
  }

  if (browser.tizen || browser.web0s) {
    videoAudioCodecs.push('pcm_s16le');
    videoAudioCodecs.push('pcm_s24le');
  }

  if (appSettings.enableTrueHd() || options.supportsTrueHd) {
    videoAudioCodecs.push('truehd');
  }

  if (browser.tizen) {
    videoAudioCodecs.push('aac_latm');
  }

  if (canPlayAudioFormat('opus')) {
    videoAudioCodecs.push('opus');
    webmAudioCodecs.push('opus');
    if (browser.tizen) {
      hlsInTsVideoAudioCodecs.push('opus');
    }
    if (!browser.safari) {
      hlsInFmp4VideoAudioCodecs.push('opus');
    }
  }

  // FLAC audio in video plays with a delay on Tizen
  if (canPlayAudioFormat('flac') && !browser.tizen) {
    videoAudioCodecs.push('flac');
    hlsInFmp4VideoAudioCodecs.push('flac');
  }

  if (canPlayAudioFormat('alac')) {
    videoAudioCodecs.push('alac');
    hlsInFmp4VideoAudioCodecs.push('alac');
  }

  videoAudioCodecs = videoAudioCodecs.filter(function (c) {
    return (options.disableVideoAudioCodecs || []).indexOf(c) === -1;
  });

  hlsInTsVideoAudioCodecs = hlsInTsVideoAudioCodecs.filter(function (c) {
    return (options.disableHlsVideoAudioCodecs || []).indexOf(c) === -1;
  });

  hlsInFmp4VideoAudioCodecs = hlsInFmp4VideoAudioCodecs.filter(function (c) {
    return (options.disableHlsVideoAudioCodecs || []).indexOf(c) === -1;
  });

  const mp4VideoCodecs = [];
  const webmVideoCodecs = [];
  const hlsInTsVideoCodecs = [];
  const hlsInFmp4VideoCodecs = [];

  if (canPlayAv1(videoTestElement) && browser.chrome) {
    // disable av1 on non-safari mobile browsers since it can be very slow software decoding
    hlsInFmp4VideoCodecs.push('av1');
  }

  if (canPlayHevc(videoTestElement, options) && browser.chrome) {
    // Chromium used to support HEVC on Android but not via MSE
    hlsInFmp4VideoCodecs.push('hevc');
  }

  if (canPlayH264(videoTestElement)) {
    mp4VideoCodecs.push('h264');
    hlsInTsVideoCodecs.push('h264');
    hlsInFmp4VideoCodecs.push('h264');
  }

  if (canPlayHevc(videoTestElement, options)) {
    mp4VideoCodecs.push('hevc');
    if (browser.tizen || browser.web0s || browser.vidaa) {
      hlsInTsVideoCodecs.push('hevc');
    }
  }

  if (supportsMpeg2Video()) {
    mp4VideoCodecs.push('mpeg2video');
  }

  if (supportsVc1(videoTestElement)) {
    mp4VideoCodecs.push('vc1');
  }

  if (browser.tizen) {
    mp4VideoCodecs.push('msmpeg4v2');
  }

  if (canPlayVp8) {
    webmVideoCodecs.push('vp8');
  }

  if (canPlayVp9) {
    mp4VideoCodecs.push('vp9');
    // webm support is unreliable on safari 17
    if (
      !browser.safari ||
      (browser.safari &&
        browser.versionMajor >= 15 &&
        browser.versionMajor < 17)
    ) {
      webmVideoCodecs.push('vp9');
    }
  }

  if (canPlayAv1(videoTestElement)) {
    mp4VideoCodecs.push('av1');
    // webm support is unreliable on safari 17
    if (
      !browser.safari ||
      (browser.safari &&
        browser.versionMajor >= 15 &&
        browser.versionMajor < 17)
    ) {
      webmVideoCodecs.push('av1');
    }
  }

  if (canPlayVp8 || browser.tizen) {
    videoAudioCodecs.push('vorbis');
  }

  if (webmVideoCodecs.length) {
    profile.DirectPlayProfiles.push({
      Container: 'webm',
      Type: 'Video',
      VideoCodec: webmVideoCodecs.join(','),
      AudioCodec: webmAudioCodecs.join(','),
    });
  }

  if (mp4VideoCodecs.length) {
    profile.DirectPlayProfiles.push({
      Container: 'mp4,m4v',
      Type: 'Video',
      VideoCodec: mp4VideoCodecs.join(','),
      AudioCodec: videoAudioCodecs.join(','),
    });
  }

  if (canPlayMkv && mp4VideoCodecs.length) {
    profile.DirectPlayProfiles.push({
      Container: 'mkv',
      Type: 'Video',
      VideoCodec: mp4VideoCodecs.join(','),
      AudioCodec: videoAudioCodecs.join(','),
    });
  }

  // These are formats we can't test for but some devices will support
  [
    'm2ts',
    'wmv',
    'ts',
    'asf',
    'avi',
    'mpg',
    'mpeg',
    'flv',
    '3gp',
    'mts',
    'trp',
    'vob',
    'vro',
    'mov',
  ]
    .map(function (container) {
      return getDirectPlayProfileForVideoContainer(
        container,
        videoAudioCodecs,
        videoTestElement,
        options,
      );
    })
    .filter(function (i) {
      return i != null;
    })
    .forEach(function (i) {
      profile.DirectPlayProfiles.push(i);
    });

  [
    'opus',
    'mp3',
    'mp2',
    'aac',
    'flac',
    'alac',
    'webma',
    'wma',
    'wav',
    'ogg',
    'oga',
  ]
    .filter(canPlayAudioFormat)
    .forEach(function (audioFormat) {
      profile.DirectPlayProfiles.push({
        Container: audioFormat,
        Type: 'Audio',
      });

      // https://www.webmproject.org/about/faq/
      if (audioFormat === 'opus' || audioFormat === 'webma') {
        profile.DirectPlayProfiles.push({
          Container: 'webm',
          AudioCodec: audioFormat,
          Type: 'Audio',
        });
      }

      // aac also appears in the m4a and m4b container
      // m4a/alac only works when using safari
      if (audioFormat === 'aac' || audioFormat === 'alac') {
        profile.DirectPlayProfiles.push({
          Container: 'm4a',
          AudioCodec: audioFormat,
          Type: 'Audio',
        });

        profile.DirectPlayProfiles.push({
          Container: 'm4b',
          AudioCodec: audioFormat,
          Type: 'Audio',
        });
      }
    });

  profile.TranscodingProfiles = [];

  const hlsBreakOnNonKeyFrames =
    browser.iOS || browser.osx || browser.edge || !canPlayNativeHls();
  let enableFmp4Hls = userSettings.preferFmp4HlsContainer();
  if (
    (browser.safari || browser.tizen || browser.web0s) &&
    !canPlayNativeHlsInFmp4()
  ) {
    enableFmp4Hls = false;
  }

  if (canPlayHls()) {
    profile.TranscodingProfiles.push({
      Container: 'mp4',
      Type: 'Audio',
      AudioCodec: 'aac',
      Context: 'Streaming',
      Protocol: 'hls',
      MaxAudioChannels: physicalAudioChannels.toString(),
      MinSegments: '2',
      BreakOnNonKeyFrames: hlsBreakOnNonKeyFrames,
    });
  }

  // For streaming, prioritize opus transcoding after mp3/aac. It is too problematic with random failures
  // But for static (offline sync), it will be just fine.
  // Prioritize aac higher because the encoder can accept more channels than mp3
  ['aac', 'mp3', 'opus', 'wav']
    .filter(canPlayAudioFormat)
    .forEach(function (audioFormat) {
      profile.TranscodingProfiles.push({
        Container: audioFormat,
        Type: 'Audio',
        AudioCodec: audioFormat,
        Context: 'Streaming',
        Protocol: 'http',
        MaxAudioChannels: physicalAudioChannels.toString(),
      });
    });

  ['opus', 'mp3', 'aac', 'wav']
    .filter(canPlayAudioFormat)
    .forEach(function (audioFormat) {
      profile.TranscodingProfiles.push({
        Container: audioFormat,
        Type: 'Audio',
        AudioCodec: audioFormat,
        Context: 'Static',
        Protocol: 'http',
        MaxAudioChannels: physicalAudioChannels.toString(),
      });
    });

  if (canPlayHls() && options.enableHls !== false) {
    if (hlsInFmp4VideoCodecs.length && hlsInFmp4VideoAudioCodecs.length) {
      // HACK: Since there is no filter for TS/MP4 in the API, specify HLS support in general and rely on retry after DirectPlay error
      // FIXME: Need support for {Container: 'mp4', Protocol: 'hls'} or {Container: 'hls', SubContainer: 'mp4'}
      profile.DirectPlayProfiles.push({
        Container: 'hls',
        Type: 'Video',
        VideoCodec: hlsInFmp4VideoCodecs.join(','),
        AudioCodec: hlsInFmp4VideoAudioCodecs.join(','),
      });

      profile.TranscodingProfiles.push({
        Container: 'mp4',
        Type: 'Video',
        AudioCodec: hlsInFmp4VideoAudioCodecs.join(','),
        VideoCodec: hlsInFmp4VideoCodecs.join(','),
        Context: 'Streaming',
        Protocol: 'hls',
        MaxAudioChannels: physicalAudioChannels.toString(),
        MinSegments: browser.iOS || browser.osx ? '2' : '1',
        BreakOnNonKeyFrames: hlsBreakOnNonKeyFrames,
      });
    }

    if (hlsInTsVideoCodecs.length && hlsInTsVideoAudioCodecs.length) {
      // HACK: Since there is no filter for TS/MP4 in the API, specify HLS support in general and rely on retry after DirectPlay error
      // FIXME: Need support for {Container: 'ts', Protocol: 'hls'} or {Container: 'hls', SubContainer: 'ts'}
      profile.DirectPlayProfiles.push({
        Container: 'hls',
        Type: 'Video',
        VideoCodec: hlsInTsVideoCodecs.join(','),
        AudioCodec: hlsInTsVideoAudioCodecs.join(','),
      });

      profile.TranscodingProfiles.push({
        Container: 'ts',
        Type: 'Video',
        AudioCodec: hlsInTsVideoAudioCodecs.join(','),
        VideoCodec: hlsInTsVideoCodecs.join(','),
        Context: 'Streaming',
        Protocol: 'hls',
        MaxAudioChannels: physicalAudioChannels.toString(),
        MinSegments: '2',
        BreakOnNonKeyFrames: hlsBreakOnNonKeyFrames,
      });
    }
  }

  profile.ContainerProfiles = [];

  profile.CodecProfiles = [];

  const supportsSecondaryAudio = canPlaySecondaryAudio(videoTestElement);

  const aacCodecProfileConditions: Conditions[] = [];

  // Handle he-aac not supported
  if (
    !videoTestElement
      .canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.5"')
      .replace(/no/, '')
  ) {
    // TODO: This needs to become part of the stream url in order to prevent stream copy
    aacCodecProfileConditions.push({
      Condition: 'NotEquals',
      Property: 'AudioProfile',
      Value: 'HE-AAC',
    });
  }

  if (!supportsSecondaryAudio) {
    aacCodecProfileConditions.push({
      Condition: 'Equals',
      Property: 'IsSecondaryAudio',
      Value: 'false',
      IsRequired: false,
    });
  }

  if (aacCodecProfileConditions.length) {
    profile.CodecProfiles.push({
      Type: 'VideoAudio',
      Codec: 'aac',
      Conditions: aacCodecProfileConditions,
    });
  }

  if (!supportsSecondaryAudio) {
    profile.CodecProfiles.push({
      Type: 'VideoAudio',
      Conditions: [
        {
          Condition: 'Equals',
          Property: 'IsSecondaryAudio',
          Value: 'false',
          IsRequired: false,
        },
      ],
    });
  }

  if (browser.web0s) {
    const flacConditions = [
      // webOS doesn't seem to support FLAC with more than 2 channels
      {
        Condition: 'LessThanEqual',
        Property: 'AudioChannels',
        Value: '2',
        IsRequired: false,
      },
    ];

    profile.CodecProfiles.push({
      Type: 'VideoAudio',
      Codec: 'flac',
      Conditions: flacConditions,
    });

    const flacTranscodingProfiles: any[] = [];

    // Split each video transcoding profile with FLAC so that the containing FLAC is only applied to 2 channels audio
    profile.TranscodingProfiles.forEach((transcodingProfile: any) => {
      if (transcodingProfile.Type !== 'Video') return;

      const audioCodecs = transcodingProfile.AudioCodec.split(',');

      if (!audioCodecs.includes('flac')) return;

      const flacTranscodingProfile: any = { ...transcodingProfile };
      flacTranscodingProfile.AudioCodec = 'flac';
      flacTranscodingProfile.ApplyConditions = [
        ...(flacTranscodingProfile.ApplyConditions || []),
        ...flacConditions,
      ];

      flacTranscodingProfiles.push(flacTranscodingProfile);

      transcodingProfile.AudioCodec = audioCodecs
        .filter((codec: any) => codec != 'flac')
        .join(',');
    });

    profile.TranscodingProfiles.push(...flacTranscodingProfiles);
  }

  let maxH264Level = 42;
  let h264Profiles = 'high|main|baseline|constrained baseline';

  if (
    browser.tizen ||
    browser.web0s ||
    videoTestElement
      .canPlayType('video/mp4; codecs="avc1.640833"')
      .replace(/no/, '')
  ) {
    maxH264Level = 51;
  }

  // Support H264 Level 52 (Tizen 5.0) - app only
  if (
    (browser.tizenVersion >= 5 && (window as any).NativeShell) ||
    videoTestElement
      .canPlayType('video/mp4; codecs="avc1.640834"')
      .replace(/no/, '')
  ) {
    maxH264Level = 52;
  }

  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="avc1.6e0033"')
      .replace(/no/, '') &&
    // These tests are passing in safari, but playback is failing
    !browser.safari &&
    !browser.iOS &&
    !browser.web0s &&
    !browser.edge &&
    !browser.mobile &&
    !browser.tizen
  ) {
    h264Profiles += '|high 10';
  }

  let maxHevcLevel = 120;
  let hevcProfiles = 'main';

  // hevc main level 4.1
  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="hvc1.1.4.L123"')
      .replace(/no/, '') ||
    videoTestElement
      .canPlayType('video/mp4; codecs="hev1.1.4.L123"')
      .replace(/no/, '')
  ) {
    maxHevcLevel = 123;
  }

  // hevc main10 level 4.1
  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="hvc1.2.4.L123"')
      .replace(/no/, '') ||
    videoTestElement
      .canPlayType('video/mp4; codecs="hev1.2.4.L123"')
      .replace(/no/, '')
  ) {
    maxHevcLevel = 123;
    hevcProfiles = 'main|main 10';
  }

  // hevc main10 level 5.1
  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="hvc1.2.4.L153"')
      .replace(/no/, '') ||
    videoTestElement
      .canPlayType('video/mp4; codecs="hev1.2.4.L153"')
      .replace(/no/, '')
  ) {
    maxHevcLevel = 153;
    hevcProfiles = 'main|main 10';
  }

  // hevc main10 level 6.1
  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="hvc1.2.4.L183"')
      .replace(/no/, '') ||
    videoTestElement
      .canPlayType('video/mp4; codecs="hev1.2.4.L183"')
      .replace(/no/, '')
  ) {
    maxHevcLevel = 183;
    hevcProfiles = 'main|main 10';
  }

  let maxAv1Level = 15; // level 5.3
  const av1Profiles = 'main'; // av1 main covers 4:2:0 8 & 10 bits

  // av1 main level 6.0
  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.16M.08"')
      .replace(/no/, '') &&
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.16M.10"')
      .replace(/no/, '')
  ) {
    maxAv1Level = 16;
  }

  // av1 main level 6.1
  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.17M.08"')
      .replace(/no/, '') &&
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.17M.10"')
      .replace(/no/, '')
  ) {
    maxAv1Level = 17;
  }

  // av1 main level 6.2
  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.18M.08"')
      .replace(/no/, '') &&
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.18M.10"')
      .replace(/no/, '')
  ) {
    maxAv1Level = 18;
  }

  // av1 main level 6.3
  if (
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.19M.08"')
      .replace(/no/, '') &&
    videoTestElement
      .canPlayType('video/mp4; codecs="av01.0.19M.10"')
      .replace(/no/, '')
  ) {
    maxAv1Level = 19;
  }

  const h264VideoRangeTypes = 'SDR';
  let hevcVideoRangeTypes = 'SDR';
  let vp9VideoRangeTypes = 'SDR';
  let av1VideoRangeTypes = 'SDR';

  hevcVideoRangeTypes += '|HDR10';
  vp9VideoRangeTypes += '|HDR10';
  av1VideoRangeTypes += '|HDR10';

  hevcVideoRangeTypes += '|HLG';
  vp9VideoRangeTypes += '|HLG';
  av1VideoRangeTypes += '|HLG';

  if (supportsDolbyVision(options)) {
    const profiles = supportedDolbyVisionProfilesHevc(videoTestElement);
    if (profiles.includes(5)) {
      hevcVideoRangeTypes += '|DOVI';
    }
    if (profiles.includes(8)) {
      hevcVideoRangeTypes += '|DOVIWithHDR10|DOVIWithHLG|DOVIWithSDR';
    }
  }

  const h264CodecProfileConditions = [
    {
      Condition: 'NotEquals',
      Property: 'IsAnamorphic',
      Value: 'true',
      IsRequired: false,
    },
    {
      Condition: 'EqualsAny',
      Property: 'VideoProfile',
      Value: h264Profiles,
      IsRequired: false,
    },
    {
      Condition: 'EqualsAny',
      Property: 'VideoRangeType',
      Value: h264VideoRangeTypes,
      IsRequired: false,
    },
    {
      Condition: 'LessThanEqual',
      Property: 'VideoLevel',
      Value: maxH264Level.toString(),
      IsRequired: false,
    },
  ];

  const hevcCodecProfileConditions = [
    {
      Condition: 'NotEquals',
      Property: 'IsAnamorphic',
      Value: 'true',
      IsRequired: false,
    },
    {
      Condition: 'EqualsAny',
      Property: 'VideoProfile',
      Value: hevcProfiles,
      IsRequired: false,
    },
    {
      Condition: 'EqualsAny',
      Property: 'VideoRangeType',
      Value: hevcVideoRangeTypes,
      IsRequired: false,
    },
    {
      Condition: 'LessThanEqual',
      Property: 'VideoLevel',
      Value: maxHevcLevel.toString(),
      IsRequired: false,
    },
  ];

  const vp9CodecProfileConditions = [
    {
      Condition: 'EqualsAny',
      Property: 'VideoRangeType',
      Value: vp9VideoRangeTypes,
      IsRequired: false,
    },
  ];

  const av1CodecProfileConditions = [
    {
      Condition: 'NotEquals',
      Property: 'IsAnamorphic',
      Value: 'true',
      IsRequired: false,
    },
    {
      Condition: 'EqualsAny',
      Property: 'VideoProfile',
      Value: av1Profiles,
      IsRequired: false,
    },
    {
      Condition: 'EqualsAny',
      Property: 'VideoRangeType',
      Value: av1VideoRangeTypes,
      IsRequired: false,
    },
    {
      Condition: 'LessThanEqual',
      Property: 'VideoLevel',
      Value: maxAv1Level.toString(),
      IsRequired: false,
    },
  ];

  if (!browser.edgeUwp && !browser.tizen && !browser.web0s) {
    h264CodecProfileConditions.push({
      Condition: 'NotEquals',
      Property: 'IsInterlaced',
      Value: 'true',
      IsRequired: false,
    });

    hevcCodecProfileConditions.push({
      Condition: 'NotEquals',
      Property: 'IsInterlaced',
      Value: 'true',
      IsRequired: false,
    });
  }

  if (maxVideoWidth) {
    h264CodecProfileConditions.push({
      Condition: 'LessThanEqual',
      Property: 'Width',
      Value: maxVideoWidth.toString(),
      IsRequired: false,
    });

    hevcCodecProfileConditions.push({
      Condition: 'LessThanEqual',
      Property: 'Width',
      Value: maxVideoWidth.toString(),
      IsRequired: false,
    });

    av1CodecProfileConditions.push({
      Condition: 'LessThanEqual',
      Property: 'Width',
      Value: maxVideoWidth.toString(),
      IsRequired: false,
    });
  }

  const globalMaxVideoBitrate = '';

  const h264MaxVideoBitrate = globalMaxVideoBitrate;

  const hevcMaxVideoBitrate = globalMaxVideoBitrate;

  const av1MaxVideoBitrate = globalMaxVideoBitrate;

  if (h264MaxVideoBitrate) {
    h264CodecProfileConditions.push({
      Condition: 'LessThanEqual',
      Property: 'VideoBitrate',
      Value: h264MaxVideoBitrate,
      IsRequired: true,
    });
  }

  if (hevcMaxVideoBitrate) {
    hevcCodecProfileConditions.push({
      Condition: 'LessThanEqual',
      Property: 'VideoBitrate',
      Value: hevcMaxVideoBitrate,
      IsRequired: true,
    });
  }

  if (av1MaxVideoBitrate) {
    av1CodecProfileConditions.push({
      Condition: 'LessThanEqual',
      Property: 'VideoBitrate',
      Value: av1MaxVideoBitrate,
      IsRequired: true,
    });
  }

  // Safari quirks for HEVC direct-play
  if (browser.safari) {
    // Only hvc1 & dvh1 tags are supported
    hevcCodecProfileConditions.push({
      Condition: 'EqualsAny',
      Property: 'VideoCodecTag',
      Value: 'hvc1|dvh1',
      IsRequired: true,
    });

    // Framerate above 60fps is not supported
    hevcCodecProfileConditions.push({
      Condition: 'LessThanEqual',
      Property: 'VideoFramerate',
      Value: '60',
      IsRequired: true,
    });
  }

  // On iOS 12.x, for TS container max h264 level is 4.2
  if (browser.iOS && browser.iOSVersion < 13) {
    const codecProfileTS = {
      Type: 'Video',
      Codec: 'h264',
      Container: 'ts',
      Conditions: h264CodecProfileConditions.filter(condition => {
        return condition.Property !== 'VideoLevel';
      }),
    };

    codecProfileTS.Conditions.push({
      Condition: 'LessThanEqual',
      Property: 'VideoLevel',
      Value: '42',
      IsRequired: false,
    });

    profile.CodecProfiles.push(codecProfileTS);

    const codecProfileMp4 = {
      Type: 'Video',
      Codec: 'h264',
      Container: 'mp4',
      Conditions: h264CodecProfileConditions.filter(condition => {
        return condition.Property !== 'VideoLevel';
      }),
    };

    codecProfileMp4.Conditions.push({
      Condition: 'LessThanEqual',
      Property: 'VideoLevel',
      Value: '42',
      IsRequired: false,
    });

    profile.CodecProfiles.push(codecProfileMp4);
  }

  profile.CodecProfiles.push({
    Type: 'Video',
    Codec: 'h264',
    Conditions: h264CodecProfileConditions,
  });

  if (browser.web0s && supportsDolbyVision(options)) {
    // Disallow direct playing of DOVI media in containers not mp4.
    // This paired with the "Prefer fMP4-HLS Container" client playback setting enables DOVI playback on webOS.
    profile.CodecProfiles.push({
      Type: 'Video',
      Container: '-mp4',
      Codec: 'hevc',
      Conditions: [
        {
          Condition: 'EqualsAny',
          Property: 'VideoRangeType',
          Value: 'SDR|HDR10|HLG',
          IsRequired: false,
        },
      ],
    });
  }

  profile.CodecProfiles.push({
    Type: 'Video',
    Codec: 'hevc',
    Conditions: hevcCodecProfileConditions,
  });

  profile.CodecProfiles.push({
    Type: 'Video',
    Codec: 'vp9',
    Conditions: vp9CodecProfileConditions,
  });

  profile.CodecProfiles.push({
    Type: 'Video',
    Codec: 'av1',
    Conditions: av1CodecProfileConditions,
  });

  const globalVideoConditions = [];

  if (globalMaxVideoBitrate) {
    globalVideoConditions.push({
      Condition: 'LessThanEqual',
      Property: 'VideoBitrate',
      Value: globalMaxVideoBitrate,
    });
  }

  if (maxVideoWidth) {
    globalVideoConditions.push({
      Condition: 'LessThanEqual',
      Property: 'Width',
      Value: maxVideoWidth.toString(),
      IsRequired: false,
    });
  }

  if (globalVideoConditions.length) {
    profile.CodecProfiles.push({
      Type: 'Video',
      Conditions: globalVideoConditions,
    });
  }

  // Subtitle profiles
  // External vtt or burn in
  profile.SubtitleProfiles = [];
  const subtitleBurninSetting = appSettings.get('subtitleburnin');
  if (subtitleBurninSetting !== 'all') {
    if (supportsTextTracks()) {
      profile.SubtitleProfiles.push({
        Format: 'vtt',
        Method: 'External',
      });
    }
    if (
      options.enableSsaRender !== false &&
      !options.isRetry &&
      subtitleBurninSetting !== 'allcomplexformats'
    ) {
      profile.SubtitleProfiles.push({
        Format: 'ass',
        Method: 'External',
      });
      profile.SubtitleProfiles.push({
        Format: 'ssa',
        Method: 'External',
      });
    }
  }

  profile.ResponseProfiles = [];
  profile.ResponseProfiles.push({
    Type: 'Video',
    Container: 'm4v',
    MimeType: 'video/mp4',
  });

  return profile;
}

function getBaseProfileOptions() {
  const disableHlsVideoAudioCodecs = [];

  disableHlsVideoAudioCodecs.push('ac3');
  disableHlsVideoAudioCodecs.push('eac3');

  return {
    enableMkvProgressive: false,
    disableHlsVideoAudioCodecs: disableHlsVideoAudioCodecs,
  };
}

export default function getDeviceProfile(
  videoTestElement: HTMLVideoElement,
): Promise<Profile> {
  return new Promise(function (resolve) {
    let profile;

    if ((window as any).NativeShell) {
      profile = (window as any).NativeShell.AppHost.getDeviceProfile(
        profileBuilder,
        __PACKAGE_JSON_VERSION__,
      );
    } else {
      const builderOpts = getBaseProfileOptions();
      profile = profileBuilder(videoTestElement, builderOpts);
    }

    const maxVideoWidth = appSettings.maxVideoWidth();
    const maxTranscodingVideoWidth = maxVideoWidth < 0 ? 1920 : maxVideoWidth;

    if (maxTranscodingVideoWidth) {
      const conditionWidth = {
        Condition: 'LessThanEqual',
        Property: 'Width',
        Value: maxTranscodingVideoWidth.toString(),
        IsRequired: false,
      };

      if (appSettings.limitSupportedVideoResolution()) {
        profile.CodecProfiles.push({
          Type: 'Video',
          Conditions: [conditionWidth],
        });
      }

      profile.TranscodingProfiles.forEach((transcodingProfile: any) => {
        if (transcodingProfile.Type === 'Video') {
          transcodingProfile.Conditions = (
            transcodingProfile.Conditions || []
          ).filter((condition: any) => {
            return condition.Property !== 'Width';
          });

          transcodingProfile.Conditions.push(conditionWidth);
        }
      });
    }

    const preferredTranscodeVideoCodec =
      appSettings.preferredTranscodeVideoCodec();
    if (preferredTranscodeVideoCodec) {
      profile.TranscodingProfiles.forEach((transcodingProfile: any) => {
        if (transcodingProfile.Type === 'Video') {
          const videoCodecs = transcodingProfile.VideoCodec.split(',');
          const index = videoCodecs.indexOf(preferredTranscodeVideoCodec);
          if (index !== -1) {
            videoCodecs.splice(index, 1);
            videoCodecs.unshift(preferredTranscodeVideoCodec);
            transcodingProfile.VideoCodec = videoCodecs.join(',');
          }
        }
      });
    }

    const preferredTranscodeVideoAudioCodec =
      appSettings.preferredTranscodeVideoAudioCodec();
    if (preferredTranscodeVideoAudioCodec) {
      profile.TranscodingProfiles.forEach((transcodingProfile: any) => {
        if (transcodingProfile.Type === 'Video') {
          const audioCodecs = transcodingProfile.AudioCodec.split(',');
          const index = audioCodecs.indexOf(preferredTranscodeVideoAudioCodec);
          if (index !== -1) {
            audioCodecs.splice(index, 1);
            audioCodecs.unshift(preferredTranscodeVideoAudioCodec);
            transcodingProfile.AudioCodec = audioCodecs.join(',');
          }
        }
      });
    }

    resolve(profile);
  });
}
