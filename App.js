/**
 * Sample Neverthink App
 * https://github.com/umuthan/SimpleNeverthinkApp
 *
 * Author: Umuthan Uyan
 *
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  Dimensions
} from 'react-native';

import Video from './app/Components/Video';
import Channels from './app/Components/Channels';
import { channels } from './app/Data/Data';

class App extends Component {

  constructor() {
    super();

    /**
    * Returns true if the screen is in portrait mode
    */
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

  /**
    * Setting the default states
    */
    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
      currentChannel: channels[0].id,
      currentChannelName: channels[0].name,
      currentChannelIcon: channels[0].icon,
      currentChannelVideos: channels[0].playlist,
      currentVideo: channels[0].playlist[0],
      watchedVideos: []
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });

  }

/**
  * Array operation function
  * using for extracting watchedVideos array
  * and currentChannelVideos array.
  */
  operation = (list1, list2, isUnion) => {
    const result = [];

    for (let i = 0; i < list1.length; i++) {
        let item1 = list1[i],
            found = false;
        for (let j = 0; j < list2.length && !found; j++) {
            found = item1 === list2[j];
        }
        if (found === !!isUnion) {
            result.push(item1);
        }
    }
    return result;
  }

  changeChannel = (channel) => {
  /**
    * Get current channel info from data
    */
    const channelInfo = channels.find(item => item.id == channel);

  /**
    * Set the currentChannel infos to the state
    */
    this.setState({
      currentChannel: channel,
      currentChannelName: channelInfo.name,
      currentChannelIcon: channelInfo.icon,
      currentChannelVideos: channelInfo.playlist
    }, function(){
      // after changing channel, play the next video
      this.nextVideo();
    });
  }

  nextVideo = () => {

    const currentChannelVideos = this.state.currentChannelVideos;

  /**
    * RemainingVideos array from extracting
    * watchedVideos array and currentChannelVideo array
    */
    let remainingVideos = this.operation(currentChannelVideos,this.state.watchedVideos);

  /**
    * If all videos ended, play the current channel playlist again
    */
    if(remainingVideos.length==0) {
      remainingVideos = currentChannelVideos;
      this.setState({
        watchedVideos: []
      })
    }

  /**
    * Change currentVideo for the next video
    */
    this.setState({
      currentVideo: remainingVideos[0]
    });
  }

/**
  * Update the watchedVideos array
  * after the video is ended
  */
  updateWatchedVideos = (videoID) => {
    this.setState({
    /**
      * If video is ended (fully watched)
      * add videoID to watchedVideos array
      */
      watchedVideos: this.state.watchedVideos.concat(videoID)
    }, function(){
      // call the nextVideo function to play the next video
      this.nextVideo();
    });
  }

  render (){

    // Get the current states
    const {
      orientation,
      currentChannel,
      currentChannelName,
      currentChannelIcon,
      currentVideo
    } = this.state;

    return (
      <View style={styles.background}>
        <StatusBar barStyle="dark-content" />
        <ImageBackground source={require('./app/Assets/neverthink_hero.png')} style={styles.header}>
          <SafeAreaView style={styles.logoBackground}>
            <Image source={require('./app/Assets/neverthink_logo.png')} style={styles.logo} />
          </SafeAreaView>
        </ImageBackground>
        <SafeAreaView style={
          // Change the style when orientation changed
          orientation === 'portrait' ? styles.container : styles.containerLandscape
        }>
          <Video
            style={styles.video}
            videoID={currentVideo}
            updateWatchedVideosCallback={this.updateWatchedVideos}
            currentChannelName={currentChannelName}
            currentChannelIcon={currentChannelIcon}
          />
          <View style={styles.channelsContainer}>
            <Text style={styles.channelsText}>Channels:</Text>
            <Channels data={channels} currentChannel={currentChannel} changeChannelCallback={this.changeChannel} />
          </View>
        </SafeAreaView>
      </View>
    );

  }

}

/**
 *
 * Styles for the App Component
 *
 */
const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000000',
    flex: 10
  },
  header : {
    flex: 1,
    justifyContent: 'center'
  },
  logoBackground: {
    flex:.6,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  logo: {
    height: '100%',
    flex: .6,
    resizeMode: 'contain'
  },
  container: {
    flex: 6
  },
  containerLandscape: {
    flex: 6,
    flexDirection: 'row'
  },
  video: {
    flex:1
  },
  channelsContainer: {
    flex:1
  },
  channelsText: {
    fontFamily: 'AmericanTypewriter',
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 30,
    paddingLeft: 20,
    paddingTop: 15
  }
});

export default App;
