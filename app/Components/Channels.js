/**
 * Sample Neverthink App - Channels Component
 * https://github.com/umuthan/SimpleNeverthinkApp
 *
 * Author: Umuthan Uyan
 *
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';

class Channels extends Component {

  /**
   *
   * Change channel callback function
   * to set the currentChannel state in App.js
   *
   */
  changeChannel = (channel) => {
    this.props.changeChannelCallback(channel);
  }

  render() {

    // Get the props from App.js
    const {
      data,
      currentChannel
    } = this.props;

    return (
      <FlatList
        style={styles.itemList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={
          ({item}) =>
          <TouchableOpacity
            // Change the channel when pressed the buttons
            onPress={() => this.changeChannel(item.id)}
            // Change the style of selected channel
            style={ currentChannel === item.id ? styles.itemSelected : styles.item }>
              <Image source={{uri:item.icon}} style={styles.itemIcon} />
              <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
          }
      />
    );

  }

}

/**
 *
 * Styles for the Channels Component
 *
 */
const styles = StyleSheet.create({
  itemList : {
    flex: 1
  },
  item: {
    flex:1,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    height: 120,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    flexDirection: 'row'
  },
  itemSelected: {
    flex:1,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    height: 120,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    flexDirection: 'row'
  },
  itemIcon: {
    width: '100%',
    resizeMode: 'contain',
    flex:1
  },
  itemText: {
    color: '#ffffff',
    fontFamily: 'AmericanTypewriter',
    flex:3,
    alignSelf: 'center',
    paddingLeft: 20,
    fontSize: 25
  }
});

export default Channels;
