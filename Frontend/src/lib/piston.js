const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGAUAGE_CONFIG = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

function getextensionfile(language) {
  const extension = {
    javascript: "js",
    python: "py",
    java: "java",
  };
  return extension[language] || "txt";
}

export async function executecode(language, sourcecode) {
  try {
    const languageconfig = LANGAUAGE_CONFIG[language];
    if (!languageconfig) {
      return {
        success: false,
        error: `unsupported language: ${language}`,
      };
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        language: languageconfig.language,
        version: languageconfig.version,
        files: [
          {
            name: `main.${getextensionfile(language)}`,
            content: sourcecode,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `http error status:${response.status}`,
      };
    }

    const data = await response.json();

    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    if (stderr) {
      return {
        success: false,
        output: output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
