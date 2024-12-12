import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings, FileCode } from 'lucide-react';

const ProductManagerGUI = () => {
  const [config, setConfig] = useState({
    metadata: {
      title: "CEO Expert Agent",
      author: "openwebui",
      version: "1.0",
      description: "An AI agent that specializes in executive decision making and strategic planning"
    },
    expertise: {
      coreDomains: ["Leadership", "Strategy", "Growth"],
      communicationStyle: "Executive Brief",
      decisionFramework: "First Principles Thinking",
      leadershipStyle: "Visionary and Pragmatic"
    },
    strategic: {
      primaryFocus: ["Vision Setting", "Team Building", "Market Strategy"],
      executiveTools: ["OKR Framework", "Decision Matrix", "Strategic Planning"],
      keyMetrics: ["Revenue Growth", "Team Performance", "Market Share"],
      stakeholderPriorities: ["Investors", "Employees", "Customers"]
    },
    personality: {
      traits: ["Decisive", "Analytical", "Inspiring"],
      communicationPreferences: {
        format: "Concise executive summaries",
        style: "Direct and action-oriented",
        emphasis: "Strategic implications"
      }
    },
    responseFramework: {
      analysisComponents: [
        "Situation Overview",
        "Strategic Implications",
        "Action Items"
      ],
      outputStructure: {
        briefFormat: true,
        includeMetrics: true,
        actionableInsights: true
      }
    }
  });

  const [output, setOutput] = useState('');

  const generateFullOutput = () => {
    // Helper function to properly format JSON with Python booleans
    const pythonifyBooleans = (obj) => {
      return JSON.stringify(obj, null, 4)
        .replace(/"true"/g, 'True')
        .replace(/"false"/g, 'False')
        .replace(/: true,/g, ': True,')
        .replace(/: true\n/g, ': True\n')
        .replace(/: false,/g, ': False,')
        .replace(/: false\n/g, ': False\n');
    };

    const output = `"""
title: ${config.metadata.title}
author: ${config.metadata.author}
version: ${config.metadata.version}
description: ${config.metadata.description}
"""

from pydantic import BaseModel, Field
from typing import Optional, List
import json


class Filter:
    def __init__(self):
        self.config = {
            "metadata": {
                "title": "${config.metadata.title}",
                "author": "${config.metadata.author}",
                "version": "${config.metadata.version}",
                "description": "${config.metadata.description}",
            },
            "expertise": ${pythonifyBooleans(config.expertise)},
            "strategic": ${pythonifyBooleans(config.strategic)},
            "personality": ${pythonifyBooleans(config.personality)},
            "responseFramework": ${pythonifyBooleans(config.responseFramework)}
        }

        self.expertise = ${pythonifyBooleans(config.expertise)}

        self.strategic = ${pythonifyBooleans(config.strategic)}

        self.personality = ${pythonifyBooleans(config.personality)}

        self.response_framework = ${pythonifyBooleans(config.responseFramework)}

    def inlet(self, body: dict, user: Optional[dict] = None) -> dict:
        messages = body.get("messages", [])
        if messages:
            last_message = messages[-1]["content"]
            strategic_response = self.process_executive_query(last_message)
            body["messages"][-1]["content"] = strategic_response
        return body

    def process_executive_query(self, query: str) -> str:
        analysis = self.analyze_strategic_context(query)
        return self.format_executive_response(analysis)

    def analyze_strategic_context(self, query: str) -> dict:
        return {
            "overview": self.generate_situation_overview(query),
            "implications": self.identify_strategic_implications(query),
            "actions": self.recommend_action_items(query),
        }

    def generate_situation_overview(self, query: str) -> str:
        """
        Generates a high-level overview based on the query.
        """
        return f"Analyzing the situation: {query}"

    def identify_strategic_implications(self, query: str) -> str:
        """
        Identifies the strategic implications of the query.
        """
        return f"Key strategic implications for: {query}"

    def recommend_action_items(self, query: str) -> List[str]:
        """
        Recommends actionable items based on the query.
        """
        return [f"Actionable item 1 for: {query}", f"Actionable item 2 for: {query}"]

    def format_executive_response(self, analysis: dict) -> str:
        if self.config["responseFramework"]["outputStructure"]["briefFormat"]:
            return self.format_brief_response(analysis)
        return self.format_detailed_response(analysis)

    def format_brief_response(self, analysis: dict) -> str:
        return (
            f"**Situation Overview:**\\n{analysis['overview']}\\n\\n"
            f"**Strategic Implications:**\\n{analysis['implications']}\\n\\n"
            f"**Action Items:**\\n- " + "\\n- ".join(analysis["actions"])
        )

    def format_detailed_response(self, analysis: dict) -> str:
        return (
            f"Detailed Response:\\n"
            f"Overview: {analysis['overview']}\\n"
            f"Implications: {analysis['implications']}\\n"
            f"Actions: {', '.join(analysis['actions'])}"
        )`;
    return output;
    return output;
  };

  const TextInput = ({ label, value, onChange, description = '' }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} 
        className="w-full p-2 border rounded-md" />
    </div>
  );

  const ArrayInput = ({ label, values, onChange, description = '' }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input type="text" value={value} onChange={(e) => {
              const newValues = [...values];
              newValues[index] = e.target.value;
              onChange(newValues);
            }} className="flex-1 p-2 border rounded-md" />
            <button onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              Remove
            </button>
          </div>
        ))}
        <button onClick={() => onChange([...values, ""])}
          className="px-3 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800">
          Add Item
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Executive AI Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Identity & Purpose</h3>
              <TextInput label="Title" value={config.metadata.title} 
                onChange={(value) => setConfig({...config, metadata: {...config.metadata, title: value}})}
                description="Name your executive AI agent" />
              <TextInput label="Description" value={config.metadata.description}
                onChange={(value) => setConfig({...config, metadata: {...config.metadata, description: value}})}
                description="Define the agent's primary purpose and specialization" />
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Core Expertise</h3>
              <ArrayInput label="Domains" values={config.expertise.coreDomains}
                onChange={(newDomains) => setConfig({...config, expertise: {...config.expertise, coreDomains: newDomains}})}
                description="Key areas of executive expertise" />
              <TextInput label="Leadership Style" value={config.expertise.leadershipStyle}
                onChange={(value) => setConfig({...config, expertise: {...config.expertise, leadershipStyle: value}})}
                description="Define the leadership approach" />
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Strategic Focus</h3>
              <ArrayInput label="Primary Focus Areas" values={config.strategic.primaryFocus}
                onChange={(newFocus) => setConfig({...config, strategic: {...config.strategic, primaryFocus: newFocus}})}
                description="Key strategic priorities" />
              <ArrayInput label="Executive Tools" values={config.strategic.executiveTools}
                onChange={(newTools) => setConfig({...config, strategic: {...config.strategic, executiveTools: newTools}})}
                description="Frameworks and methodologies" />
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Communication Style</h3>
              <ArrayInput label="Key Traits" values={config.personality.traits}
                onChange={(newTraits) => setConfig({...config, personality: {...config.personality, traits: newTraits}})}
                description="Define the executive personality" />
              <TextInput label="Communication Format" 
                value={config.personality.communicationPreferences.format}
                onChange={(value) => setConfig({...config, 
                  personality: {...config.personality, 
                    communicationPreferences: {...config.personality.communicationPreferences, format: value}
                  }})}
                description="How information should be presented" />
            </div>

            <button onClick={() => setOutput(generateFullOutput())}
              className="w-full px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800">
              Generate Agent Configuration
            </button>

            {output && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  <h3 className="font-medium">Generated Configuration</h3>
                </div>
                <textarea className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border rounded-md"
                  value={output} readOnly />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagerGUI;
