import { NextRequest, NextResponse } from "next/server";
import { Message, getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import {
  convertToFrame,
  FrameRequest,
  FrameValidationResponse,
} from "../../types/farcasterTypes";

const POST_URL = "https://frame-airdrop.vercel.app/api/frame";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("POST received at /api/frame");

  const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";
  const client = getSSLHubRpcClient(HUB_URL);
  let validatedMessage: Message | undefined = undefined;
  try {
    const body: FrameRequest = await req.json();
    const frameMessage = Message.decode(
      Buffer.from(body?.trustedData?.messageBytes || "", "hex")
    );
    const result = await client.validateMessage(frameMessage);
    if (result.isOk() && result.value.valid) {
      validatedMessage = result.value.message;
    }

    // Also validate the frame url matches the expected url
    let urlBuffer = validatedMessage?.data?.frameActionBody?.url || [];
    const urlString = Buffer.from(urlBuffer).toString("utf-8");
    if (!urlString.startsWith(process.env["HOST"] || "")) {
      throw new Error(`Invalid frame url: ${urlBuffer}`);
    }
  } catch (e) {
    throw new Error(`Failed to validate message: ${e}`);
  }

  const buttonId = validatedMessage?.data?.frameActionBody?.buttonIndex || 0;
  const fid = validatedMessage?.data?.fid || 0;
  console.log("bf", buttonId, fid);

  const image =
    "https://pbs.twimg.com/profile_images/1625241927636619264/N-XZiXcx_400x400.png";

  const imageHtml = `<meta property="fc:frame:image" content="${image}" />`;
  const buttonsHtml =
    `<meta property="fc:frame:button:1" content="$ETH" />` +
    `<meta property="fc:frame:button:2" content="$BTC" />`;
  const postUrlHtml = `<meta property="fc:frame:post_url" content="${POST_URL}" />`;
  let html =
    '<!DOCTYPE html><html><head><meta property="fc:frame" content="vNext" />';
  html += `${imageHtml}${buttonsHtml}${postUrlHtml}</head></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
