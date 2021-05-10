import imageResize from './lib/resize/imageResize';
import { ImageResizeOpts } from './types';
import { decodeImage } from './util/decodeImage';

interface WasmFileUrls {
  resizeWasmUrl?: string;
  optimizeWasmUrl?: string;
}

interface SquooshOptions {
  wasmFileUrls?: WasmFileUrls;
  resizeOpts?: ImageResizeOpts;
}

interface UseSquoosh {
  (opts: SquooshOptions): {
    squooshFile: (file: File) => object;
    file?: File;
    imgSrcPreview?: string;
  };
}

export const useSquoosh: UseSquoosh = (opts) => {

  let Resizedfile:File | undefined = undefined;

  let imgSrcPreview:string | undefined = undefined;

  // const [loading, setLoading] = useState(false);
  // const [file, setFile] = useState<File | undefined>();
  
  // const [imgSrcPreview, setImgSrcPreview] = useState<string | undefined>();


  const squooshFile = async (file: File): Promise<any> => {
    return (async (): Promise<any> => {
      let image: ImageData;
      // Resize
      if (opts.resizeOpts?.width && opts.resizeOpts?.height) {
        image = await imageResize('https://raw.githubusercontent.com/sant3001/react-squoosh/master/public/wasm/squoosh_resize_bg.wasm', file, opts.resizeOpts);
      } else {
        image = await decodeImage(file);
      }

      console.log(image.width);
      console.log(image.height);

      var canvas = document.createElement('canvas');
      var ctx:any = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.putImageData(image, 0, 0);

     

       // const arrayBuffer = await imageOptimize(opts.wasmFileUrls.optimizeWasmUrl, image, opts.optimizeOpts || {});.
       const arrayBuffer = image.data;
       const arrayBufferView = new Uint8Array(arrayBuffer);
       const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
       const fileName = file.name.replace(/\.(.*)$/, '.jpeg');

       Resizedfile = new File([blob], fileName, { lastModified: file.lastModified, type: 'image/jpeg' });
       // Create Preview URL
      //  const urlCreator = window.URL || window.webkitURL;
       imgSrcPreview =canvas.toDataURL();


       return { Resizedfile, imgSrcPreview }
      

    })();
    // console.log(imgSrcPreview);

    // return { Resizedfile, imgSrcPreview }
  };
  return { squooshFile };
};

export default useSquoosh;