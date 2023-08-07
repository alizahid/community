import * as radix from '@radix-ui/colors'
import { useColorScheme } from 'react-native'
import { create, type TailwindFn } from 'twrnc'

export type TailwindSpace =
  | 0
  | 'px'
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96
  | 'auto'

export type TailwindFontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'

type RadixColorScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

const parse = (radix: Record<string, string>) =>
  Object.entries(radix).reduce(
    (colors, [key, value]) => ({
      ...colors,
      [key.replace(/[^0-9.]/g, '')]: value,
    }),
    {} as Record<RadixColorScale, string>,
  )

const lightColors = {
  gray: parse(radix.gray),
  green: parse(radix.grass),
  primary: parse(radix.teal),
  red: parse(radix.tomato),
  yellow: parse(radix.amber),
}

const darkColors = {
  gray: parse(radix.grayDark),
  green: parse(radix.grassDark),
  primary: parse(radix.tealDark),
  red: parse(radix.tomatoDark),
  yellow: parse(radix.amberDark),
}

type RadixColor = `${keyof typeof lightColors}-${RadixColorScale}`

export type TailwindColor = RadixColor | 'black' | 'transparent' | 'white'

export const getColor = (tw: TailwindFn, name: TailwindColor) => tw.color(name)!

export const getSpace = (tw: TailwindFn, name: TailwindSpace) => {
  const { marginTop } = tw.style(`mt-${name}`)

  return Number(marginTop) ?? 0
}

export const useTailwind = () => {
  const scheme = useColorScheme()

  const colors = scheme === 'dark' ? darkColors : lightColors

  return create({
    theme: {
      colors: {
        ...colors,
        black: '#000',
        transparent: 'transparent',
        white: '#fff',
      },
      fontFamily: {
        'body-bold': ['body-bold'],
        'body-medium': ['body-medium'],
        'body-regular': ['body-regular'],
      },
    },
  })
}
