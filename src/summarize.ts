import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import fs from "fs";
import pdfParse from "pdf-parse";

// Load and parse PDF
async function loadPdf(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

async function summarize() {
  const text = await loadPdf("./sample.pdf");

  // Setup prompt using LCEL
  const prompt = ChatPromptTemplate.fromTemplate(
    "Summarize the following text:\n\n{text}\n\nSummary:"
  );

  // Connect Ollama locally
  const llm = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama2:latest", // or mistral, gemma, etc.
  });

  // Create chain
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());

  // Run the chain
  const summary = await chain.invoke({ text: text.slice(0, 2000) });
  console.log("📝 Summary:\n", summary);
}

summarize();
