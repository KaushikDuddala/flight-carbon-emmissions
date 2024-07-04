/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const token = require("../config.json").carbonEmmissionsToken

const url2 = 'https://www.carboninterface.com/api/v1/estimates';

const options = {
	'Authorization': `Bearer ${token}`,
	'Content-Type': 'application/json',
};



export default {
	async fetch(request, env, ctx) {
		const url = request.url

		
		if (url.includes('emmissions')) {
			const { searchParams } = new URL(request.url)
			const body = {
				type: "flight",
				passengers: searchParams.get("numOfPassengers"),
				legs: [
					{ departure_airport: searchParams.get("departure"), destination_airport: searchParams.get("destination"), cabin_class: searchParams.get("cabinClass")}
				]
			};


			const data = await fetch(url2, {
				method:"POST",
				headers: options,
				body: JSON.stringify(body)
			}).then(response => { return response.json() })

			return new Response(JSON.stringify(data), {
				headers: { 'content-type': 'application/json' },
			});
		}
		
	},
};
