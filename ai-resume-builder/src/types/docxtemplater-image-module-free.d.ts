/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/docxtemplater-image-module-free.d.ts
declare module 'docxtemplater-image-module-free' {
  interface ImageModuleOptions {
    centered?: boolean;
    getImage: (tagValue: any) => Buffer | ArrayBuffer | Uint8Array;
    getSize: (img: Buffer | ArrayBuffer | Uint8Array, tagValue?: any, tagName?: string) => [number, number];
  }

  class ImageModule {
    constructor(options: ImageModuleOptions);
  }

  export default ImageModule;
}
