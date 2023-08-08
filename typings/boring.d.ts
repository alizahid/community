declare module 'react-native-boring-avatars' {
  export interface AvatarProps {
    colors?: Array<string>
    name?: string
    size?: number | string
    square?: boolean
    variant?: 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus'
  }

  interface AvatarComponent {
    (props: AvatarProps, context?: any): React.ReactElement | null
  }

  const Avatar: AvatarComponent

  export default Avatar
}
