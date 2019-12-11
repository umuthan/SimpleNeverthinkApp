/**
 * Sample Neverthink App - Video Component
 * https://github.com/umuthan/SimpleNeverthinkApp
 *
 * Author: Umuthan Uyan
 *
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground,
  Image
} from 'react-native';

import YouTube from 'react-native-youtube';

class VideoPlayer extends Component {

  constructor() {

    super();

    /**
    * Set the default states
    */
    this.state = {
      status: null,
      error: null,
      duration: 0,
      currentTime: 0
    };

  }

  _youTubeRef = React.createRef();

  /**
  * Get the progressPercent for progress bar
  */
  getProgressPercent = () => {
    /**
    * Setting some variables to calculate the progressPercent
    */
    let currentTime = Math.round(this.state.currentTime);
    const duration = this.state.duration;
    const status = this.state.status;
    let progressPercent = 0;

    /**
    * If video status is playing or paused
    * set progress percent for the progress bar
    */
    if( status === 'playing' || status ==='paused' )
      progressPercent = (currentTime/duration)*100;

    return progressPercent+'%';

  }

  /**
  * Video onChange functions
  */
  onChangeState = (state) => {
    /**
    * Set the video status.
    * This can be 'buffering/playing/paused/unstarted/ended'
    */
    this.setState({
      status: state
    });

    /**
    * Get the duration of video and set it to state
    */
    this._youTubeRef.current.getDuration().then(
      duration => {
        this.setState({
          duration: duration
        });
      }
    );

    /**
    * If the video ended get the next video and play it
    * If the video is unavailable (unstarted) get the next video and play it
    */
    if(state==='ended' || state==='unstarted') {
      this.props.updateWatchedVideosCallback(this.props.videoID);
    }
  }

  /**
  * Set the error message if there is an error
  */
  onError = (error) => {
    this.setState({
      error: error
    })
  }

  /**
  * Returns current time of video
  * for video progress bar
  */
  onProgress = (currentTime) => {
    this.setState({
      currentTime: currentTime
    });
  }

  render() {

    // Get the props from App.js
    const {
      videoID,
      currentChannelName,
      currentChannelIcon
    } = this.props;

    // Get the current states
    const {
      status
    } = this.state;

    return (
      <View style={styles.playerWindow}>
        <View style={[
            // Small Progress bar showing video progress
            // upper side of video.
            { width: this.getProgressPercent() },
            styles.progress,
          ]}>
        </View>
        <View style={styles.player}>
        <YouTube
            ref={this._youTubeRef}
            // videoID props from App.js
            videoId={videoID}
            // autoplay video
            play={true}
            // do not show controls on video
            controls={0}
            style={styles.video}
            // do not show video info before the video starts
            showinfo={false}
            // do not show related videos in the end
            rel={false}
            // error handling
            onError={e => {
              this.onError(e.error);
            }}
            // change function with video state
            onChangeState={e => {
              this.onChangeState(e.state);
            }}
            // get current time for video progress
            onProgress={e => {
              this.onProgress(e.currentTime);
            }}
          />
          { status !== 'playing' && status !=='paused' ? (
            // Mini Loading gif includes Channel Info
            // shown if video is not playing
            <ImageBackground source={require('../Assets/neverthink_loading.gif')} style={styles.loading}>
              <View style={styles.nextVideoTextContainer}>
                <Text style={styles.nextVideoText}>Next Video In:</Text>
              </View>
              <Image style={styles.nextVideoChannelIcon} source={{uri:currentChannelIcon}} />
              <View style={styles.nextVideoChannelNameContainer}>
                <Text style={styles.nextVideoChannelName}>{currentChannelName}</Text>
              </View>
            </ImageBackground>
            // If video is playing disable the loading gif
          ) : null }
        </View>
      </View>
    );

  }

}

/**
 *
 * Styles for the Video Component
 *
 */
const styles = StyleSheet.create({
  playerWindow: {
    width: '100%',
    height: '100%',
    flex:1
  },
  player: {
    flex:9
  },
  progress: {
    flex:.1,
    backgroundColor: '#ffffff',
    marginTop: 2,
    marginBottom: 2
  },
  video: {
    flex:1,
  },
  loading: {
    position: 'absolute',
    resizeMode: 'repeat',
    height: '100%',
    width: '100%',
    flex:1
  },
  nextVideoText: {
    fontFamily: 'AmericanTypewriter',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ffffff',
    backgroundColor: '#000000',
    padding: 10
  },
  nextVideoTextContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textAlign: 'center',
  },
  nextVideoChannelIcon: {
    flex:2,
    width: '100%',
    resizeMode: 'contain'
  },
  nextVideoChannelNameContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'center',
  },
  nextVideoChannelName: {
    fontFamily: 'AmericanTypewriter',
    fontWeight: 'bold',
    fontSize: 30,
  },
});

export default VideoPlayer;
