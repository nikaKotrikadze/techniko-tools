// "https://www.instagram.com/reel/ABC123/?igsh=..." -> "ABC123". Accepts /reel/, /reels/, /p/.
export function reelShortcode(url: string): string | null {
  return url.match(/instagram\.com\/(?:[\w.]+\/)?(?:reels?|p)\/([\w-]+)/)?.[1] ?? null;
}
