import { httpRouter } from "convex/server";
import {WebhookEvent} from "@clerk/nextjs/server";
import {Webhook} from 'svix';
import {api} from './_generated/api';
import {httpAction} from './_generated/server';
import { X } from "lucide-react";


const http = httpRouter();

http.route({
    path:'/clerk-webhook',
    method:'POST',
    handler: httpAction(async (ctx, request) => {
        const webhook = process.env.CLERK_SECRET_KEY;
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
                "svix_id":svix_id,
                "svix_signature":svix_sig,
                "svix_timestamp":svix_timestamp,
            }) as WebhookEvent;
            if(evt.type === 'user.created') 
                {}
        }catch(e) {
            console.error(e);
            return new Response('Invalid payload', {status: 400});
        }
    })
})