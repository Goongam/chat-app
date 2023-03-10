import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";


export class OpenAI{
    private configuration: Configuration;
    private openai: OpenAIApi;
    private prompt: Array<ChatCompletionRequestMessage>;

    constructor(){
        this.configuration = new Configuration({
            apiKey: process.env.OPENAPI_KEY,
          });
        this.openai = new OpenAIApi(this.configuration);
        this.prompt = [];
    }

    private async send(){
        const response = await this.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: this.prompt,
          }).catch((error)=>{
            console.error('AIerror');

          });

        if(!response) return {content:'너무 많은 요청이 들어왔습니다. 잠시후 다시 이용해 주세요'};

        const receiveMsg = response.data.choices[0].message;
        if(receiveMsg) this.appendPrompt('assistant',receiveMsg.content);
        return receiveMsg;
    }

    private appendPrompt(role:'user'|'assistant',message: string) {
        this.prompt.push({
            role,
            content:message,
        });
    }

    async chat(message:string){
        this.appendPrompt('user', message);

        const receiveMsg = await this.send();

        return receiveMsg?.content;
    }

}