import { useWindowDimensions } from 'react-native';
export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();
  const compact = width < 360 || height < 700;
  const singleColumn = width < 360 || fontScale > 1.3;
  const gutter = width < 360 ? 14 : 20;
  return {
    width,
    height,
    fontScale,
    compact,
    singleColumn,
    gutter,
    contentWidth: Math.min(width - gutter * 2, 680),
  };
}
