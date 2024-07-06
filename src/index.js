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


const file = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            outline:1px solid red !important;
        }
        
        body {
            background-color: #202020;
            align-items: center;
            justify-content: center;
            display:flex
        }
        
        .container {
            padding-right:50px;
            padding-left:50px;
            padding-top: 10px;
            padding-bottom: 20px;
            background-color: #000000;
            border-radius: 10px;
            margin-top:10%
        }
        
        .text {
            color: white;
            text-align: center;
        }
        label {
            color: white;
            text-align: center;
        }
    </style>
    <title>Carbon Emmissions for flight calculator</title>
    <script>
    async function calculate()
    {
        let numOfPassengers = document.getElementById("passengers").value;
        let departure = document.getElementById("departure").value;
        let travelClass = document.getElementById("class").value;
        let destination = document.getElementById("destination").value;
        let roundTrip = document.getElementById("roundtrip").checked;
        
        let response
        
        await fetch("http://localhost:8787/emmissions?numOfPassengers=" + numOfPassengers + "&departure=" + departure + "&cabinClass=" + travelClass + "&destination=" + destination).then(async data => {response = await data.json()});
		console.log(response)
		console.log(response.data)
        console.log(response.data.attributes)
		document.getElementById("results").innerHTML = \`CO2 emmissions: \${response.data.attributes.carbon_kg} kg or \${response.data.attributes.carbon_lb} lb!!\`
    }
</script>
</head>
<body>
    <div class="container">
        <h2 class = "text">Measure your carbon emmissions from your next flight!</h2>
        <br>
        <form >
            <label for="passengers">Number of passengers:</label>
            <input type="number" id="passengers" name="passengers" placeholder="Number of passengers" required>
            <br>
            <label for="departure">Departure Airport Code (Should be 3 letters, ex: DFW)</label>
            <input type="text" id="departure" name="departure" required>
            <br>
            <label for="destination">Departure Airport Code (Should be 3 letters, ex: DFW)</label>
            <input type="text" id="destination" name="destination" required>
            <br>
            <label for="class">Class:</label>
            <select id="class" name="class">
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
            </select>
            <br>
            <label for="roundtrip">Round trip:</label>
            <input type="checkbox" id="roundtrip" name="roundtrip">
            <br>
        </form>
        
        <button onclick="calculate()" id="bruh">Submit</button>
            
            <br><br>
            <p id="results" class="text"></p>
        </div>
    </body>
    </html>
`
export default {
	async fetch(request, env, ctx) {
		const url = request.url

		
		if (url.includes('/emmissions')) {
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
		else
		{
			return new Response(file, { headers: {
        "content-type": "text/html;charset=UTF-8",
      },})
		}
		
	},
};
