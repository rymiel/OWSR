export function download(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export function last<T, U>(arr: T[], def: U): T | U {
  return arr[arr.length - 1] || def;
}