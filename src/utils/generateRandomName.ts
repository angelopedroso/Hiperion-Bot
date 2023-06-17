export const getRandomName = (ext: string): string => {
  return `${Math.floor(Math.random() * 10000)}${ext}`
}
