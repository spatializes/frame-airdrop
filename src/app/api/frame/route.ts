import { NextRequest, NextResponse } from "next/server";
import { Message, getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import { FrameRequest } from "../../types/farcasterTypes";

const POST_URL = "https://frame-airdrop.vercel.app/api/frame";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("POST received at /api/frame");

  //   const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";
  //   const client = getSSLHubRpcClient(HUB_URL);
  //   let validatedMessage: Message | undefined = undefined;
  //   try {
  //     const body: FrameRequest = await req.json();
  //     const frameMessage = Message.decode(
  //       Buffer.from(body?.trustedData?.messageBytes || "", "hex")
  //     );
  //     const result = await client.validateMessage(frameMessage);
  //     if (result.isOk() && result.value.valid) {
  //       validatedMessage = result.value.message;
  //     }

  //     // Also validate the frame url matches the expected url
  //     let urlBuffer = validatedMessage?.data?.frameActionBody?.url || [];
  //     const urlString = Buffer.from(urlBuffer).toString("utf-8");
  //     if (!urlString.startsWith(process.env["HOST"] || "")) {
  //       throw new Error(`Invalid frame url: ${urlBuffer}`);
  //     }
  //   } catch (e) {
  //     throw new Error(`Failed to validate message: ${e}`);
  //   }

  //   const buttonId = validatedMessage?.data?.frameActionBody?.buttonIndex || 0;
  //   const fid = validatedMessage?.data?.fid || 0;

  //   console.log(`Pressed button ${buttonId} with fid ${fid}`);

  const NEW_IMAGE_URLimage =
    "https://assets.blocklive.io/events/2bfb5de2-cd38-49d5-bb3b-1834dfc66380/58662d9d-303b-4c72-b3cd-92207ca8b91b_dall_e_2024_01_28_23_08_18___design_a_banner_image__size_936px_x_468px__that_looks_like_an_entrance_ticket_to_an_event_for_the__frames__feature_on_a_social_media_platform_resembli.png";

  let html =
    `<!DOCTYPE html><html><head>` +
    `<meta property="fc:frame" content="vNext" />` +
    `<meta property="fc:frame:image" content="${NEW_IMAGE_URLimage}" />` +
    `<meta property="fc:frame:button:1" content="$DOGE" />` +
    `<meta property="fc:frame:button:2" content="$SOL" />` +
    `<meta property="fc:frame:post_url" content="${POST_URL}" />` +
    `</head></html>`;

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}

export const dynamic = "force-dynamic";
