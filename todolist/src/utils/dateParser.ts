import * as chrono from 'chrono-node';

// Custom keyword dictionary
export const keywordDict: { [key: string]: (baseDate: Date) => Date } = {
    'today': (baseDate: Date) => baseDate,
    'tom': (baseDate: Date) => new Date(baseDate.setDate(baseDate.getDate() + 1)),
    'tomorrow': (baseDate: Date) => new Date(baseDate.setDate(baseDate.getDate() + 1)),
    'next week': (baseDate: Date) => new Date(baseDate.setDate(baseDate.getDate() + 7)),
    'next month': (baseDate: Date) => new Date(baseDate.setMonth(baseDate.getMonth() + 1)),
    'next year': (baseDate: Date) => new Date(baseDate.setFullYear(baseDate.getFullYear() + 1)),
};

export interface DateParseResult {
    date: Date | null;
    recognizedText: string | null;
    start: number;
    end: number;
}

export function parseDate(text: string): DateParseResult {
    // First, try to parse with Chrono
    const chronoParsed = chrono.parse(text);
    if (chronoParsed.length > 0) {
        const result = chronoParsed[0];
        return {
            date: result.start.date(),
            recognizedText: result.text,
            start: result.index,
            end: result.index + result.text.length
        };
    }

    // If Chrono fails, check our custom dictionary
    const lowerText = text.toLowerCase();
    for (const [keyword, dateFunc] of Object.entries(keywordDict)) {
        const index = lowerText.indexOf(keyword);
        if (index !== -1) {
            return {
                date: dateFunc(new Date()),
                recognizedText: text.slice(index, index + keyword.length),
                start: index,
                end: index + keyword.length
            };
        }
    }

    // If no date is found, return null values
    return { date: null, recognizedText: null, start: -1, end: -1 };
}

export function formatDate(date: Date): { date: string, time: string } {
    return {
        date: date.toISOString().split('T')[0],  // YYYY-MM-DD format
        time: date.toTimeString().split(' ')[0],  // HH:MM:SS format
    };
}