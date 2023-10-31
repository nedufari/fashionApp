import { error } from "console";
import { customAlphabet } from "nanoid";
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid';


export const  generate2FACode6digits=()=>{
    const otp = Math.floor(1234567890 + Math.random()*123456789).toString();
    return otp;
};

export const  generate2FACode4digits=():string=>{
    const nanoid = customAlphabet('1234567890', 6);
    return nanoid();
};

export const randomAlphaNumeric = async (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};


export const  generateRandomFallbackNames4Vendors =async  (originalName: string, count: number): Promise<string[]> =>{
    const suggestions: string[] = [];
    const words = ['couture', 'stylish', 'trendy', 'chic', 'garment', 'apparel',
      'tailored', 'fashionable', 'vogue', 'designer', 'textile', 'ensemble',
      'modish', 'seamstress', 'atelier', 'dressmaking', 'bespoke', 'togs',
      'wardrobe', 'mode', 'boutique', 'runway', 'accessory', 'embellishment',
      'pattern', 'drapery', 'accessorize', 'fabricate', 'mannequin',
      'passementerie', 'haberdashery', 'patterning', 'stitchery',
      'fashionista', 'couturier', 'habiliment', 'millinery', 'couturie',
      'ensemble', 'fashionmonger', 'voguish', 'appareling', 'garbing',
      'voguishness', 'atelier', 'rag trade', 'trendsetting','cutz','stitches','easyWear','goodTaylor', 'dBest',  'StyleSculpt', 'ChicCrafters', 'TrendTales', 'GarbGoddess', 'FashionFabulous',
      'DesignDazzle', 'RunwayRhythms', 'EnsembleElegance', 'ApparelArtistry', 'TailorTrends',
      'CoutureCanvas', 'VogueVision', 'GlamourGlimpse', 'TextureTango', 'BoutiqueBliss',
      'GlamGrove', 'ModeMystique', 'EcoElegance', 'ChicCouturier', 'SartorialSage',
      'StitchStory', 'FashionFinesse', 'ChicCraze', 'CoutureCrafted', 'ModaMingle',
      'ElegantEmpire', 'TrendyThreads', 'SewSophisticated', 'EcoEnsemble', 'VividVogue',
      'StyleStanza', 'ArtisanApparel', 'OpulentOutfits', 'DressDreamscape', 'EleganceEmporium',
      'HauteHarbor', 'CouturieCraze', 'RunwayRadiance', 'EnsembleExquisite', 'FashionFlourish',
      'ChicCreations', 'EcoElegance', 'FiberFinesse', 'GarmentGlam', 'CoutureCanvas',
      'VogueVignettes', 'DesignDelight', 'TrendTreasure', 'SewnSplendor', 'ArtisanAttire',  'FashionFusion', 'StyleSculptor', 'TrendElegance', 'ChicChateau', 'DesignDynasty',
      'RunwayRoyalty', 'CoutureCanvas', 'GlamourGrove', 'BoutiqueBlossom', 'ModaMarvel',
      'ElegantEdge', 'SartorialSculpt', 'StitchSavvy', 'DressDeluxe', 'ChicChicane',
      'VogueVirtuoso', 'EcoEnsemble', 'GlamGarb', 'ArtistryAvenue', 'TailorTreasures',
      'ChicCrafter', 'EcoEleganza', 'VividVogue', 'SewnSerenity', 'GarmentGleam',
      'FashionFlourish', 'DesignDeluxe', 'HauteHarmony', 'GlamGlimmer', 'SewSophisticate',
      'ChicCreations', 'ModeMosaic', 'ArtisanAllure', 'EcoElegance', 'OpulentOutfits',
      'ChicChiclet', 'FashionFantasy', 'StylishSavvy', 'RunwayRhapsody', 'CoutureCascade',
      'ElegantEra', 'BoutiqueBloom', 'SartorialSage', 'GlamourGrove', 'ChicCraftsmen',
      'TrendTreasure', 'ModaMingle', 'GlamourGallery', 'CoutureChic', 'EcoElysian',
      'DressDreamscape', 'VividVogue', 'ArtisticAtrium', 'FashionFlourish', 'ChicCrafted']
  
    for (let i = 0; i < count; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      suggestions.push(`${originalName}_${randomWord} or ${randomWord} `  );
    }
  
    return await  suggestions;
  }



  export const  generateRandomFallbackNames4Photographers =async  (originalName: string, count: number): Promise<string[]> =>{
    const suggestions: string[] = [];
    const words = ['ShutterPro', 'CamVista', 'FocusFusion', 'PixelCraft', 'VideoWiz',
    'PhotoWave', 'LensMasters', 'FrameFlash', 'Cinematica', 'SnapVoyage',
    'PixelWhisper', 'VisionCrafters', 'FilmFlare', 'ViewVirtuoso', 'LensLyric',
    'SnapCinema', 'ShutterSculpt', 'CamArtistry', 'VidiArtisan', 'Photoglobe',
    'MotionWonders', 'Cinematix', 'FlashFramez', 'PixelHarmony', 'ClickCanvas',
    'CamCraze', 'FilmMingle', 'VisionVoyager', 'LensLoom', 'FocusFilmic',
    'SnapSymphony', 'FrameVerse', 'CineFusion', 'SnapVantage', 'PhotoMagic',
    'VideoValiant', 'CamStanza', 'LensLuminous', 'VisionScope', 'Cineluxe',
    'FlashFable', 'ImageImpress', 'SnapSovereign', 'PicWhiz', 'CamEpic',
    'ReelReverie', 'CaptureCraft', 'ViewVoyant', 'FrameFable', 'MediaMelody',  'PixelPioneer', 'CaptureCanvas', 'FocalFlicks', 'VisualVirtuoso', 'FrameFusion',
    'CamChronicle', 'CineCrafters', 'ShutterSymphony', 'MediaMarvel', 'LensLegacy',
    'SnapSculpt', 'FilmFantasy', 'FramedFocus', 'DigitalDazzle', 'ImageInspire',
    'ViewVelvet', 'LensLuxe', 'VividVisions', 'CameraCrafter', 'PixelPalace',
    'MotionMingle', 'VideoVortex', 'FlickerFlare', 'ClickCinema', 'ArtisticAngles',
    'LensLuxe', 'VisionVibrance', 'FrameFlick', 'SnapshotSage', 'CinematicView',
    'PixelMasters', 'Videoworks', 'FramedFable', 'Cinematique', 'VisualVanguard',
    'LensLyric', 'FocusFascination', 'ShutterSense', 'FrameFinesse', 'VisualVoyage',
    'CineCrafters', 'SnapStoryteller', 'VideoValley', 'FrameFlicker', 'PixelPulse',
    'PicturePerfect', 'ArtisticAllure', 'FrameFantasy', 'SnapStyle', 'CineCrafted',]
  
    for (let i = 0; i < count; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      suggestions.push(`${originalName}_${randomWord} or ${randomWord}`);
    }
  
    return await  suggestions;
  }


  export const  generateRandomFallbackNames4Models =async  (originalName: string, count: number): Promise<string[]> =>{
    const suggestions: string[] = [];
    const words = [
        'ModelMingle', 'PosePerfection', 'CatwalkCharm', 'StarStrut', 'GlamourGaze',
        'ModelMayhem', 'RunwayRadiance', 'PosingPro', 'VogueVision', 'EleganceEyes',
        'PosePalace', 'ChicClicks', 'GlamourGaze', 'ModelMantra', 'PoseParade',
        'ModelMagnet', 'GlamourGrid', 'StarStance', 'RunwayRoyale', 'EleganceEcho',
        'ModelMagic', 'PosePulse', 'CatwalkCraze', 'ChicCasting', 'GlamourGaze',
        'ModelMasters', 'PosePerfection', 'StarStrut', 'RunwayRealm', 'EleganceEssence',
        'PoseParagon', 'VogueVogue', 'ModelMingle', 'GlamourGaze', 'CatwalkCouture',
        'StarStyle', 'ChicCasting', 'ModelMatrix', 'RunwayRhapsody', 'PosePerfection',
        'EleganceEyes', 'ModelMania', 'GlamourGallery', 'StarSculpt', 'ModelMagnet',
        'VogueVista', 'EleganceEra', 'PoseParade', 'RunwayRoyalty', 'ChicClicks',
        'GlamourGaze', 'ModelMayhem', 'PosePerfect', 'CatwalkCharm', 'StarStrut',
        'RunwayRadiance', 'VogueVision', 'EleganceEyes', 'PosePalace',
        'ChicClicks', 'GlamourGaze', 'ModelMantra', 'PoseParade', 'ModelMagnet',
        'GlamourGrid', 'StarStance', 'RunwayRoyale', 'EleganceEcho', 'ModelMagic',
        'PosePulse', 'CatwalkCraze', 'ChicCasting', 'GlamourGaze', 'ModelMasters',
        'PosePerfection', 'StarStrut', 'RunwayRealm', 'EleganceEssence', 'PoseParagon',
        'VogueVogue', 'ModelMingle', 'GlamourGaze', 'CatwalkCouture', 'StarStyle',
        'ChicCasting', 'ModelMatrix', 'RunwayRhapsody', 'PosePerfection', 'EleganceEyes',
        'ModelMania', 'GlamourGallery', 'StarSculpt', 'ModelMagnet', 'VogueVista',
        'EleganceEra', 'PoseParade', 'RunwayRoyalty', 'ChicClicks', 'GlamourGaze'
      ];
  
    for (let i = 0; i < count; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      suggestions.push(` ${randomWord}`);
    }
  
    return await  suggestions;
  }

  // async generateRandomThesarusBrandname(orignalname:string):Promise<string>{
//   try {
//     const response = await datamuse.request('words',{rel_syn:orignalname})
//     const synonyms = response.map((word:{word:string})=>word.word)

//     if (synonyms.length > 0){
//       const randomsynonyms =synonyms[Math.floor(Math.random()*3)]
//       return ` ${randomsynonyms}`
//     }else {
//       //generate a random name as a fallback 
//       return this.generateRandomFallbackName(orignalname)
//     }
    
//   } catch (error) {
//     throw error 
    
    
//   }
// }
