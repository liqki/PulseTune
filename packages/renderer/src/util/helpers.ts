export const shortenString = (str: string, maxLen: number) => {
  if (!str) {
    return str;
  }
  if (str.length <= maxLen) {
    return str;
  }
  return str.slice(0, maxLen - 3) + '...';
};
