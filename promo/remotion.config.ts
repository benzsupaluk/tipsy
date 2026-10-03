import { Config } from "@remotion/cli/config";

// Reuse the app's character art and banner instead of copying them.
Config.setPublicDir("../public");
Config.setVideoImageFormat("png");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
