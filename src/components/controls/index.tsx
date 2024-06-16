import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

interface ButtonIconProps {
  children: React.ReactNode;
  onPress: () => void;
  onFocus?: () => void;
}

export default function ButtonIcon({
  children,
  onPress,
  onFocus,
}: ButtonIconProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: () => onPress(),
    onFocus: () => (onFocus ? onFocus() : {}),
  });

  return (
    <div
      ref={ref}
      className={`
        ${
          focused ? 'bg-white text-black' : 'text-white'
        } rounded-full w-12 h-12 flex items-center justify-center`}
    >
      {children}
    </div>
  );
}
