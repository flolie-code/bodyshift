import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Ellipse,
  Rect,
  Path,
  Circle,
} from 'react-native-svg';

/**
 * Coach Jana — schlichte SVG-Portrait-Illustration.
 * Warm, feminin, freundlich. Klein und rund. Kein Detail-Overkill.
 *
 * Fuer den Store-Launch spaeter durch professionelles Portrait ersetzbar,
 * einfach den Inhalt der Circle austauschen.
 */
export function JanaAvatar({ size = 44 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 88 88">
      <Defs>
        <LinearGradient id="janaBg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E4B79A" />
          <Stop offset="1" stopColor="#C9663A" />
        </LinearGradient>
        <LinearGradient id="janaSkin" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F0C9AE" />
          <Stop offset="1" stopColor="#E4B79A" />
        </LinearGradient>
      </Defs>
      {/* Outer soft ring */}
      <Circle cx="44" cy="44" r="44" fill="url(#janaBg)" />
      {/* Inner circle */}
      <Circle cx="44" cy="44" r="41" fill="#F5F0E7" />
      {/* Hair back */}
      <Ellipse cx="44" cy="50" rx="27" ry="30" fill="#4E3226" />
      {/* Neck */}
      <Rect x="37" y="60" width="14" height="12" rx="5" fill="url(#janaSkin)" />
      {/* Face */}
      <Ellipse cx="44" cy="41" rx="16" ry="19" fill="url(#janaSkin)" />
      {/* Hair front */}
      <Path
        d="M28 39 Q30 24 44 22 Q58 24 60 39 Q58 32 44 32 Q31 32 28 39Z"
        fill="#3E2A20"
      />
      {/* Cheek warmth */}
      <Ellipse cx="33" cy="47" rx="2.5" ry="1.8" fill="#E4A184" opacity="0.55" />
      <Ellipse cx="55" cy="47" rx="2.5" ry="1.8" fill="#E4A184" opacity="0.55" />
      {/* Eyes closed smile (small arcs) */}
      <Path
        d="M35.5 42 Q37.5 44 39.5 42"
        stroke="#3E2A20"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M48.5 42 Q50.5 44 52.5 42"
        stroke="#3E2A20"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Warm smile */}
      <Path
        d="M39 51 Q44 55 49 51"
        stroke="#B54A38"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Shoulder / shirt */}
      <Path
        d="M17 88 Q17 73 36 69 L52 69 Q71 73 71 88 Z"
        fill="#7BA098"
      />
    </Svg>
  );
}
