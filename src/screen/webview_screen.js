import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import TrackPlayer from 'react-native-track-player';
import WebView from 'react-native-webview';
import { RadioButtons } from '../components/RadioButtons';
import { color, server, splash } from '../config/constants';
import { useCurrentTrack } from '../hooks';
import { QueueInitalTracksService, SetupService } from '../services';

const WebviewScreen = ({ navigation }) => {
  const track = useCurrentTrack();
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(1));
  const [finishAnim, setFinishAnim] = useState(false);
  const [loading, setLoading] = useState(Platform.OS === "android"? true : false);

  const visibleSplashRef = useRef(true);
  const webviewLoadedRef = useRef(false);

  const webviewRef = useRef(null);

  const linking_url = [
    "tel:",
    "mailto:",
    "https://www.facebook.com",
    "https://www.instagram.com",
    "https://twitter.com",
    "https://www.youtube.com",
    "https://www.linkedin.com",
  ];

  useEffect(() => {
    async function run() {
      const isSetup = await SetupService();
      setIsPlayerReady(isSetup);

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await QueueInitalTracksService();
        if (Platform.OS === "android") {
          TrackPlayer.stop()
        }
      }
    }

    run();
  }, []);

  const webviewLoadEnd = (event) => {
    if (Platform.OS === "android") {
      webviewLoadedRef.current = true;
      if (visibleSplashRef.current === false) {
        startAnimated();
      }
    }
  }

  const splashLoadEnd = (event) => {
    setTimeout(() => {
      startAnimated();
    }, 2000);
  }

  const startAnimated = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(({ finished }) => {
      setFinishAnim(true);
    });
  }

  const onShouldStartLoadWithRequest = (navigator) => {
    try {
      let url = navigator.url;
      if (url === "about:srcdoc") {
        return false;
      }
      if (linking_url.some(item => url.toString().includes(item.toString()))) {
        Linking.openURL(url);
        return false;
      }
    } catch (error) {

    }
    return true;
  };

  const onLoadStart = () => {
    if (Platform.OS === "android") {
      setLoading(true);
    }
  }

  const onLoadEnd = () => {
    if (Platform.OS === "android") {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  }

  const onContentProcessDidTerminate = () => webviewRef.current?.reload()

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          useWebKit={true}
          source={{ uri: server }}
          onLoad={(event) => webviewLoadEnd(event)}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onContentProcessDidTerminate={onContentProcessDidTerminate}
          style={styles.webview}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          javaScriptEnabled={true}
          onMessage={(event) => { }}
          injectedJavaScript={
            'function hideHeaderToggle() { var handleInterval = setInterval(function () { try { document.getElementsByClassName( "brxe-section playerbar playerbar" )[0].style.display = "none"; } catch (e) {} try { document.getElementById("podium-prompt").style.display = "none"; } catch (e) {} try { document.getElementById("podium-bubble").style.display = "none"; } catch (e) {}}, 100); } hideHeaderToggle();'
          }
        />

        <View style={styles.radioContainer}>
          <View style={styles.radioLogoContainer}>
            <Image
              style={styles.logoImage}
              source={require("../assets/images/logoradio.png")}
            />
          </View>
          <View style={styles.radioButtonsContainer}>
            <RadioButtons />
          </View>
        </View>

        {loading &&
          <View style={styles.loading}>
            <ActivityIndicator color={color.white} size='large' />
          </View>
        }
      </SafeAreaView>
      {!finishAnim &&
        <Animated.View
          style={[styles.fastImage, { opacity: fadeAnim }]}>
          <FastImage
            style={styles.fastImage}
            source={{
              uri: splash,
              priority: FastImage.priority.normal
            }}
            onLoad={(event) => splashLoadEnd(event)}
            resizeMode={FastImage.resizeMode.cover}
          />
        </Animated.View>
      }
    </View>
  );
}

export default WebviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: color.primary,
    marginTop: StatusBar.currentHeight
  },
  webview: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: color.primary
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  fastImage: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: color.primary
  },
  radioContainer: {
    position: "absolute",
    height: 120 + (Platform.OS === "ios" ? 34 : 0),
    width: "100%",
    left: 0,
    right: 0,
    flexDirection: "row",
    // bottom: 120,
    bottom: 0,
    backgroundColor: color.purple,
    borderTopColor: color.radio_border,
    borderTopWidth: 4,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  radioLogoContainer: {
    width: "60%",
    height: "100%",
    paddingRight: 20,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  radioButtonsContainer: {
    width: "40%",
    height: "100%",
  }
});