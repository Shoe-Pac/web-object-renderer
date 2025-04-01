export const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = undefined
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
