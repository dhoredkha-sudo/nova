import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle, Ellipse, Rect, Path, G } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  style?: ViewStyle;
  variant?: 'school' | 'campus';
};

/** ডিজাইনের মতো আকাশ-মেঘ-গাছ-স্কুল বিল্ডিংয়ের ইলাস্ট্রেশন (SVG) */
export default function Scene({ width, height, style, variant = 'school' }: Props) {
  const roof = variant === 'school' ? '#E9762F' : '#D9655B';
  return (
    <View style={[{ width, height, overflow: 'hidden' }, style]} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#3F8CF7" />
            <Stop offset="0.6" stopColor="#8EC3FB" />
            <Stop offset="1" stopColor="#D8EBFF" />
          </LinearGradient>
          <LinearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7CCB5A" />
            <Stop offset="1" stopColor="#4FA43A" />
          </LinearGradient>
        </Defs>
        <Rect width="400" height="300" fill="url(#sky)" />
        {/* clouds */}
        <G fill="#FFFFFF" opacity="0.92">
          <Ellipse cx="70" cy="70" rx="38" ry="14" />
          <Ellipse cx="100" cy="62" rx="26" ry="16" />
          <Ellipse cx="300" cy="50" rx="44" ry="15" />
          <Ellipse cx="335" cy="42" rx="26" ry="14" />
          <Ellipse cx="200" cy="105" rx="34" ry="10" opacity="0.7" />
        </G>
        {/* far hills */}
        <Path d="M0 190 Q60 150 130 185 T260 180 T400 170 L400 300 L0 300Z" fill="#A5D88B" />
        {/* building */}
        <G>
          <Rect x="105" y="150" width="200" height="60" fill="#F4F1EA" />
          <Rect x="95" y="142" width="220" height="12" fill={roof} />
          <Rect x="185" y="118" width="60" height="40" fill="#EFEBE2" />
          <Rect x="178" y="112" width="74" height="9" fill={roof} />
          <Rect x="205" y="92" width="20" height="22" fill="#F4F1EA" />
          <Path d="M200 92 L215 76 L230 92Z" fill={roof} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Rect key={i} x={115 + i * 24} y={162} width="14" height="16" fill="#7FB5E8" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Rect key={'b' + i} x={115 + i * 24} y={186} width="14" height="16" fill="#7FB5E8" />
          ))}
          <Rect x="195" y="130" width="40" height="22" fill="#7FB5E8" />
        </G>
        {/* ground */}
        <Path d="M0 205 Q120 190 200 205 T400 200 L400 300 L0 300Z" fill="url(#grass)" />
        <Path d="M170 300 Q195 250 205 205 L225 205 Q215 255 260 300Z" fill="#EBDDB8" opacity="0.85" />
        {/* trees */}
        <G>
          <Rect x="42" y="165" width="8" height="40" fill="#7A5230" />
          <Circle cx="46" cy="150" r="30" fill="#3E9E3C" />
          <Circle cx="30" cy="165" r="20" fill="#4DB04A" />
          <Circle cx="64" cy="168" r="18" fill="#4DB04A" />
          <Rect x="352" y="160" width="8" height="46" fill="#7A5230" />
          <Circle cx="356" cy="142" r="34" fill="#3E9E3C" />
          <Circle cx="336" cy="162" r="20" fill="#4DB04A" />
          <Circle cx="378" cy="160" r="22" fill="#4DB04A" />
        </G>
        <G fill="#2E8B3A" opacity="0.9">
          <Ellipse cx="110" cy="214" rx="30" ry="9" />
          <Ellipse cx="300" cy="216" rx="34" ry="9" />
        </G>
      </Svg>
    </View>
  );
}
