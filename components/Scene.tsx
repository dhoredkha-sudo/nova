import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Circle, Ellipse, Rect, Path, G, Line } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  style?: ViewStyle;
  variant?: 'school' | 'campus';
  /** hero = চওড়া হেডার, full = লম্বা Welcome স্ক্রিন */
  mode?: 'hero' | 'full';
};

function Cloud({ x, y, s = 1, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <Ellipse cx="2" cy="13" rx="54" ry="11" fill="#BFD9F7" opacity="0.55" />
      <Ellipse cx="2" cy="7" rx="52" ry="13" fill="#FFFFFF" />
      <Circle cx="-28" cy="0" r="16" fill="#FFFFFF" />
      <Circle cx="-6" cy="-11" r="23" fill="#FFFFFF" />
      <Circle cx="20" cy="-5" r="19" fill="#FFFFFF" />
      <Circle cx="40" cy="3" r="12" fill="#FFFFFF" />
      <Ellipse cx="-4" cy="-16" rx="12" ry="6" fill="#F4F9FF" />
    </G>
  );
}

function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Path
      d="M0 0 q5 -7 10 0 q5 -7 10 0"
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke="#27549E"
      strokeWidth="1.7"
      strokeLinecap="round"
      fill="none"
    />
  );
}

function Tree({ x, s = 1, dark = false }: { x: number; s?: number; dark?: boolean }) {
  const d = dark ? '#2A7F38' : '#2F8F3C';
  const m = dark ? '#3D9A46' : '#49AD48';
  const l = dark ? '#5FB955' : '#78CC5E';
  return (
    <G transform={`translate(${x} 232) scale(${s})`}>
      <Ellipse cx="0" cy="2" rx="30" ry="6" fill="#2E7D32" opacity="0.35" />
      <Rect x="-5" y="-48" width="10" height="50" rx="3" fill="#7A5230" />
      <Rect x="1" y="-48" width="4" height="50" rx="2" fill="#6A4425" />
      <Circle cx="0" cy="-66" r="34" fill={d} />
      <Circle cx="-22" cy="-52" r="22" fill={d} />
      <Circle cx="22" cy="-50" r="23" fill={d} />
      <Circle cx="-6" cy="-76" r="26" fill={m} />
      <Circle cx="-24" cy="-58" r="16" fill={m} />
      <Circle cx="20" cy="-60" r="16" fill={m} />
      <Circle cx="-12" cy="-84" r="13" fill={l} />
      <Circle cx="8" cy="-70" r="9" fill={l} />
    </G>
  );
}

function Window({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Rect x={x} y={y} width="13" height="15" rx="1.5" fill="#86BDEE" />
      <Rect x={x} y={y} width="13" height="6" rx="1.5" fill="#B7DAF7" />
      <Line x1={x + 6.5} y1={y} x2={x + 6.5} y2={y + 15} stroke="#FFFFFF" strokeWidth="1.2" />
      <Rect x={x - 1} y={y + 15} width="15" height="2.5" fill="#E4DCCB" />
    </G>
  );
}

