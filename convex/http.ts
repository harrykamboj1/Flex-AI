import { httpRouter } from "convex/server";
import {WebhookEvent} from "@clerk/nextjs/server";
import {Webhook} from 'svix';
import {api} from './_generated/api';
import {httpAction} from './_generated/server';


const http = httpRouter();

http.route({
    path:'/clerk-webhook',
    method:'POST',
    handler: httpAction(async (ctx, request) => {
        const webhook = process.env.CLERK_WEBHOOK_SECRET;
        if(!webhook) {
            throw new Error('Webhook secret not set');
        }
       
        const svix_id = request.headers.get('svix-id');
        const svix_sig = request.headers.get('svix-signature');
        const svix_timestamp = request.headers.get('svix-timestamp');
        if(!svix_id || !svix_sig || !svix_timestamp) {
            return new Response('Missing headers', {status: 400});
        }


        const payload = await request.json();
        const body = JSON.stringify(payload);
        const wh = new Webhook(webhook);
        let evt:WebhookEvent;

        try{
            evt = wh.verify(body, {
                "svix-id": svix_id!,
                "svix-signature": svix_sig!,
                "svix-timestamp": svix_timestamp!,
            }) as WebhookEvent;
            if(evt.type === 'user.created'){
                const {id,first_name,last_name,image_url,email_addresses} = evt.data;
                const email = email_addresses[0].email_address;
                const name = `${first_name || ""} ${last_name || ""}`.trim();
                try{
                    await ctx.runMutation(api.users.syncUser, {
                        email,
                        name,
                        image :image_url,
                        clerkId:id,
                    })
                }catch(e){
                    console.log("Error creating user :: " + e)
                }
            }

            return new Response('Webhook processed successfully', {status: 200});
        }catch(e) {
            console.error(e);
            return new Response('Invalid payload', {status: 500});
        }
    })
})

export default http;