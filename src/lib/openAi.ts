import { Configuration, OpenAIApi } from "openai";


export class OpenAI{
    private configuration: Configuration;
    private openai: OpenAIApi;
    private prompt: string[];

    constructor(){
        this.configuration = new Configuration({
            apiKey: process.env.OPENAPI_KEY,
          });
        this.openai = new OpenAIApi(this.configuration);
        this.prompt = [];
    }

    private async send(){
        const response = await this.openai.createCompletion({
            model: "text-davinci-003",
            prompt: this.prompt.join('\n'),
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        });
    

        return response.data.choices[0].text;
    }

    private appendHumanPrompt(message:string){
        this.prompt.push(`Human: ${message}`);
        this.prompt.push('AI:');
    }

    private appendAIPrompt(message:string| undefined){
        this.prompt[this.prompt.length-1] = this.prompt[this.prompt.length-1]+message;
    }
    async chat(message:string){
        this.appendHumanPrompt(message);

        const receiveMsg = await this.send();
        this.appendAIPrompt(receiveMsg);
        
        return receiveMsg;
    }

}