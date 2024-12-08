import browser from '../utilities/browser';
import Events from '../utilities/events';
import { toBoolean } from '../utilities/string';

class AppSettings {
  #getKey(name: string, userId?: string) {
    if (userId) {
      name = userId + '-' + name;
    }

    return name;
  }

  enableAutoLogin(val: any) {
    if (val !== undefined) {
      this.set('enableAutoLogin', val.toString());
    }

    return toBoolean(this.get('enableAutoLogin'), true);
  }

  /**
   * Get or set 'Enable Gamepad' state.
   * @param {boolean|undefined} val - Flag to enable 'Enable Gamepad' or undefined.
   * @return {boolean} 'Enable Gamepad' state.
   */
  enableGamepad(val: any) {
    if (val !== undefined) {
      return this.set('enableGamepad', val.toString());
    }

    return toBoolean(this.get('enableGamepad'), false);
  }

  /**
   * Get or set 'Enable smooth scroll' state.
   * @param {boolean|undefined} val - Flag to enable 'Enable smooth scroll' or undefined.
   * @return {boolean} 'Enable smooth scroll' state.
   */
  enableSmoothScroll(val: any) {
    if (val !== undefined) {
      return this.set('enableSmoothScroll', val.toString());
    }

    return toBoolean(this.get('enableSmoothScroll'), !!browser.tizen);
  }

  enableSystemExternalPlayers(val: any) {
    if (val !== undefined) {
      this.set('enableSystemExternalPlayers', val.toString());
    }

    return toBoolean(this.get('enableSystemExternalPlayers'), false);
  }

  enableAutomaticBitrateDetection(isInNetwork: any, mediaType: any, val: any) {
    const key = 'enableautobitratebitrate-' + mediaType + '-' + isInNetwork;
    if (val !== undefined) {
      if (isInNetwork && mediaType === 'Audio') {
        val = true;
      }

      this.set(key, val.toString());
    }

    if (isInNetwork && mediaType === 'Audio') {
      return true;
    } else {
      return toBoolean(this.get(key), true);
    }
  }

  maxStreamingBitrate(isInNetwork: any, mediaType: any, val: any) {
    const key = 'maxbitrate-' + mediaType + '-' + isInNetwork;
    if (val !== undefined) {
      if (isInNetwork && mediaType === 'Audio') {
        //  nothing to do, this is always a max value
      } else {
        this.set(key, val);
      }
    }

    if (isInNetwork && mediaType === 'Audio') {
      // return a huge number so that it always direct plays
      return 150000000;
    } else {
      return parseInt(this.get(key) || '0', 10) || 1500000;
    }
  }

  maxStaticMusicBitrate(val: any) {
    if (val !== undefined) {
      this.set('maxStaticMusicBitrate', val);
    }

    const defaultValue = 320000;
    return (
      parseInt(
        this.get('maxStaticMusicBitrate') || defaultValue.toString(),
        10,
      ) || defaultValue
    );
  }

  maxChromecastBitrate(val: any) {
    if (val !== undefined) {
      this.set('chromecastBitrate1', val);
    }

    val = this.get('chromecastBitrate1');
    return val ? parseInt(val, 10) : null;
  }

  /**
   * Get or set 'Maximum video width'
   * @param {number|undefined} val - Maximum video width or undefined.
   * @return {number} Maximum video width.
   */
  maxVideoWidth(val?: number): number {
    if (val !== undefined) {
      this.set('maxVideoWidth', val.toString());
      return val;
    }

    return parseInt(this.get('maxVideoWidth') || '0', 10) || 0;
  }

  /**
   * Get or set 'Limit maximum supported video resolution' state.
   * @param {boolean|undefined} val - Flag to enable 'Limit maximum supported video resolution' or undefined.
   * @return {boolean} 'Limit maximum supported video resolution' state.
   */
  limitSupportedVideoResolution(val?: boolean) {
    if (val !== undefined) {
      return this.set('limitSupportedVideoResolution', val.toString());
    }

    return toBoolean(this.get('limitSupportedVideoResolution'), false);
  }

  /**
   * Get or set preferred transcode video codec.
   * @param {string|undefined} val - Preferred transcode video codec or undefined.
   * @return {string} Preferred transcode video codec.
   */
  preferredTranscodeVideoCodec(val?: string) {
    if (val !== undefined) {
      return this.set('preferredTranscodeVideoCodec', val);
    }
    return this.get('preferredTranscodeVideoCodec') || '';
  }

  /**
   * Get or set preferred transcode audio codec in video playback.
   * @param {string|undefined} val - Preferred transcode audio codec or undefined.
   * @return {string} Preferred transcode audio codec.
   */
  preferredTranscodeVideoAudioCodec(val?: string) {
    if (val !== undefined) {
      return this.set('preferredTranscodeVideoAudioCodec', val);
    }
    return this.get('preferredTranscodeVideoAudioCodec') || '';
  }

  /**
   * Get or set 'Enable DTS' state.
   * @param {boolean|undefined} val - Flag to enable 'Enable DTS' or undefined.
   * @return {boolean} 'Enable DTS' state.
   */
  enableDts(val?: boolean) {
    if (val !== undefined) {
      return this.set('enableDts', val.toString());
    }

    return toBoolean(this.get('enableDts'), false);
  }

  /**
   * Get or set 'Enable TrueHD' state.
   * @param {boolean|undefined} val - Flag to enable 'Enable TrueHD' or undefined.
   * @return {boolean} 'Enable TrueHD' state.
   */
  enableTrueHd(val?: boolean) {
    if (val !== undefined) {
      return this.set('enableTrueHd', val.toString());
    }

    return toBoolean(this.get('enableTrueHd'), false);
  }

  set(name: string, value: any, userId?: string) {
    const currentValue = this.get(name, userId);
    localStorage.setItem(this.#getKey(name, userId), value);

    if (currentValue !== value) {
      Events.trigger(this, 'change', [name]);
    }
  }

  get(name: string, userId?: string) {
    return localStorage.getItem(this.#getKey(name, userId));
  }
}

const appSettings = new AppSettings();
export default appSettings;