/** স্কুল ক্যাম্পাসের সূর্যোদয়-সকালের ইলাস্ট্রেশন (SVG) — আকাশ স্বচ্ছ, পেছনের গ্রেডিয়েন্ট দেখা যায় */
export default function Scene({ width, height, style, variant = 'school', mode = 'hero' }: Props) {
  const roof = variant === 'school' ? '#E8702A' : '#D9574F';
  const roofDark = variant === 'school' ? '#C95A1B' : '#B8443D';
  const viewBox = mode === 'hero' ? '0 95 400 205' : '0 -230 400 530';

  return (
    <View style={[{ width, height, overflow: 'hidden' }, style]} pointerEvents="none">
      <Svg width={width} height={height} viewBox={viewBox} preserveAspectRatio="xMidYMax slice">
        <Defs>
          <RadialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="0.35" stopColor="#FFF4C9" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#FFF4C9" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#8BD46A" />
            <Stop offset="1" stopColor="#4FA83F" />
          </LinearGradient>
          <LinearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#A9DE8B" />
            <Stop offset="1" stopColor="#7CC76A" />
          </LinearGradient>
        </Defs>

        {/* সূর্যের আভা */}
        <Circle cx="335" cy="112" r="95" fill="url(#sun)" />
        <Circle cx="335" cy="112" r="20" fill="#FFF8DE" opacity="0.95" />

        {/* উঁচু আকাশের মেঘ (শুধু লম্বা স্ক্রিনে দেখা যায়) */}
        <Cloud x={70} y={-130} s={1.25} o={0.95} />
        <Cloud x={310} y={-175} s={1.05} o={0.9} />
        <Cloud x={190} y={-70} s={0.9} o={0.85} />
        <Cloud x={355} y={-15} s={0.8} o={0.9} />
        <Cloud x={40} y={10} s={0.85} o={0.9} />
        <Bird x={120} y={-30} s={1.1} />
        <Bird x={145} y={-44} s={0.8} />

        {/* হেডারে দৃশ্যমান মেঘ */}
        <Cloud x={62} y={128} s={0.95} />
        <Cloud x={175} y={150} s={0.62} o={0.92} />
        <Cloud x={262} y={118} s={0.72} o={0.95} />
        <Bird x={215} y={118} s={0.9} />
        <Bird x={236} y={108} s={0.65} />

        {/* দূরের পাহাড় */}
        <Path d="M-10 214 L50 168 L92 196 L150 150 L214 202 L272 160 L338 200 L410 170 L410 300 L-10 300Z" fill="#9FC5EF" opacity="0.75" />
        <Path d="M-10 222 L70 182 L128 212 L196 176 L260 214 L330 186 L410 218 L410 300 L-10 300Z" fill="#B7D8F3" opacity="0.8" />
        {/* নরম সবুজ টিলা */}
        <Path d="M-10 226 Q60 196 140 222 T290 214 T410 222 L410 300 L-10 300Z" fill="url(#hill)" />

        {/* দূরের ছোট গাছ */}
        <Tree x={92} s={0.5} dark />
        <Tree x={312} s={0.52} dark />

        {/* স্কুল ভবন */}
        <G>
          <Ellipse cx="200" cy="228" rx="128" ry="7" fill="#2E7D32" opacity="0.28" />
          <Rect x="86" y="168" width="228" height="58" fill="#F7F2E8" />
          <Rect x="270" y="168" width="44" height="58" fill="#EAE3D3" />
          <Rect x="78" y="160" width="244" height="10" fill={roof} />
          <Rect x="78" y="168" width="244" height="3" fill={roofDark} />
          {/* মাঝের টাওয়ার */}
          <Rect x="166" y="124" width="68" height="46" fill="#F3EDE0" />
          <Path d="M158 124 L200 98 L242 124Z" fill={roof} />
          <Path d="M158 124 L200 98 L200 124Z" fill={roofDark} opacity="0.35" />
          <Circle cx="200" cy="116" r="8" fill="#FFFFFF" />
          <Circle cx="200" cy="116" r="8" fill="none" stroke="#D8CFBC" strokeWidth="1.5" />
          <Line x1="200" y1="116" x2="200" y2="111" stroke="#27549E" strokeWidth="1.4" strokeLinecap="round" />
          <Line x1="200" y1="116" x2="204" y2="117" stroke="#27549E" strokeWidth="1.4" strokeLinecap="round" />
          <Line x1="200" y1="98" x2="200" y2="82" stroke="#6B7280" strokeWidth="1.5" />
          <Path d="M200 82 L214 86 L200 90Z" fill="#EF4444" />
          <Window x={176} y={136} />
          <Window x={211} y={136} />
          {/* জানালার সারি */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Window key={'a' + i} x={i < 3 ? 98 + i * 22 : 244 + (i - 3) * 22} y={178} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Window key={'b' + i} x={i < 3 ? 98 + i * 22 : 244 + (i - 3) * 22} y={200} />
          ))}
          {/* দরজা */}
          <Rect x="186" y="190" width="28" height="36" rx="3" fill="#3B5A9C" />
          <Rect x="199" y="190" width="2" height="36" fill="#2C4780" />
          <Path d="M186 190 Q200 176 214 190Z" fill="#E4DCCB" />
          <Rect x="180" y="226" width="40" height="4" fill="#E4DCCB" />
          <Rect x="176" y="230" width="48" height="3" fill="#D8CFBC" />
        </G>

        {/* সামনের মাঠ */}
        <Path d="M-10 228 Q90 216 200 232 T410 226 L410 300 L-10 300Z" fill="url(#grass)" />
        <Path d="M-10 262 Q100 250 200 266 T410 258 L410 300 L-10 300Z" fill="#5DB649" opacity="0.7" />
        {/* হাঁটার পথ */}
        <Path d="M184 232 L216 232 Q232 262 288 300 L116 300 Q168 262 184 232Z" fill="#F1E6C8" />
        <Path d="M192 232 L208 232 Q214 262 236 300 L164 300 Q186 262 192 232Z" fill="#F8F0DA" opacity="0.9" />

        {/* ঝোপ ও ফুল */}
        <Ellipse cx="148" cy="236" rx="26" ry="10" fill="#3D9A3F" />
        <Ellipse cx="136" cy="232" rx="16" ry="8" fill="#52B04C" />
        <Ellipse cx="256" cy="236" rx="28" ry="10" fill="#3D9A3F" />
        <Ellipse cx="270" cy="232" rx="16" ry="8" fill="#52B04C" />
        {[[130, 236, '#FF8FB1'], [142, 232, '#FFD54F'], [160, 238, '#FF8FB1'], [250, 234, '#FFD54F'], [266, 238, '#FF8FB1'], [276, 232, '#FFFFFF']].map(
          ([fx, fy, fc], i) => (
            <Circle key={i} cx={fx as number} cy={fy as number} r="2.6" fill={fc as string} />
          )
        )}
        {[[84, 276, '#FFD54F'], [96, 284, '#FF8FB1'], [318, 280, '#FFFFFF'], [304, 288, '#FFD54F'], [60, 292, '#FFFFFF'], [344, 292, '#FF8FB1']].map(
          ([fx, fy, fc], i) => (
            <Circle key={'f' + i} cx={fx as number} cy={fy as number} r="2.4" fill={fc as string} />
          )
        )}

        {/* সামনের বড় গাছ */}
        <Tree x={44} s={1.12} />
        <Tree x={358} s={1.18} />
        <Tree x={92} s={0.7} dark />
        <Tree x={312} s={0.72} dark />
      </Svg>
    </View>
  );
}
