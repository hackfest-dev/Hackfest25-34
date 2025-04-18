import { NextResponse } from "next/server";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const lat = searchParams.get("lat");
	const lng = searchParams.get("lng");

	const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

	const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&language=en&pretty=1`;

	try {
		const res = await fetch(url);
		const data = await res.json();

		if (data.results.length === 0) {
			return NextResponse.json(
				{ error: "No results found" },
				{ status: 404 }
			);
		}

		const components = data.results[0].components;

		return NextResponse.json({
			country: components.country || "",
			state: components.state || "",
			city:
				components.city || components.town || components.village || "",
			village: components.village || "",
		});
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
