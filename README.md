# <img src="./public/favicon.svg" alt="Project Logo" width="30" height="30" style="vertical-align: middle; margin-right: 8px;"> GPT Image Playground

A web-based playground to interact with OpenAI's GPT image models (`gpt-image-2.6-flare`, `gpt-image-2.6-sunburst`, `gpt-image-2.5-flare`, `gpt-image-2.5-sunburst`, and `gpt-image-2`) for generating and editing images.

> **Note:** The playground defaults to `gpt-image-2.6-flare`, OpenAI's fast default model. All five models support arbitrary resolutions up to 4K (with constraint validation), transparent backgrounds (preview on `gpt-image-2`) and markup-guided edits. The `gpt-image-2.5` and `gpt-image-2.6` models add the `xhigh` and `max` quality tiers. The `gpt-image-2.6` models add the `complexity` setting, animated GIF output and SVG output. Retired models (`gpt-image-1`, `gpt-image-1-mini`, `gpt-image-1.5`) can no longer be selected, but images generated with them remain visible in the history with their original cost breakdown.

<p align="center">
  <img src="./readme-images/interface.jpg" alt="Interface" width="900"/>
</p>

## ✨ Features

*   **🎨 Image Generation Mode:** Create new images from text prompts.
*   **🖌️ Image Editing Mode:** Modify existing images (up to 16 source images per request) based on text prompts and an optional mask or markup.
*   **⚙️ Full API Parameter Control:** Access and adjust all relevant parameters supported by the OpenAI Images API directly through the UI, in both generate and edit mode (size, quality including the `xhigh`/`max` tiers, complexity, output format, compression, background, moderation, number of images).
*   **📐 Custom Resolutions:** Pick from the 2048×2048, 3072×2048 or 2048×3072 presets or enter an arbitrary Width × Height with live validation against the model constraints (multiples of 16, max 3840px per edge, ≤ 3:1 aspect ratio, 655,360 to 8,294,400 total pixels).
*   **🎞️ Animated GIF Output (`gpt-image-2.6`):** Generate GIFs from a prompt or animate an uploaded image in edit mode, with 2 to 16 frames and a per-frame duration of 20 to 2000 ms. Custom frame sizes are validated against the API's sheet limits: frames are rendered tiled into one image (4×2 or 2×4 for up to 8 frames, 3×3 for 9, 4×4 for 10 or more) that must meet the still-image constraints, and the number of images × sheet pixels must stay within 16,777,216.
*   **✒️ SVG Output (`gpt-image-2.6`, generate mode):** The image model draws a reference image and a chat model (`gpt-6.1-sol`, `gpt-6-astra`, `gpt-6.1-terra` or `gpt-6-luna`, with an optional reasoning effort) writes it as SVG. One image per request; the writer's token cost is included in the cost breakdown.
*   **🎭 Integrated Masking & Markup Tool:** Easily create or upload masks directly within the editing mode to specify areas for modification. Draw directly on the image to generate a mask, or switch to Markup to circle or sketch where a change should go and describe it in the prompt (markup can't be combined with a mask, and masks can't be used with GIF output).
<p align="center">
  <img src="./readme-images/mask-creation.jpg" alt="Interface" width="350"/>
</p>

*   **📜 Detailed History & Cost Tracking:**
    *   View a comprehensive history of all your image generations and edits.
    *   See the parameters used for each request.
    *   Get detailed API token usage and estimated cost breakdowns (`$USD`) for each operation. (hint: click the `$` amount on the image)
    *   View the full prompt used for each history item.
    *   View total historical API cost.
    *   Delete items from history

<p align="center">
  <img src="./readme-images/history.jpg" alt="Interface" width="1306"/>
</p>

<p align="center">
  <img src="./readme-images/cost-breakdown.jpg" alt="Interface" width="350"/>
</p>

*   **🖼️ Flexible Image Output View:** View generated image batches as a grid or select individual images for a closer look.
*   **🚀 Send to Edit:** Quickly send any generated or history image directly to the editing form.
*   **📋 Paste to Edit:** Paste images directly from your clipboard into the Edit mode's source image area.
*   **💾 Storage:** Supports two modes via `NEXT_PUBLIC_IMAGE_STORAGE_MODE`:
    *   **Filesystem (default):** Images saved to `./generated-images` on the server.
    *   **IndexedDB:** Images saved directly in the browser's IndexedDB (ideal for serverless deployments).
    *   Generation history metadata is always saved in the browser's local storage.

## Authentication and deployment

Sign-in uses Better Auth and an OpenID Connect provider. Configure your provider's
authorization-code flow with PKCE, scopes `openid`, `profile`, and `email`, and
the callback URL `<BETTER_AUTH_URL>/api/auth/callback/oidc`. For Cognito, use the
User Pool issuer URL, not the hosted login domain.

Set these environment variables at runtime (e.g. in `.env.local`):

```dotenv
OPENAI_API_KEY=your_openai_api_key
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace_with_a_random_secret_of_at_least_32_characters
OIDC_ISSUER=https://your-identity-provider.example
OIDC_CLIENT_ID=your_client_id
OIDC_CLIENT_SECRET=your_client_secret
```

Optionally set `OPENAI_API_BASE_URL` for a compatible API endpoint and
`AUTH_DB_PATH` to change the SQLite database path (default `./data/auth.sqlite`).
Keep secrets out of version control. Restrict registration at your identity
provider: authenticated users share the image store and the OpenAI API key.

### Docker

```bash
docker build -t gpt-image-playground .
docker run --env-file .env -p 3000:3000 \
  -v gpt-image-auth:/app/data \
  -v gpt-images:/app/generated-images \
  gpt-image-playground
```

Use the public application URL for `BETTER_AUTH_URL` when deployed. Volumes
preserve sessions and generated images. `NEXT_PUBLIC_IMAGE_STORAGE_MODE` is a
build-time setting: use `--build-arg NEXT_PUBLIC_IMAGE_STORAGE_MODE=indexeddb`
to store images in the browser instead of the server. Container images are
published to GHCR on default-branch and tag pushes for `linux/amd64` and
`linux/arm64`; pull requests only build. Build provenance is disabled.

### Local development

Requires Node.js 24 or later and npm. Set the variables above in `.env.local`, then:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).


## 🤝 Contributing

Contributions are welcome! Issues and feature requests, not as much welcome but I'll think about it.

## 📄 License

MIT
