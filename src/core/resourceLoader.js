class ResourceLoader {


  constructor() {}


  /**
   * @param { String } path
   * @returns { Promise<HTMLImageElement | null> }
   */
  static getResource(path) {
    return new Promise((res, rej) => {
      const image = new Image();
      image.src = path;
      image.addEventListener('load', (e) => {
        res(image);
      });
      image.addEventListener('error', (e) => {
        rej(new Error(`Error while loading ${path}`));
      });
    });
  }

}


export default ResourceLoader;