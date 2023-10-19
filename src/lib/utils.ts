/**
* Trim a url to ensure it not ends with a /
*/
export function trimUrl(url: string): string {
  return url.charAt(url.length - 1) !== '/' ? url : url.slice(0, -2)
}
