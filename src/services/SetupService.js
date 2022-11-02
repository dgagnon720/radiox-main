import { Platform } from "react-native";
import TrackPlayer, { Capability } from "react-native-track-player";

export const SetupService = async () => {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch (error) {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: Platform.OS === "android" ? true : false,
      capabilities: Platform.OS === "android" ?
        [
          Capability.Play,
          Capability.Pause,
          // Capability.Stop
        ]
        :
        [
          Capability.Play,
          Capability.Pause,
        ],
      compactCapabilities: Platform.OS === "android" ?
        [
          Capability.Play,
          Capability.Pause,
          // Capability.Stop
        ]
        :
        [
          Capability.Play,
          Capability.Pause,
        ],
      // progressUpdateEventInterval: 2,//~~~~~
    });

    isSetup = true;
  } finally {
    return isSetup;
  }
}