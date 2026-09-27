import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Este proyecto vive dentro del repo de Academia Referente; fijamos la raíz
  // para que Turbopack no la confunda con la carpeta padre.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
