import * as radix from '@radix-ui/colors'
import { useColorScheme } from 'react-native'
import { create, type TailwindFn, type TwConfig } from 'twrnc'

import {
  type RadixColorScale,
  type TailwindColor,
  type TailwindSpace,
} from '~/types/tailwind'

const parse = (radix: Record<string, string>) =>
  Object.entries(radix).reduce(
    (colors, [key, value]) => ({
      ...colors,
      [key.replace(/[^0-9.]/g, '')]: value,
    }),
    {} as Record<RadixColorScale, string>,
  )

export const colorsLight = {
  gray: parse(radix.gray),
  green: parse(radix.grass),
  primary: parse(radix.teal),
  red: parse(radix.tomato),
  yellow: parse(radix.amber),
}

export const colorsDark = {
  gray: parse(radix.grayDark),
  green: parse(radix.grassDark),
  primary: parse(radix.tealDark),
  red: parse(radix.tomatoDark),
  yellow: parse(radix.amberDark),
}

export const getColor = (tw: TailwindFn, name: TailwindColor) => tw.color(name)!

export const getSpace = (tw: TailwindFn, name: TailwindSpace) => {
  const { marginTop } = tw.style(`mt-${name}`)

  return Number(marginTop) ?? 0
}

const getConfig = (dark: boolean): TwConfig => ({
  theme: {
    colors: {
      ...(dark ? colorsDark : colorsLight),
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

const tailwindLight = create(getConfig(false))

const tailwindDark = create(getConfig(true))

export const useTailwind = () => {
  const scheme = useColorScheme()

  return scheme === 'dark' ? tailwindDark : tailwindLight
}
