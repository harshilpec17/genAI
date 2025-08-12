class Tokenizer {
  constructor() {
    this.secret = 234;
  }

  // Encode a word to a "token" using XOR and base64
  encodeToken(word) {
    const codes = Array.from(word).map((ch) => ch.charCodeAt(0) ^ this.secret);
    return Buffer.from(codes).toString("base64");
  }

  // Decode a "token" back to the word
  decodeToken(token) {
    const codes = Buffer.from(token, "base64");
    return Array.from(codes)
      .map((code) => String.fromCharCode(code ^ this.secret))
      .join("");
  }

  tokenize(text) {
    return text.split(" ").map((word) => this.encodeToken(word));
  }

  detokenize(tokenized) {
    return tokenized.map((token) => this.decodeToken(token)).join(" ");
  }
}
  // Custom Tokenizer Implementation and Demo

  function customTokenizer(text) {
    // Simple tokenizer: split by spaces and punctuation
    return text.match(/\b\w+\b/g) || [];
  }

  // Demo usage
  const sampleText = "Hello, world! This is a custom tokenizer demo.";
  const tokens = customTokenizer(sampleText);

  console.log("Input text:", sampleText);
  console.log("Tokens:", tokens);

  // Export for potential future use
  module.exports = { customTokenizer };

const text = "Hello world!! I am from GenAi Js batch 1";
const tokenizer = new Tokenizer();
const tokenized = tokenizer.tokenize(text);
console.log(tokenized); // Encrypted tokens
const decoded = tokenizer.detokenize(tokenized);
console.log(decoded); // Original text
