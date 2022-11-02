import { Platform } from 'react-native';
import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player';
import { trackList } from '../config/constants';

export const QueueInitalTracksService = async () => {
  await TrackPlayer.add(trackList);
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
  });
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
};
