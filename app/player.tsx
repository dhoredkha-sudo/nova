import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

type Source =
  | { kind: 'native'; url: string }
  | { kind: 'web'; html?: string; url?: string };

function resolve(raw: string): Source {
  const url = raw.trim();
  const yt =
    url.match(/youtu\.be\/([\w-]{11})/) ||
    url.match(/[?&]v=([\w-]{11})/) ||
    url.match(/youtube\.com\/(?:embed|shorts|live)\/([\w-]{11})/);
  if (yt) {
    const src = `https://www.youtube.com/embed/${yt[1]}?playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&fs=1`;
    const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;background:#000}iframe{border:0;width:100%;height:100%}</style></head><body><iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></body></html>`;
    return { kind: 'web', html };
  }
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) return { kind: 'web', url: `https://drive.google.com/file/d/${drive[1]}/preview` };
  if (/\.(mp4|m3u8|webm|mov)(\?|$)/i.test(url)) return { kind: 'native', url };
  return { kind: 'web', url };
}

function NativePlayer({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.play();
  });
  return <VideoView player={player} style={{ flex: 1 }} allowsFullscreen allowsPictureInPicture nativeControls contentFit="contain" />;
}

export default function Player() {
  const { url, title } = useLocalSearchParams<{ url: string; title?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const src = useMemo(() => resolve(url ?? ''), [url]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 12, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
        <Text style={{ flex: 1, color: '#fff', fontWeight: '700', fontSize: 16, marginLeft: 8 }} numberOfLines={1}>
          {title || 'Nova Class'}
        </Text>
      </View>

      {src.kind === 'native' ? (
        <NativePlayer url={src.url} />
      ) : (
        <WebView
          source={src.html ? { html: src.html, baseUrl: 'https://www.youtube.com' } : { uri: src.url! }}
          style={{ flex: 1, backgroundColor: '#000' }}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
          startInLoadingState
          renderLoading={() => (
            <View style={{ ...{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
              <ActivityIndicator color="#fff" size="large" />
            </View>
          )}
        />
      )}
    </View>
  );
}
