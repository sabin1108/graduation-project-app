// Android 및 웹에서 MaterialIcons를 사용하기 위한 대체 수단입니다.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * 여기에 SF Symbols를 Material Icons 매핑에 추가하세요.
 * - [아이콘 디렉토리](https://icons.expo.fyi)에서 Material Icons를 참조하세요.
 * - [SF Symbols](https://developer.apple.com/sf-symbols/) 앱에서 SF Symbols를 참조하세요.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * iOS에서는 네이티브 SF Symbols를 사용하고, Android 및 웹에서는 Material Icons를 사용하는 아이콘 컴포넌트입니다.
 * 이를 통해 플랫폼 전반에 걸쳐 일관된 모양과 최적의 리소스 사용을 보장합니다.
 * 아이콘 `name`은 SF Symbols를 기반으로 하며 Material Icons에 수동 매핑이 필요합니다.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
