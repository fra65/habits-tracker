/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Aggiungi qui altre configurazioni Next.js, se necessarie
  webpack(config) {
    // Trova la regola esistente che gestisce gli SVG
    const fileLoaderRule = config.module.rules.find(
      (rule: any) =>
        rule.test && rule.test instanceof RegExp && rule.test.test(".svg")
    );

    // Escludi gli SVG dalla regola file-loader esistente
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Aggiungi regole per gestire SVG sia come componenti React (via SVGR) sia come URL
    config.module.rules.push(
      // Per importare SVG come URL (quando usi import ... from 'file.svg?url')
      {
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
        type: "asset/resource",
      },
      // Per importare SVG come componente React (default senza ?url)
      {
        test: /\.svg$/i,
        issuer: /\.(js|ts|jsx|tsx)$/,
        resourceQuery: { not: [/url/] },
        use: ["@svgr/webpack"],
      }
    );

    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
