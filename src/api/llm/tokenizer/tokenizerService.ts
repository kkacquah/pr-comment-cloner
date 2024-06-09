import { ContentType } from "../types";

// Function to tokenize a code line
function tokenizeCodeLine(line: string) {
  // Tokenize the code line using a basic word tokenizer
  return line.split(/(\s+|\b)/).filter(Boolean);
}

// Split a text into lines, and sanitize text to be safe for a JSON request.
const splitTextIntoLinesForJson = (text: string) => {
  return text.trim().replace(/,/g, "").split("/\r/g");
};

const TOKENIZERS: Record<ContentType, (text: string) => string[]> = {
  diffHunk: (diffHunk: string) => {
    const lines = splitTextIntoLinesForJson(diffHunk);

    // Tokenize the metadata lines (file paths and line changes)
    const headerTokens = lines.slice(0, 3).flatMap((line) => line.split(/\s+/));

    // Tokenize the diff body
    const bodyTokens = [];
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i];
      if (
        line.startsWith("+") ||
        line.startsWith("-") ||
        line.startsWith("@@")
      ) {
        bodyTokens.push(line[0]);
        const codeLine = line.slice(1);
        bodyTokens.push(...tokenizeCodeLine(codeLine));
      } else {
        bodyTokens.push(...tokenizeCodeLine(line));
      }
    }

    return [...headerTokens, ...bodyTokens];
  },
  comment: (comment: string) => {
    // Split the comment into words
    return splitTextIntoLinesForJson(comment).flatMap((line) =>
      line.split(/\s+/)
    );
  },
};

export const TokenizerService = {
  tokenize: (text: string, contentType: ContentType) => {
    return TOKENIZERS[contentType](text);
  },
};
