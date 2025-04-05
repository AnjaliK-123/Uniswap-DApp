// src/components/TestEvaluation.js
import React, { useState } from "react";
import axios from 'axios'; // Make sure to install axios

const OPENAI_API_KEY = 'sk-svcacct-eEkvPft3X6NtmgSt_IRJeFlRpuE9D-kVxwg0x3pzS9Lym7InULk2H6XEAVxl4O9E3p6l8pRovXVwCgsKT3BlbkFJsH6qyJd09aIquFAm4bQqS-x5d3orV2tGIwLKZw3Y10BhbiW5J5M32qG7dJKyJc2Hpc4AFVLl2DWaw_EA';

// A simple parser function that extracts details from common NL instructions.
const parseInstruction = (instruction) => {
  const lower = instruction.toLowerCase();
  // Example for a swap instruction: "swap 10 USDC for ETH"
  if (lower.includes("swap")) {
    const match = instruction.match(/swap\s+(\d+\.?\d*)\s+(\w+)\s+for\s+(\w+)/i);
    if (match) {
      return {
        action: "swap",
        amountIn: match[1],
        tokenIn: match[2],
        tokenOut: match[3],
      };
    } else {
      return { error: "Could not parse swap instruction. Use format: 'swap X TOKEN1 for TOKEN2'" };
    }
  }
  // Other parsing logic...
  return { error: "Instruction not recognized. Please try a different instruction." };
};

export default function TestEvaluation() {
  const [testCases, setTestCases] = useState([]);
  const [newTestInstruction, setNewTestInstruction] = useState("");
  const [results, setResults] = useState({}); // map from testCase id to result

  const addTestCase = () => {
    if (newTestInstruction.trim() === "") return;
    const testCase = {
      id: Date.now(),
      instruction: newTestInstruction,
      expected: "" // Optionally, the user can add an "expected" result here later
    };
    setTestCases([...testCases, testCase]);
    setNewTestInstruction("");
  };

  // Run the test case by dynamically parsing the instruction and using OpenAI API
  const runTest = async (testCase) => {
    const result = parseInstruction(testCase.instruction);
    if (result.error) {
      console.error("Error running test case:", result.error);
      setResults((prevResults) => ({
        ...prevResults,
        [testCase.id]: { error: result.error },
      }));
    } else {
      // Call OpenAI API for a response
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: "gpt-4", // or use the appropriate model
            messages: [
              { role: "user", content: `Answer the following question: ${testCase.instruction}` }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            }
          }
        );

        const answer = response.data.choices[0].message.content;
        setResults((prevResults) => ({
          ...prevResults,
          [testCase.id]: { answer },
        }));
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        setResults((prevResults) => ({
          ...prevResults,
          [testCase.id]: { error: "Failed to get a response from OpenAI." },
        }));
      }
    }
  };

  return (
    <div className="card">
      <h3>Task Evaluation</h3>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter a natural language instruction (e.g., 'What are the reserves of the Tether-ETH pool?')"
          value={newTestInstruction}
          onChange={(e) => setNewTestInstruction(e.target.value)}
          style={{ width: "100%", padding: "0.75rem" }}
        />
        <button
          onClick={addTestCase}
          style={{ padding: "0.75rem 1.5rem", marginTop: "1rem" }}
        >
          Add Test Case
        </button>
      </div>
      <ul>
        {testCases.map((tc) => (
          <li key={tc.id} style={{ marginBottom: "1rem" }}>
            <strong>Instruction:</strong> {tc.instruction} <br />
            <button
              onClick={() => runTest(tc)}
              style={{ padding: "0.5rem 1rem", marginTop: "0.5rem" }}
            >
              Run Test
            </button>
            {results[tc.id] && (
              <div style={{ marginTop: "0.5rem" }}>
                <h4>Result:</h4>
                <pre
                  className="status-message"
                  style={{
                    background: "#2c2a33",
                    padding: "1rem",
                    borderRadius: "8px",
                    color: "#f0f0f0"
                  }}
                >
                  {JSON.stringify(results[tc.id], null, 2)}
                </pre>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}