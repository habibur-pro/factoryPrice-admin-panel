import { NextResponse } from "next/server";
import axios from "axios";

// Map country name → currency code
const countryToCurrency: Record<string, string> = {
  Bangladesh: "BDT",
  India: "INR",
  USA: "USD",
  UK: "GBP",
  Japan: "JPY",
  Canada: "CAD",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "Bangladesh";
  const amount = searchParams.get("amount") || "1";

  const currency = countryToCurrency[country];
  if (!currency) {
    return NextResponse.json({ error: "Unsupported country" }, { status: 400 });
  }

  try {
    // Call ExchangeRate Host API
    const res = await axios.get(`https://api.exchangerate.host/convert`, {
      params: {
        from: "USD",
        to: currency,
        amount: amount,
      },
    });

    const data = res.data;
    return NextResponse.json({
      country,
      currency,
      rate: data.info.rate,
      converted: data.result, // converted amount
      message: `${amount} USD = ${data.result} ${currency}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch conversion" },
      { status: 500 }
    );
  }
}
