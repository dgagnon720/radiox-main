import React from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player';
import { color } from '../config/constants';

import { useOnTogglePlayback } from '../hooks';

export const RadioButtons = () => {
  const state = usePlaybackState();

  const isPlaying = state === State.Playing;
  const isLoading = state === State.Connecting || state === State.Buffering;
  const isReady = state === State.Ready || state === State.Playing || state === State.Paused

  const onTogglePlayback = useOnTogglePlayback();

  return (
    <View style={styles.container}>
      <View
        style={styles.buttonContainer}>

        {isLoading ?
          <ActivityIndicator size="large" color={color.white} />
          :
          <TouchableOpacity
            style={styles.touchable}
            onPress={onTogglePlayback}
          >
            <Image
              style={[styles.buttonImage, { tintColor: isReady ? color.radio_button : color.white }]}
              source={isPlaying ? require("../assets/images/pause.png") : require("../assets/images/play.png")}
            />
          </TouchableOpacity>
        }
      </View>
      {/* <View
        style={styles.buttonContainer}>
        {Platform.OS === "android" && isReady &&
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => {
              TrackPlayer.stop();
            }}>
            <Image
              style={styles.buttonImage}
              source={require("../assets/images/stop.png")}
            />
          </TouchableOpacity>
        }
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  buttonContainer: {
    width: "40%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  touchable: {
    width: "100%",
    height: "100%",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    tintColor: color.radio_button
  }
});
