import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  const code = req.body.code || '';
  const language = req.body.languages;
  const service = req.body.service;
  if (code.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter the program language",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(code, language, service),
      temperature: 0.6,
      max_tokens: 1100
    });

    //JH
    /*var spaceInfo = {}
    var r = completion.data.choices[0].text.split("\n");
    for(var i=0; i<r.length; i++){
      for(var j=0; j<r[i].length;j++) {
        if(j == 0){
          spaceInfo[i] = 0;
        } else{
          if(r[i][j] == " "){
            spaceInfp[i] += 1;
          } else{
            break;
          }
        }
      }
    }*/

    res.status(200).json({ result: completion.data.choices[0].text.split("\n") });
    console.log(completion.data)
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(code, language, service) {
  let aiInput = "";
  if (service === "Grade") {
    aiInput = `Review ${language} code here ${code}.
    Give a score of code out of 10.0 in decimal.
    If code was incomplete, give 0.0 out of 10.0 for the score, then give recommendations how to complete.
    If code was complete, critically analyze code and give recommendations to do better.

    Scores:
    Recommendations:`
  } else {
    aiInput = `Read ${language} code here ${code}.
    Return back the code that I gave with good comments using ${language} commenting style.
    Please dont give comments for every single line.`
  }
return aiInput;
}