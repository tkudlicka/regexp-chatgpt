import type { APIRoute } from 'astro';
import { config } from  'dotenv';
config();
import axios from 'axios';

/* 
  * Function to make a prompt to the OpenAI API
  * @param query - The query to be used in the prompt
  * @returns The response from the API
  * 
*/
async  function makePrompt(query: string)  {
  const { data: response } = await axios.post('https://api.openai.com/v1/completions', {
      model: "text-davinci-002",
      prompt: `Write me a reguler expression that match ${query}`,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    },
      {
        headers: {
          ContentType: 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
  return response;
}

/*
  * Function to handle the POST request
  * @param request - The request object
  * @returns The response object
*/
export const post: APIRoute = async ({ request }) => {
  try {
    const json = <{
      query: string
    }>await request.json();
    const response = await makePrompt(json.query);
    return {
      body: JSON.stringify({
        regexp: response.choices[0].text.trim(),
      })
    }
  } catch (error) {
    return new Response(null, {
      status: 500,
      statusText: (error as Error).message
    });
  }
}
