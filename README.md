Fun Games Hub — static games website

Open `index.html` in a browser or serve the folder with a simple HTTP server:

```bash
# from /home/chronos/games-site
python3 -m http.server 8000
# then open http://localhost:8000/games.html
```

Includes:
- `index.html` — homepage
- `games.html` — games index
- `games/` — individual game pages (Tic-Tac-Toe, Memory, Geometry Dash Mini, Slope)
- `css/styles.css` — site styles
- `js/` — game scripts
- `server.py` — optional Python WebSocket relay (for online chess)

> Note: chess page uses an ES module build of chess.js (v0.13.0) loaded locally. The loader script imports and exposes `Chess` globally. If you experience blank board, check console for errors.

You can add more games by creating new HTML pages under `games/` and JS in `js/`.

### Android app (free WebView wrapper)

You can package the site as an Android application at no cost using a simple WebView.  Two common free tools are [Apache Cordova](https://cordova.apache.org/) or a basic Android Studio project.  The idea is to serve the static files from the app or load the public URL.

#### Cordova approach

```bash
# install node/npm if you don't have it
npm install -g cordova
# create a new cordova project
cordova create fungames com.yourdomain.fungames "Fun Games Hub"
cd fungames
cordova platform add android
# copy the site contents into the www folder
rm -rf www/*
cp -r ../* www/
# make sure index.html is at www/index.html, no py files, etc.
cordova build android
```

The generated APK will be in `platforms/android/app/build/outputs/apk/debug/`.
You can install it on a device with `adb install` or open the project in Android Studio
for signing and publishing.  No plugins are required for a basic WebView.

#### Android Studio/WebView manual

1. Open Android Studio → New Project → "Empty Activity".
2. In `activity_main.xml` replace `TextView` with:
   ```xml
   <WebView
       android:id="@+id/webview"
       android:layout_width="match_parent"
       android:layout_height="match_parent" />
   ```
3. In `MainActivity.java` or `MainActivity.kt`:
   ```java
   WebView web = findViewById(R.id.webview);
   web.getSettings().setJavaScriptEnabled(true);
   web.loadUrl("file:///android_asset/index.html"); // or "https://fungameshub.io/games.html"
   ```
4. Copy the contents of this repo into `app/src/main/assets/`.
5. Build APK and sign with Android Studio (free).

You can then upload the signed APK to Google Play (requires $25 developer
account).  The WebView solution itself is free and works offline once the
files are bundled.

---
