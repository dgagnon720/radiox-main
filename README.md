Fix react-native-track-player crash on Android
  add this at android/build.gradle
    allprojects {
    repositories {
        ---
        jcenter()
    }
}
Fix react-native-track-player crash on Android 31+
  change this at android/build.gradle
    targetSdkVersion = 30
  <!-- add this at android/app/build.gradle
    dependencies {
      ---
      //Fix react-native-track-player crash on Android 31+
      implementation 'androidx.work:work-runtime:2.7.1'
    }
  add this at node_modules\react-native-track-player\android\src\main\java\com\guichaguri\trackplayer\service\metadata\MetadataManager.java
    below of PendingIntent pendingIntent = null;
      if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
        pendingIntent = PendingIntent.getBroadcast(
                (Context) service,
                0, mediaButtonIntent,
                PendingIntent.FLAG_IMMUTABLE
        );
      }

    replace 
      this.session = new MediaSessionCompat(service, "TrackPlayer", null, null);
    with
      this.session = new MediaSessionCompat(service, "TrackPlayer", null, pendingIntent); --># radiox-app
# radiox-app
