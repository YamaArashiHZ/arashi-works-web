const CHINESE_CHARS_PER_MINUTE = 500;
const ENGLISH_WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(text: string): number {
    const chineseCharacterCount =
        text.match(/\p{Script=Han}/gu)?.length ?? 0;

    const englishWordCount =
        text.match(/\p{Script=Latin}+/gu)?.length ?? 0;

    const minutes =
        chineseCharacterCount / CHINESE_CHARS_PER_MINUTE
        + englishWordCount / ENGLISH_WORDS_PER_MINUTE;

    return Math.max(1, Math.ceil(minutes));
}