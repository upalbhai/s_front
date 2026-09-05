export interface BaseButtonProps {
  color: {
    main: string;
    dark: string;
    shadow: string;
  };
  isPlaying: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  size?: 'small' | 'medium' | 'large';
}
