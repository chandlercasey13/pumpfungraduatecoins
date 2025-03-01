"use client"

import Editor from "@monaco-editor/react";
export default function CodeEditor() {
    const code = `const query = \`
    query {
      getCoin(mintAddress: "2uFgHK1Zevr29CwfXwfo3eHBkxR73KpSv8D7eSpJpump") { 
        marketCap  
        lastReply
      } 
    }
  \`;
  
  fetch("https://your-graphql-endpoint.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error fetching data:", error));`;
  
  return (
    <Editor
      className="p-4"
      height="500px"
      language="javascript"
      theme="vs-dark"
      value={code}
    />
  );
}
