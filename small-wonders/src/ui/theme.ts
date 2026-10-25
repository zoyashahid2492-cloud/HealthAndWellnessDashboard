export const FONT = '"Trebuchet MS", "Segoe UI", Verdana, sans-serif'

export function textStyle(size: number, color = '#241c16', bold = true) {
  return {
    fontFamily: FONT,
    fontSize: `${size}px`,
    color,
    fontStyle: bold ? 'bold' : 'normal',
    align: 'center' as const,
  }
}
