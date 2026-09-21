// Read when the page renders, which for a static page is at build and at each revalidation
export function CurrentYear() {
  return new Date().getFullYear();
}
