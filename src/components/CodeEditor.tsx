"use client"
import Editor from "@monaco-editor/react";

export default function CodeEditor() {



  const handleEditorDidMount = (editor:any, monaco:any) => {
    if (monaco) {
        monaco.editor.defineTheme("myCustomTheme", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "", background: "#000000" },
                { token: "keyword", foreground: "#DC5083" },
                { token: "string", foreground: "#E2B68A" },
            ],
            colors: {
               
            },
        });

        monaco.editor.setTheme("myCustomTheme");
    }
};
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
    <div className="monaco-editor ">
    <Editor
      
      
      height="500px"
      language="javascript"
      theme="myCustomTheme"
      value={code}
      onMount={handleEditorDidMount}

    />
    </div>
    
  );
}
