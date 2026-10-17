import { buildLlmsFullTxt, loadCitedPosts } from "@/lib/llms-document";

export const revalidate = 3600;

export async function GET() {
  const posts = await loadCitedPosts();
  return new Response(buildLlmsFullTxt(posts), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
