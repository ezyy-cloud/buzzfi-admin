declare module 'vuewordcloud' {
  import { DefineComponent } from 'vue';

  interface WordCloudProps {
    words: [string, number][];
    color?: string | ((word: string, weight: number) => string);
    fontFamily?: string;
    fontWeight?: number | string;
    rotation?: number | { from: number; to: number };
    spacing?: number;
  }

  const WordCloud: DefineComponent<WordCloudProps>;
  export default WordCloud;
}
