import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // render-email ルートで使う日本語フォント(.ttf)を本番のサーバートレースに確実に含める。
  // fs で読む同梱アセットは稀にトレース漏れするため明示的に指定しておく。
  outputFileTracingIncludes: {
    "/api/render-email": ["./src/app/api/render-email/*.ttf"],
  },
};

export default nextConfig;
